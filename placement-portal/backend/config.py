import os

# Our main configuration class
class Config:
    # Use environment variables if they exist, otherwise use these defaults
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'my-college-project-key-456'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(os.getcwd(), 'instance', 'ppa.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Password hashing salt
    SECURITY_PASSWORD_SALT = 'my-salt-123'
    SECURITY_REGISTERABLE = True
    SECURITY_SEND_REGISTER_EMAIL = False
    WTF_CSRF_ENABLED = False # Disable CSRF for our API
    
    # Background task settings (Redis)
    CELERY_BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

    # Email server settings (SMTP)
    MAIL_SERVER = os.environ.get('MAIL_SERVER', '127.0.0.1')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 1025))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'false').lower() == 'true'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'noreply@myinstitute.com')
    
    # Admin email for placement reports
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'placement@institute.com')

    # Webhook for Google Chat (Google Apps Script or similar)
    GCHAT_WEBHOOK_URL = os.environ.get('GCHAT_WEBHOOK_URL')

    # Simple caching using Redis
    CACHE_TYPE = 'RedisCache'
    CACHE_REDIS_URL = 'redis://localhost:6379/1'
    
    SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS = True
