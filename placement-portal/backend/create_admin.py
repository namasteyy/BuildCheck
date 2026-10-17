from backend.app import create_app
from backend.extensions import db, security
from flask_security.utils import hash_password

app = create_app()

with app.app_context():
    user_datastore = security.datastore
    if not user_datastore.find_role('admin'):
        user_datastore.create_role(name='admin', description='Administrator')
    
    if not user_datastore.find_user(email='admin@ppa.com'):
        user_datastore.create_user(
            email='admin@ppa.com',
            password=hash_password('admin123'),
            roles=['admin'],
            active=True
        )
        db.session.commit()
        print("Admin user created: admin@ppa.com / admin123")
    else:
        print("Admin user already exists")
