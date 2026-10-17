from flask import Blueprint, request, jsonify
from flask_security import login_user, logout_user, current_user, auth_required
from ..extensions import db, security
from ..models import User, Role, StudentProfile, CompanyProfile, roles_users
from flask_security.utils import hash_password, verify_password

# Authentication blueprint for login and register
auth_bp = Blueprint('auth', __name__)

# Login route
@auth_bp.route('/login', methods=['POST'])
def login():
    # Get JSON data from the request
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Please provide email and password'}), 400

    # Find the user by email
    user_obj = User.query.filter_by(email=email).first()

    if not user_obj:
        return jsonify({'message': 'Sorry, user not found!'}), 404

    # Check if password is correct
    if not verify_password(password, user_obj.password):
        return jsonify({'message': 'Wrong password!'}), 401

    # Check if account is active (Approved by admin)
    if not user_obj.active:
        return jsonify({'message': 'Your account is currently disabled or pending approval.'}), 403

    # Log the user into the session
    login_user(user_obj, remember=True)
    
    # Get user role for the frontend
    my_role = user_obj.roles[0].name if user_obj.roles else 'student'
    
    return jsonify({
        'message': 'Login successful!',
        'token': user_obj.get_auth_token(),
        'user': {
            'id': user_obj.id,
            'email': user_obj.email,
            'role': my_role
        }
    })

# Register route for new students and companies
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role_choice = data.get('role', 'student') # Default to student

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'This email is already registered!'}), 400

    ds = security.datastore
    
    try:
        # Create the user in the database
        # Students are active immediately, companies need admin to approve them
        is_active = True if role_choice == 'student' else False
        
        new_user = ds.create_user(
            email=email, 
            password=hash_password(password),
            active=is_active
        )
        
        # Give them the selected role
        my_role = Role.query.filter_by(name=role_choice).first()
        if not my_role:
            # Create role if missing (only for first setup)
            my_role = ds.create_role(name=role_choice)
        
        ds.add_role_to_user(new_user, my_role)
        
        # Create a basic profile depending on the role
        if role_choice == 'student':
            stud_p = StudentProfile(
                user_id=new_user.id,
                name=data.get('name', 'New Student'),
                cgpa=float(data.get('cgpa', 0.0)),
                department=data.get('department', 'General'),
                degree=data.get('degree', '')
            )
            db.session.add(stud_p)
        elif role_choice == 'company':
            comp_p = CompanyProfile(
                user_id=new_user.id,
                name=data.get('name', 'New Company'),
                status='Pending'
            )
            db.session.add(comp_p)
            
        db.session.commit()
        return jsonify({'message': 'Registration successful!', 'user_id': new_user.id}), 201
        
    except Exception as err:
        db.session.rollback()
        return jsonify({'message': f'Registration failed: {str(err)}'}), 500

# Logout route
@auth_bp.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({'message': 'Logged out!'})

# Get basic info about the currently logged in user
@auth_bp.route('/profile', methods=['GET'])
@auth_required('token', 'session')
def get_user_info():
    curr = current_user
    r_name = curr.roles[0].name if curr.roles else 'unknown'
    display_name = "User"
    current_status = "Approved"
    
    # Check profiles to get real name and status
    if r_name == 'student' and curr.student_profile:
        display_name = curr.student_profile.name
        current_status = curr.student_profile.status
    elif r_name == 'company' and curr.company_profile:
        display_name = curr.company_profile.name
        current_status = curr.company_profile.status
    
    return jsonify({
        'email': curr.email,
        'role': r_name,
        'name': display_name,
        'status': current_status
    })
