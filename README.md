# Complaint System

Local setup (Windows / PowerShell):

1) Open PowerShell in the project root:
   - `C:\Users\user\Desktop\complaint_system`

2) Activate the virtual environment:
   - `.\venv\Scripts\Activate.ps1`
   - If you see an execution policy error, run once:
     - `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`

3) Install dependencies:
   - `python -m pip install --upgrade pip`
   - `pip install django djangorestframework`

4) Apply migrations:
   - `python manage.py migrate`

5) Run the server:
   - `python manage.py runserver`

6) Open in your browser:
   - `http://127.0.0.1:8000/`

Notes:
- Database uses SQLite at `db.sqlite3`.
- Custom user model is `feedback.User` (see `complaint_system/settings.py`).
