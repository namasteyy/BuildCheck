from flask import Blueprint, jsonify, request
from flask_security import roles_required, current_user
from ..extensions import db, cache
from ..models import PlacementDrive, Application, StudentProfile
import datetime

# Blueprint for all company-related API calls
company_bp = Blueprint('company', __name__)

# Route for a company to create a new recruitment drive
@company_bp.route('/drives', methods=['POST'])
@roles_required('company')
def create_drive():
    post_data = request.get_json()
    
    # Only approved companies can create drives
    company_obj = current_user.company_profile
    if not company_obj or company_obj.status != 'Approved':
        return jsonify({'message': 'Wait for admin to approve your profile first!'}), 403

    try:
        # Create the drive object with data from frontend
        new_drive = PlacementDrive(
            company_id=company_obj.id,
            title=post_data['title'],
            description=post_data['description'],
            requirements=post_data.get('requirements', ''),
            criteria_cgpa=float(post_data.get('criteria_cgpa', 0)),
            criteria_branch=post_data.get('criteria_branch', ''),
            criteria_degree=post_data.get('criteria_degree', ''),
            criteria_year=post_data.get('criteria_year'),
            package=post_data.get('package', 'Not Disclosed'),
            # Convert date string to python datetime
            deadline=datetime.datetime.strptime(post_data['deadline'], '%Y-%m-%d')
        )
        db.session.add(new_drive)
        db.session.commit()
        
        # Invalidate student list and admin stats cache
        from .student import get_open_drives, get_companies
        from .admin import get_stats
        cache.delete_memoized(get_open_drives)
        cache.delete_memoized(get_companies)
        cache.delete_memoized(get_stats)

        return jsonify({'message': 'Drive has been created!', 'id': new_drive.id}), 201
    except Exception as err:
        return jsonify({'message': f'Error: {str(err)}'}), 400

# Get a list of all drives created by the current company
@company_bp.route('/drives', methods=['GET'])
@roles_required('company')
def get_my_drives():
    my_id = current_user.company_profile.id
    my_drives = PlacementDrive.query.filter_by(company_id=my_id).all()
    
    output_list = []
    for d in my_drives:
        output_list.append({
            'id': d.id,
            'title': d.title,
            'status': d.status,
            'package': d.package,
            'deadline': d.deadline.isoformat(),
            'applicant_count': len(d.applications)
        })
    return jsonify(output_list)

# Get details for a specific drive (for editing)
@company_bp.route('/drives/<int:drive_id>', methods=['GET'])
@roles_required('company')
def get_drive_details(drive_id):
    drive_obj = PlacementDrive.query.get_or_404(drive_id)
    # Security check: must be your company's drive
    if drive_obj.company_id != current_user.company_profile.id:
        return jsonify({'message': 'Unauthorized access'}), 403
        
    return jsonify({
        'id': drive_obj.id,
        'title': drive_obj.title,
        'description': drive_obj.description,
        'requirements': drive_obj.requirements,
        'criteria_cgpa': drive_obj.criteria_cgpa,
        'criteria_branch': drive_obj.criteria_branch,
        'criteria_degree': drive_obj.criteria_degree,
        'criteria_year': drive_obj.criteria_year,
        'package': drive_obj.package,
        'deadline': drive_obj.deadline.strftime('%Y-%m-%d'),
        'status': drive_obj.status
    })

# Update an existing drive
@company_bp.route('/drives/<int:drive_id>', methods=['PUT'])
@roles_required('company')
def update_drive(drive_id):
    drive_obj = PlacementDrive.query.get_or_404(drive_id)
    # Security check: must be your company's drive
    if drive_obj.company_id != current_user.company_profile.id:
        return jsonify({'message': 'Unauthorized access'}), 403
        
    data = request.get_json()
    try:
        drive_obj.title = data.get('title', drive_obj.title)
        drive_obj.description = data.get('description', drive_obj.description)
        drive_obj.requirements = data.get('requirements', drive_obj.requirements)
        drive_obj.criteria_cgpa = float(data.get('criteria_cgpa', drive_obj.criteria_cgpa))
        drive_obj.criteria_branch = data.get('criteria_branch', drive_obj.criteria_branch)
        drive_obj.criteria_degree = data.get('criteria_degree', drive_obj.criteria_degree)
        drive_obj.criteria_year = data.get('criteria_year', drive_obj.criteria_year)
        drive_obj.package = data.get('package', drive_obj.package)
        
        if 'deadline' in data:
            drive_obj.deadline = datetime.datetime.strptime(data['deadline'], '%Y-%m-%d')
            
        db.session.commit()
        
        # Invalidate caches
        from .student import get_open_drives
        from .admin import get_stats
        cache.delete_memoized(get_open_drives)
        cache.delete_memoized(get_stats)
        
        return jsonify({'message': 'Drive updated successfully!'})
    except Exception as err:
        return jsonify({'message': f'Error: {str(err)}'}), 400

# Get a list of students who applied for a specific drive
@company_bp.route('/drive/<int:drive_id>/applications', methods=['GET'])
@roles_required('company')
def get_drive_applications(drive_id):
    target_drive = PlacementDrive.query.get_or_404(drive_id)
    
    # Security check: must be your company's drive
    if target_drive.company_id != current_user.company_profile.id:
        return jsonify({'message': 'You cannot view this'}), 403
        
    apps = Application.query.filter_by(drive_id=target_drive.id).all()
    results = []
    for a in apps:
        results.append({
            'id': a.id,
            'student_name': a.student.name,
            'cgpa': a.student.cgpa,
            'status': a.status, 
            'resume': a.student.resume_link
        })
    return jsonify(results)
    
# Update the status of a student's application (Accept/Reject)
@company_bp.route('/application/<int:app_id>/status', methods=['POST'])
@roles_required('company')
def update_application_status(app_id):
    post_data = request.get_json()
    new_s = post_data.get('status')
    
    target_app = Application.query.get_or_404(app_id)
    if target_app.drive.company_id != current_user.company_profile.id:
        return jsonify({'message': 'Unauthorized access'}), 403
        
    target_app.status = new_s
    
    # If student is selected, mark them as 'Placed' in their profile
    if new_s == 'Selected':
        target_app.student.status = 'Placed'
        
    db.session.commit()

    # Invalidate caches
    from .admin import get_stats
    cache.delete_memoized(get_stats)

    return jsonify({'message': 'Application status has been updated'})

# Update the status of the drive itself (e.g. close it)
@company_bp.route('/drives/<int:drive_id>/status', methods=['POST'])
@roles_required('company')
def update_drive_status(drive_id):
    my_drive = PlacementDrive.query.get_or_404(drive_id)
    if my_drive.company_id != current_user.company_profile.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    post_data = request.get_json()
    new_status = post_data.get('status')
    if new_status:
        my_drive.status = new_status
        db.session.commit()
        return jsonify({'message': 'Drive status updated!'})
    return jsonify({'error': 'Status is required'}), 400
