# These are the API routes for Student actions
from flask import Blueprint, jsonify, request, send_file
from flask_security import roles_required, current_user
from ..extensions import db, cache
from ..models import StudentProfile, PlacementDrive, CompanyProfile, Application
import datetime
import os
import glob

# Create a blueprint for student-related tasks
student_bp = Blueprint('student', __name__)

# This route lets students view and update their profile
@student_bp.route('/profile', methods=['GET', 'POST'])
@roles_required('student') # Only students can access this
def profile():
    # My profile data
    my_profile = current_user.student_profile
    
    if request.method == 'POST':
        # Get data from frontend
        data = request.get_json()
        
        # Update each field one by one
        my_profile.name = data.get('name', my_profile.name)
        my_profile.cgpa = data.get('cgpa', my_profile.cgpa)
        my_profile.degree = data.get('degree', my_profile.degree)
        my_profile.department = data.get('department', my_profile.department)
        my_profile.resume_link = data.get('resume_link', my_profile.resume_link)
        my_profile.report_format = data.get('report_format', my_profile.report_format)
        
        # Save changes to the SQLite database
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully!'})
        
    # Send profile data back to Vue as JSON
    return jsonify({
        'name': my_profile.name,
        'cgpa': my_profile.cgpa,
        'degree': my_profile.degree,
        'department': my_profile.department,
        'resume_link': my_profile.resume_link,
        'report_format': my_profile.report_format
    })

# Helper function to create a unique cache key for each student
def make_student_cache_key():
    return f"open_drives_{current_user.id}_{request.args.get('q', '')}"

# Get all "Open" drives that the student is eligible for
@student_bp.route('/drives/open', methods=['GET'])
@roles_required('student')
@cache.cached(timeout=300, make_cache_key=make_student_cache_key)
def get_open_drives():
    student_obj = current_user.student_profile
    if not student_obj:
        return jsonify([])
        
    # Check if there is a search query in the URL
    search_query = request.args.get('q', '')
    
    # Filter drives by status and CGPA criteria
    query = PlacementDrive.query.filter(
        PlacementDrive.status == 'Open',
        PlacementDrive.criteria_cgpa <= student_obj.cgpa
    )
    
    # If student is searching for something specific
    if search_query:
        search_filter = f"%{search_query}%"
        query = query.join(CompanyProfile).filter(
            (PlacementDrive.title.ilike(search_filter)) | 
            (CompanyProfile.name.ilike(search_filter))
        )
    
    drives_list = query.all()
    final_output = []
    student_dept = student_obj.department.lower().strip()
    
    for d in drives_list:
        # Check branch criteria
        if d.criteria_branch:
            allowed_branches = [b.strip().lower() for b in d.criteria_branch.split(',')]
            if student_dept not in allowed_branches:
                continue

        # Add drive details to our result list
        final_output.append({
            'id': d.id,
            'company': d.company.name,
            'title': d.title,
            'description': d.description,
            'criteria_cgpa': d.criteria_cgpa,
            'deadline': d.deadline.isoformat(),
            'package': d.package
        })
    return jsonify(final_output)

# Apply for a specific placement drive
@student_bp.route('/apply/<int:drive_id>', methods=['POST'])
@roles_required('student')
def apply_drive(drive_id):
    drive_obj = PlacementDrive.query.get_or_404(drive_id)
    student_obj = current_user.student_profile
    
    # Check if student already placed
    if student_obj.status == 'Placed':
        return jsonify({'message': 'You are already placed!'}), 400

    # 1. CGPA Check
    if student_obj.cgpa < drive_obj.criteria_cgpa:
        return jsonify({'message': f'Required CGPA is {drive_obj.criteria_cgpa}'}), 400
        
    # 2. Branch Check
    if drive_obj.criteria_branch:
        allowed = [b.strip().lower() for b in drive_obj.criteria_branch.split(',')]
        if student_obj.department.lower().strip() not in allowed:
            return jsonify({'message': 'Your department is not eligible.'}), 400
            
    # 3. Degree Check
    if drive_obj.criteria_degree and student_obj.degree:
        if drive_obj.criteria_degree.lower().strip() != student_obj.degree.lower().strip():
            return jsonify({'message': f'Required degree: {drive_obj.criteria_degree}'}), 400
            
    # 4. Year Check
    if drive_obj.criteria_year and student_obj.year:
        if drive_obj.criteria_year != student_obj.year:
            return jsonify({'message': f'Only for batch {drive_obj.criteria_year}'}), 400

    # Check if student already applied to this drive
    old_app = Application.query.filter_by(drive_id=drive_obj.id, student_id=student_obj.id).first()
    if old_app:
        return jsonify({'message': 'Already applied!'}), 400
        
    # Save the application
    new_app = Application(drive_id=drive_obj.id, student_id=student_obj.id)
    db.session.add(new_app)
    db.session.commit()
    
    # Clear cache so list updates on frontend
    cache.delete_memoized(get_open_drives)
    cache.delete_memoized(get_companies)
    
    return jsonify({'message': 'Applied successfully!'}), 201

# Get list of all approved companies
@student_bp.route('/companies', methods=['GET'])
@roles_required('student')
@cache.cached(timeout=600) # 10 minute cache
def get_companies():
    comp_list = CompanyProfile.query.filter_by(status='Approved').all()
    
    s_cgpa = current_user.student_profile.cgpa if current_user.student_profile else 0.0
    s_dept = current_user.student_profile.department.lower().strip() if current_user.student_profile and current_user.student_profile.department else ''

    final_results = []
    for c in comp_list:
        # Check if company has at least one drive student can join
        can_apply = False
        for d in c.drives:
            if d.status == 'Open' and d.criteria_cgpa <= s_cgpa:
                if not d.criteria_branch:
                    can_apply = True
                    break
                allowed = [b.strip().lower() for b in d.criteria_branch.split(',')]
                if s_dept in allowed:
                    can_apply = True
                    break
        
        final_results.append({
            'id': c.id,
            'name': c.name,
            'website': c.website,
            'industry': c.industry,
            'has_eligible_drives': can_apply
        })
    return jsonify(final_results)

# Details of a company and its drives
@student_bp.route('/companies/<int:company_id>', methods=['GET'])
@roles_required('student')
def get_company_details(company_id):
    c = CompanyProfile.query.get_or_404(company_id)
    all_drives = PlacementDrive.query.filter_by(company_id=c.id, status='Open').all()
    
    s_cgpa = current_user.student_profile.cgpa if current_user.student_profile else 0.0
    s_dept = current_user.student_profile.department.lower().strip() if current_user.student_profile and current_user.student_profile.department else ''

    d_list = []
    for d in all_drives:
        # Check eligibility
        eligible = False
        if d.criteria_cgpa <= s_cgpa:
            branch_ok = True
            if d.criteria_branch:
                allowed = [b.strip().lower() for b in d.criteria_branch.split(',')]
                if s_dept not in allowed: branch_ok = False
            
            degree_ok = True
            if d.criteria_degree and current_user.student_profile.degree:
                if d.criteria_degree.lower().strip() != current_user.student_profile.degree.lower().strip(): degree_ok = False
            
            year_ok = True
            if d.criteria_year and current_user.student_profile.year:
                if d.criteria_year != current_user.student_profile.year: year_ok = False
                    
            if branch_ok and degree_ok and year_ok:
                eligible = True
                
        d_list.append({
            'id': d.id,
            'title': d.title,
            'deadline': d.deadline.isoformat(),
            'description': d.description,
            'requirements': d.requirements,
            'package': d.package,
            'is_eligible': eligible
        })
        
    return jsonify({
        'id': c.id,
        'name': c.name,
        'description': c.description,
        'website': c.website,
        'drives': d_list
    })

# Show applications made by me
@student_bp.route('/my-applications', methods=['GET'])
@roles_required('student')
def my_applications():
    user_apps = Application.query.filter_by(student_id=current_user.student_profile.id).all()
    results = []
    for a in user_apps:
        results.append({
            'id': a.id,
            'drive_title': a.drive.title,
            'company': a.drive.company.name,
            'status': a.status,
            'date': a.date_applied.isoformat()
        })
    return jsonify(results)

# Let students trigger the CSV export batch job
@student_bp.route('/export/csv', methods=['POST'])
@roles_required('student')
def export_csv():
    from ..tasks import export_drives_csv
    student_id = current_user.student_profile.id
    # Trigger background job asynchronously
    export_drives_csv.delay(student_id)
    return jsonify({'message': 'Export work started!', 'student_id': student_id})

# Download the student's latest exported CSV file
@student_bp.route('/export/download', methods=['GET'])
@roles_required('student')
def download_csv():
    student_id = current_user.student_profile.id
    # Find the most recent CSV file for this student
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'instance'))
    pattern = os.path.join(base_dir, f'my_export_{student_id}_*.csv')
    files = glob.glob(pattern)
    if not files:
        return jsonify({'message': 'No export found. Please trigger an export first.'}), 404
    # Sort by modification time, get the newest
    latest_file = max(files, key=os.path.getmtime)
    filename = os.path.basename(latest_file)
    return send_file(
        latest_file,
        mimetype='text/csv',
        as_attachment=True,
        download_name=filename
    )
