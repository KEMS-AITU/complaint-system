#!/usr/bin/env bash

set -e

# ----------------------------
# Backend setup
# ----------------------------
echo "=== Backend: setting up virtual environment ==="

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate

echo "=== Backend: upgrading pip ==="
python3 -m pip install --upgrade pip

if [ -f requirements.txt ]; then
    echo "=== Backend: installing dependencies from requirements.txt ==="
    pip install -r requirements.txt
else
    echo "=== Backend: installing default dependencies ==="
    pip install django djangorestframework django-cors-headers
    pip freeze > requirements.txt
fi

echo "=== Backend: applying migrations ==="
python manage.py migrate

# ----------------------------
# Start backend in background
# ----------------------------
echo "=== Backend: starting server on http://127.0.0.1:8000 ==="
python manage.py runserver > >(sed 's/^/[BACKEND] /') 2>&1 &

BACKEND_PID=$!

# ----------------------------
# Frontend setup
# ----------------------------
echo "=== Frontend: installing dependencies ==="
cd ../complaint-system-fe
npm install

echo "=== Frontend: starting dev server on http://localhost:5173 ==="
npm run dev > >(sed 's/^/[FRONTEND] /') 2>&1 &

FRONTEND_PID=$!

# ----------------------------
# Wait for both processes
# ----------------------------
echo "=== Both servers are running. Press Ctrl+C to stop ==="

# Trap Ctrl+C to kill both servers
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" INT

wait $BACKEND_PID $FRONTEND_PID

