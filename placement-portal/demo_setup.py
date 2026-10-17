from backend.app import create_app
from backend.extensions import db
from backend.models import PlacementDrive, CompanyProfile, StudentProfile, Application
import datetime

app = create_app()
with app.app_context():
    # 1. Create a dummy company and drive closing tomorrow
    comp = CompanyProfile.query.first()
    if not comp:
        comp = CompanyProfile(name="Demo Corp", description="For Demo", industry="Tech", website="demo.com")
        db.session.add(comp)
        db.session.commit()
    
    drive = PlacementDrive.query.filter_by(title="Demo Drive (Closing Soon)").first()
    if not drive:
        drive = PlacementDrive(
            company_id=comp.id,
            title="Demo Drive (Closing Soon)",
            description="Apply quickly!",
            criteria_cgpa=0.0,
            package="8 LPA",
            deadline=datetime.datetime.utcnow() + datetime.timedelta(days=1),
            status="Open"
        )
        db.session.add(drive)
    else:
        drive.deadline = datetime.datetime.utcnow() + datetime.timedelta(days=1)
        drive.status = "Open"
        
    db.session.commit()
    print("Added/Updated dummy drive closing tomorrow.")
