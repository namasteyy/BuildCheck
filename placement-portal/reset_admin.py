import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.app import create_app
from backend.extensions import db
from backend.models import User
from flask_security.utils import hash_password

app = create_app()

with app.app_context():
    admin = User.query.filter_by(email='admin@institute.com').first()
    if admin:
        print(f"Found admin: {admin.email}. Resetting password...")
        admin.password = hash_password('admin')
        db.session.commit()
        print("Password reset successful to 'admin'")
    else:
        print("Admin user not found. Creating...")
        from backend.app import user_datastore
        user_datastore.create_user(
            email='admin@institute.com',
            password=hash_password('admin'),
            active=True,
            roles=['admin']
        )
        db.session.commit()
        print("Admin user created with password 'admin'")
