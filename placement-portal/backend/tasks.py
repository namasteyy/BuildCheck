# This file handles all the background jobs like email and reports
# Using celery for this so it doesn't slow down the website
from .extensions import celery, db
from .models import Application, PlacementDrive, StudentProfile, User, SystemJobLog
import csv
import time
import smtplib
import requests
import io
try:
    from xhtml2pdf import pisa
except ImportError:
    pisa = None
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from flask import current_app
import datetime

# Helper function to turn HTML into a PDF file
def generate_pdf(html_text):
    if not pisa:
        print("xhtml2pdf not installed, skipping PDF generation")
        return None
    # We use a memory buffer to store the PDF
    output_pdf = io.BytesIO()
    # Convert HTML to PDF using pisa library
    status = pisa.CreatePDF(io.BytesIO(html_text.encode("utf-8")), dest=output_pdf)
    if status.err:
        print("PDF Error happened")
        return None
    return output_pdf.getvalue()

# Student clicks export button and this runs in background
@celery.task
def export_drives_csv(student_id):
    # Find the student first
    stud = db.session.get(StudentProfile, student_id)
    if not stud:
        return "Student not found in DB"
        
    import os
    if not os.path.exists("./instance/"):
        os.makedirs("./instance/")
        
    # Filename with timestamp so it is unique
    fname = f"my_export_{student_id}_{int(time.time())}.csv"
    fpath = f"./instance/{fname}"
    
    # Get all applications this student made
    apps = Application.query.filter_by(student_id=student_id).all()
    
    # Writing to CSV file
    with open(fpath, 'w', newline='') as f:
        writer = csv.writer(f)
        # Table headers
        writer.writerow(['Student ID', 'Company Name', 'Drive Title', 'Application Status', 'Dates'])
        for a in apps:
            writer.writerow([
                student_id,
                a.drive.company.name,
                a.drive.title,
                a.status,
                a.date_applied.strftime('%d-%m-%Y')
            ])
            
    # Send email notification after file is ready
    if stud.user and stud.user.email:
        subj = "Export Work Finished!"
        body = f"Hello {stud.name},\n\nYour placement history export is done. Filename: {fname}\n\nCheck it out!"
        send_mail(stud.user.email, subj, body)
        
    # Log the successful export
    new_log = SystemJobLog(
        job_name="Export CSV", 
        status="Success", 
        message=f"Exported data for {stud.name} (File: {fname})"
    )
    db.session.add(new_log)
    db.session.commit()
            
    return f"Exported to {fname}"

# My main email function (supports HTML and Attachments)
def send_mail(to_email, subject, msg_text, is_html=False, file_data=None, file_name=None):
    conf = current_app.config
    msg = MIMEMultipart()
    msg['From'] = conf['MAIL_DEFAULT_SENDER']
    msg['To'] = to_email
    msg['Subject'] = subject
    
    # Attach body
    if is_html:
        msg.attach(MIMEText(msg_text, 'html'))
    else:
        msg.attach(MIMEText(msg_text, 'plain'))
        
    # Attach file if we have one (like PDF)
    if file_data:
        attachment = MIMEApplication(file_data)
        attachment.add_header('Content-Disposition', 'attachment', filename=file_name)
        msg.attach(attachment)
        
    try:
        # Standard SMTP setup
        s = smtplib.SMTP(conf['MAIL_SERVER'], conf['MAIL_PORT'])
        if conf.get('MAIL_USE_TLS'):
            s.starttls()
        # Only login if we have credentials
        if conf.get('MAIL_USERNAME'):
            s.login(conf['MAIL_USERNAME'], conf['MAIL_PASSWORD'])
        s.send_message(msg)
        s.quit()
        return True
    except Exception as e:
        print(f"Failed to send mail: {str(e)}")
        return False

# Hits the Google Chat webhook for Admin
def send_gchat_webhook(msg):
    url = current_app.config.get('GCHAT_WEBHOOK_URL')
    if not url: return False
    try:
        requests.post(url, json={"text": msg}, timeout=5)
        return True
    except:
        return False

# Reminder job (runs every day)
@celery.task
def send_daily_reminder():
    right_now = datetime.datetime.utcnow()
    # Check drives closing in next 3 days
    future_3d = right_now + datetime.timedelta(days=3)
    
    drives = PlacementDrive.query.filter(
        PlacementDrive.deadline > right_now,
        PlacementDrive.deadline <= future_3d,
        PlacementDrive.status == 'Open'
    ).all()
    
    if not drives:
        return "No upcoming deadlines today"
        
    # Find all students who are not placed yet
    students = StudentProfile.query.filter_by(status='Active').all()
    
    # Build the message string
    reminder_list = "Upcoming Deadlines:\n"
    for d in drives:
        reminder_list += f"-> {d.title} at {d.company.name} (Deadline: {d.deadline.strftime('%d-%m-%Y')})\n"
    
    # Loop and send to each student
    total = 0
    for s in students:
        if s.user and s.user.email:
            email_body = f"Hey {s.name},\n\nApply soon for these drives:\n\n{reminder_list}"
            # Demonstration of multiple channels (SMS, Webhook, Mail)
            send_mail(s.user.email, "Reminder: Drives Closing Soon!", email_body)
            # Simulated student-webhook for demo
            print(f"SIMULATED: Sending Webhook Reminder to {s.name}")
            total = total + 1
            
    # Tell the admin too
    send_gchat_webhook(f"Reminders sent to {total} students for {len(drives)} drives.")
    
    # Log the event
    new_log = SystemJobLog(
        job_name="Daily Reminders", 
        status="Success", 
        message=f"Sent {total} reminders for {len(drives)} upcoming drives."
    )
    db.session.add(new_log)
    db.session.commit()
    
    return f"Done sending {total} reminders"

# Monthly report for the placement head (Admin)
@celery.task
def generate_monthly_report():
    today = datetime.datetime.utcnow()
    last_month = today - datetime.timedelta(days=30)
    
    # Count stuff from the last month
    drives_done = PlacementDrive.query.filter(PlacementDrive.date_created >= last_month).count()
    apps_got = Application.query.filter(Application.date_applied >= last_month).count()
    selected = Application.query.filter(Application.status == 'Selected', Application.date_applied >= last_month).count()
    total_placed = StudentProfile.query.filter_by(status='Placed').count()
    
    # HTML template with basic table
    html_report = f"""
    <html>
    <body>
        <h2 style="color: blue;">Monthly Placement Statistics Report</h2>
        <p>Stats for the last 30 days:</p>
        <table border="1" cellpadding="10" style="border-collapse: collapse;">
            <tr><td>Drives Conducted</td><td>{drives_done}</td></tr>
            <tr><td>Total Applications</td><td>{apps_got}</td></tr>
            <tr><td>Students Selected</td><td>{selected}</td></tr>
            <tr><td><b>Grand Total Placed</b></td><td><b>{total_placed}</b></td></tr>
        </table>
        <p>Report Date: {today.strftime('%d %B %Y')}</p>
    </body>
    </html>
    """
    
    admin_mail = current_app.config.get('ADMIN_EMAIL')
    if admin_mail:
        send_mail(admin_mail, f"Monthly Report - {today.strftime('%m/%Y')}", html_report, is_html=True)
    
    # Log the report generation
    new_log = SystemJobLog(
        job_name="Monthly Admin Report", 
        status="Success", 
        message=f"Generated and sent monthly activity report to Admin ({admin_mail})."
    )
    db.session.add(new_log)
    db.session.commit()
        
    return "Admin report sent"

# Scheduled task to send personalized monthly activity reports to students
@celery.task
def send_student_monthly_report():
    today = datetime.datetime.utcnow()
    one_month_ago = today - datetime.timedelta(days=30)
    
    all_students = StudentProfile.query.all()
    count = 0
    
    for student in all_students:
        if not (student.user and student.user.email):
            continue
            
        apps = Application.query.filter(
            Application.student_id == student.id,
            Application.date_applied >= one_month_ago
        ).all()
        
        if not apps:
            continue
            
        # Create HTML content for the report
        rows_html = ""
        for app in apps:
            rows_html += f"""
            <tr>
                <td>{app.drive.title}</td>
                <td>{app.drive.company.name}</td>
                <td>{app.status}</td>
                <td>{app.date_applied.strftime('%Y-%m-%d')}</td>
            </tr>
            """
            
        my_html = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Helvetica, Arial, sans-serif; color: #444; }}
                .container {{ padding: 20px; border: 2px solid #007bff; border-radius: 10px; }}
                h1 {{ color: #007bff; text-align: center; }}
                table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
                th, td {{ border: 1px solid #eee; padding: 10px; text-align: left; }}
                th {{ background-color: #f8f9fa; color: #007bff; }}
                .footer {{ margin-top: 20px; font-size: 10px; color: #aaa; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Monthly Placement Activity</h1>
                <p>Hi <b>{student.name}</b>,</p>
                <p>Here is your placement application activity summary for the last 30 days:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Drive Title</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Date Applied</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows_html}
                    </tbody>
                </table>
                <div class="footer">
                    Generated on {today.strftime('%Y-%m-%d')} | Placement Portal
                </div>
            </div>
        </body>
        </html>
        """
        
        subject = f"Your Monthly Placement Report - {today.strftime('%B %Y')}"
        attachment = None
        attachment_name = None
        
        # Check student's preferred format
        if student.report_format == 'PDF':
            pdf_bytes = generate_pdf(my_html)
            if pdf_bytes:
                attachment = pdf_bytes
                attachment_name = f"Monthly_Report_{today.strftime('%m_%Y')}.pdf"
                message = f"Hi {student.name},\n\nPlease find your monthly placement activity report attached as a PDF."
                send_mail(student.user.email, subject, message, is_html=False, file_data=attachment, file_name=attachment_name)
            else:
                # Fallback to HTML if PDF fails
                send_mail(student.user.email, subject, my_html, is_html=True)
        else:
            # Standard HTML email
            send_mail(student.user.email, subject, my_html, is_html=True)
            
        count += 1
        
    return f"Sent monthly reports to {count} students"
