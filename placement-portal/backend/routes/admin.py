from flask import Blueprint, jsonify, request
from flask_security import roles_required
from ..extensions import db, cache
from ..models import User, CompanyProfile, StudentProfile, PlacementDrive, Application, SystemJobLog

# Admin blueprint for all system-wide management
admin_bp = Blueprint('admin', __name__)

# List all users in the system (for debugging or management)
@admin_bp.route('/users', methods=['GET'])
@roles_required('admin')
def get_users():
    all_users = User.query.all()
    output = []
    for u in all_users:
        # Get the first role name
        my_role = u.roles[0].name if u.roles else 'no-role'
        c_id = u.company_profile.id if u.company_profile else None
        output.append({
            'id': u.id,
            'email': u.email,
            'role': my_role,
            'active': u.active,
            'company_id': c_id
        })
    return jsonify(output)

# Get a list of all companies
@admin_bp.route('/companies', methods=['GET'])
@roles_required('admin')
def get_companies():
    all_comps = CompanyProfile.query.all()
    results = []
    for c in all_comps:
        results.append({
            'id': c.id,
            'name': c.name,
            'email': c.user.email,
            'status': c.status,
            'user_id': c.user_id,
            'active': c.user.active
        })
    return jsonify(results)

# Get a list of all students
@admin_bp.route('/students', methods=['GET'])
@roles_required('admin')
def get_students():
    all_studs = StudentProfile.query.all()
    results = []
    for s in all_studs:
        results.append({
            'id': s.id,
            'name': s.name,
            'email': s.user.email,
            'department': s.department,
            'user_id': s.user_id,
            'active': s.user.active
        })
    return jsonify(results)

# Block a user so they cannot log in
@admin_bp.route('/users/<int:user_id>/block', methods=['POST'])
@roles_required('admin')
def block_user(user_id):
    target_user = User.query.get_or_404(user_id)
    target_user.active = False
    db.session.commit()
    clear_stats_cache()
    return jsonify({'message': 'User has been blocked!'})

# Unblock a user
@admin_bp.route('/users/<int:user_id>/unblock', methods=['POST'])
@roles_required('admin')
def unblock_user(user_id):
    target_user = User.query.get_or_404(user_id)
    target_user.active = True
    db.session.commit()
    clear_stats_cache()
    return jsonify({'message': 'User has been unblocked!'})

# Approve a company registration
@admin_bp.route('/company/approve/<int:company_id>', methods=['POST'])
@roles_required('admin')
def approve_company(company_id):
    comp_obj = CompanyProfile.query.get_or_404(company_id)
    comp_obj.status = 'Approved'
    comp_obj.user.active = True # Let them log in now
    db.session.commit()
    clear_stats_cache()
    return jsonify({'message': f'Approved company: {comp_obj.name}'})

# Update the status of a company (e.g. Reject them)
@admin_bp.route('/company/status/<int:company_id>', methods=['POST'])
@roles_required('admin')
def update_company_status(company_id):
    comp_obj = CompanyProfile.query.get_or_404(company_id)
    post_data = request.get_json()
    new_status = post_data.get('status')
    if new_status:
        comp_obj.status = new_status
        db.session.commit()
        return jsonify({'message': 'Status updated!'})
    return jsonify({'error': 'No status provided'}), 400

# Get basic stats for the dashboard cards
@admin_bp.route('/stats', methods=['GET'])
@roles_required('admin')
@cache.cached(timeout=300) # Cache stats for 5 minutes
def get_stats():
    # Regular counts using SQLAlchemy
    student_count = StudentProfile.query.count()
    placed_count = StudentProfile.query.filter_by(status='Placed').count()
    company_count = CompanyProfile.query.count()
    drive_count = PlacementDrive.query.filter_by(status='Open').count()
    
    return jsonify({
        'total_students': student_count,
        'placed_students': placed_count,
        'companies': company_count,
        'active_drives': drive_count
    })

# Helper to clear stats cache
def clear_stats_cache():
    cache.delete_memoized(get_stats)

# Search for companies, students, and drives
@admin_bp.route('/search', methods=['GET'])
@roles_required('admin')
def search():
    val = request.args.get('q', '')
    if not val:
        return jsonify({'results': []})
        
    # Using LIKE for simple search
    comp_matches = CompanyProfile.query.filter(CompanyProfile.name.ilike(f'%{val}%')).all()
    stud_matches = StudentProfile.query.filter(StudentProfile.name.ilike(f'%{val}%')).all()
    drive_matches = PlacementDrive.query.filter(PlacementDrive.title.ilike(f'%{val}%')).all()
    
    output = []
    for c in comp_matches:
        output.append({'type': 'Company', 'id': c.id, 'name': c.name, 'status': c.status})
    for s in stud_matches:
        output.append({'type': 'Student', 'id': s.id, 'name': s.name, 'department': s.department})
    for d in drive_matches:
        output.append({'type': 'Drive', 'id': d.id, 'name': d.title, 'company': d.company.name, 'status': d.status})
        
    return jsonify({'results': output})

# View all job applications in the system
@admin_bp.route('/applications', methods=['GET'])
@roles_required('admin')
def get_all_applications():
    all_apps = Application.query.all()
    output = []
    for a in all_apps:
        output.append({
            'id': a.id,
            'student': a.student.name,
            'company': a.drive.company.name,
            'drive': a.drive.title,
            'status': a.status,
            'date': a.date_applied.isoformat()
        })
    return jsonify(output)

# Get all recruitment drives
@admin_bp.route('/drives', methods=['GET'])
@roles_required('admin')
def get_drives():
    all_d = PlacementDrive.query.all()
    results = []
    for d in all_d:
        results.append({
            'id': d.id,
            'title': d.title,
            'company': d.company.name,
            'status': d.status,
            'date_created': d.date_created.isoformat()
        })
    return jsonify(results)

# Admin can update a drive status (e.g. set it to Closed)
@admin_bp.route('/drives/<int:drive_id>/status', methods=['POST'])
@roles_required('admin')
def update_drive_status(drive_id):
    d_obj = PlacementDrive.query.get_or_404(drive_id)
    post_data = request.get_json()
    new_s = post_data.get('status')
    if new_s:
        d_obj.status = new_s
        db.session.commit()
        clear_stats_cache()
        return jsonify({'message': 'Drive status updated!'})
    return jsonify({'error': 'Status is missing'}), 400

# Endpoint to trigger the monthly report task
@admin_bp.route('/reports/generate', methods=['POST'])
@roles_required('admin')
def trigger_report():
    from ..tasks import generate_monthly_report
    # Call the celery task
    generate_monthly_report.delay()
    return jsonify({'message': 'Report task launched!'})

# [NEW] Endpoint to trigger daily reminders manually
@admin_bp.route('/reminders/trigger', methods=['POST'])
@roles_required('admin')
def trigger_reminders():
    from ..tasks import send_daily_reminder
    send_daily_reminder.delay()
    return jsonify({'message': 'Reminders task launched!'})

# [NEW] Get recent background job logs
@admin_bp.route('/jobs/logs', methods=['GET'])
@roles_required('admin')
def get_job_logs():
    logs = SystemJobLog.query.order_by(SystemJobLog.timestamp.desc()).limit(15).all()
    output = []
    for l in logs:
        output.append({
            'id': l.id,
            'job_name': l.job_name,
            'status': l.status,
            'message': l.message,
            'timestamp': l.timestamp.isoformat()
        })
    return jsonify(output)
