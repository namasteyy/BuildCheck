from backend.app import create_app
from backend.extensions import db
from backend.models import User, StudentProfile
from flask_security.utils import hash_password

app = create_app()
with app.app_context():
    user = User.query.filter_by(email="jane@student.com").first()
    if user:
        user.password = hash_password("student")
        db.session.commit()
        print("Jane's password reset to 'student'!")
    else:
        print("User jane@student.com DOES NOT EXIST!")
