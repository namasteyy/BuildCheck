import sys
import os
# Make sure we search the backend folder for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from backend.extensions import celery

# We need to create an app context for Celery tasks to work
app = create_app()
app.app_context().push()

from backend import tasks
