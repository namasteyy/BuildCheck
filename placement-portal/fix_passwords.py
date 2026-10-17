from backend.app import create_app
from backend.extensions import db
from backend.models import User
from flask_security.utils import hash_password

app = create_app()

with app.app_context():
    # Fix Admin
    admin = User.query.filter_by(email='admin@institute.com').first()
    if admin:
        admin.password = hash_password('admin')
        admin.active = True
        print(f"Admin {admin.email} reset to 'admin'")
    
    # Fix Priya (Student)
    priya = User.query.filter_by(email='priya.gupta47@student.edu').first()
    if priya:
        priya.password = hash_password('student')
        priya.active = True
        print(f"Student {priya.email} reset to 'student'")
    else:
        print("Student priya.gupta47@student.edu NOT FOUND!")

    # Fix Careers (Company)
    google = User.query.filter_by(email='careers@google.com').first()
    if google:
        google.password = hash_password('company')
        google.active = True
        print(f"Company {google.email} reset to 'company'")

    db.session.commit()
    print("Done!")
