# Placement Portal Project

This is my college project for the Placement Portal. It helps students find jobs and companies manage their recruitment drives.

## Tech Stack Used:
- **Backend:** Flask (Python)
- **Frontend:** Vue.js 3
- **Styling:** Bootstrap (Bootswatch Lux theme)
- **Database:** SQLite (ppa.db)
- **Background Tasks:** Celery with Redis

## How to Run:

### 1. Setup Backend
1. Go to the `backend` folder.
2. Install dependencies: `pip install -r requirements.txt`
3. Run the app: `python app.py`
4. In another terminal, start Redis and run Celery:
   `celery -A celery_worker.celery worker --loglevel=info`
   `celery -A celery_worker.celery beat --loglevel=info`

### 2. Setup Frontend
1. Go to the `frontend` folder.
2. Install packages: `npm install`
3. Run dev server: `npm run dev`

### 3. Login Details
- **Admin:** admin@institute.com / admin
- **Student/Company:** You can register from the signup page.

Hope you like my project!
