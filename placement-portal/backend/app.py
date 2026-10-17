import sys
import os
# This part helps Python find our backend folder when we run from the root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
from .config import Config
from .extensions import db, celery, security, cache
from .models import User, Role, roles_users
from flask_security import SQLAlchemyUserDatastore
from flask_cors import CORS

# Our factory function to create the Flask app
def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize all our extensions (Database, Security, etc)
    db.init_app(app)
    
    # Official Flask-Celery integration to support app context
    class FlaskTask(celery.Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)

    celery.Task = FlaskTask

    class CeleryConfig:
        broker_url = app.config.get('CELERY_BROKER_URL')
        result_backend = app.config.get('CELERY_RESULT_BACKEND')
        broker_connection_retry_on_startup = True

    # Setup the schedule for periodic tasks like daily reminders
    from celery.schedules import crontab
    app.config['CELERY_BEAT_SCHEDULE'] = {
        'send-daily-reminders': {
            'task': 'backend.tasks.send_daily_reminder',
            'schedule': crontab(hour=9, minute=0), # Every day at 9 AM
        },
        'generate-monthly-report': {
            'task': 'backend.tasks.generate_monthly_report',
            'schedule': crontab(day_of_month=1, hour=0, minute=0), # 1st of every month
        },
        'send-student-monthly-report': {
            'task': 'backend.tasks.send_student_monthly_report',
            'schedule': crontab(day_of_month=1, hour=0, minute=30), # 1st of every month at 12:30 AM
        }
    }
    
    celery.config_from_object(CeleryConfig)
    celery.conf.update(app.config)
    
    # Setup Flask-Security for login and roles
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    security.init_app(app, user_datastore)
    
    # Initialize the cache
    cache.init_app(app)
    
    # Enable CORS so our VueJS frontend can talk to the backend
    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    # Import and register our blueprints (routes)
    from .routes.auth import auth_bp
    from .routes.admin import admin_bp
    from .routes.company import company_bp
    from .routes.student import student_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(company_bp, url_prefix='/api/company')
    app.register_blueprint(student_bp, url_prefix='/api/student')

    # Create the database tables if they don't exist
    with app.app_context():
        db.create_all()
        
        # Create the starting roles for the system
        user_datastore.find_or_create_role(name='admin', description='System Admin')
        user_datastore.find_or_create_role(name='company', description='Recruiter')
        user_datastore.find_or_create_role(name='student', description='Job Seeker')
        
        # Create a default admin user for first login
        from flask_security.utils import hash_password
        if not user_datastore.find_user(email='admin@institute.com'):
            user_datastore.create_user(
                email='admin@institute.com',
                password=hash_password('admin'),
                active=True,
                roles=['admin']
            )
        db.session.commit()

    # Simple homepage for the backend
    @app.route('/')
    def index():
        return """
        <html>
            <head><title>Success!</title></head>
            <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                <h1>Placement Portal Backend is up!</h1>
                <p>Status: Working fine on Port 5001</p>
            </body>
        </html>
        """

    return app

# Start the app if this file is run directly
if __name__ == '__main__':
    my_app = create_app()
    my_app.run(host='0.0.0.0', debug=True, port=5001)
