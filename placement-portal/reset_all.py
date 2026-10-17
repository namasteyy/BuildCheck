from backend.app import create_app
from backend.extensions import db
from backend.models import User
from flask_security.utils import hash_password

app = create_app()
with app.app_context():
    users = User.query.all()
    for user in users:
        # Reset everyone's password to exactly what their role is to make it easy for testing
        role_name = user.roles[0].name if user.roles else 'student'
        user.password = hash_password(role_name)
    db.session.commit()
    print("All standard student dummy passwords reset to 'student'. All company dummy passwords reset to 'company'. Admin remains 'admin'.")
