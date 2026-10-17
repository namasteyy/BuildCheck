from ..extensions import db
from flask_security import UserMixin, RoleMixin
import datetime

# This table connects Users and Roles (Many-to-Many)
# We need this so a user can have multiple roles
roles_users = db.Table('roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)

# Role model for Flask-Security
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

# User model for authentication
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    username = db.Column(db.String(255), unique=True, nullable=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary=roles_users, backref=db.backref('users', lazy='dynamic'))
    
    # Relationships to profile details
    student_profile = db.relationship('StudentProfile', backref='user', uselist=False)
    company_profile = db.relationship('CompanyProfile', backref='user', uselist=False)

# Profile details for a Student
class StudentProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    cgpa = db.Column(db.Float, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    degree = db.Column(db.String(50), nullable=True) 
    year = db.Column(db.Integer, nullable=True) 
    resume_link = db.Column(db.String(255))
    status = db.Column(db.String(20), default='Active') # Can be Active, Placed, etc.
    report_format = db.Column(db.String(10), default='HTML') # HTML or PDF

# Profile details for a Company
class CompanyProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    website = db.Column(db.String(255))
    industry = db.Column(db.String(100))
    status = db.Column(db.String(20), default='Pending') # Companies need admin approval

# Placement Drive info
class PlacementDrive(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_id = db.Column(db.Integer, db.ForeignKey('company_profile.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    criteria_cgpa = db.Column(db.Float, default=0.0)
    criteria_branch = db.Column(db.String(200))
    criteria_degree = db.Column(db.String(100))
    criteria_year = db.Column(db.Integer)
    package = db.Column(db.String(50))
    deadline = db.Column(db.DateTime, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    status = db.Column(db.String(20), default='Pending') 

    company = db.relationship('CompanyProfile', backref='drives')

# Application model to track who applied where
class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    drive_id = db.Column(db.Integer, db.ForeignKey('placement_drive.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('student_profile.id'), nullable=False)
    date_applied = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    status = db.Column(db.String(20), default='Applied') # Applied, Accepted, Rejected

    drive = db.relationship('PlacementDrive', backref='applications')
    student = db.relationship('StudentProfile', backref='applications')

# To track background job execution for the Admin demo
class SystemJobLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), nullable=False) # Success, Failed, Started
    message = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
