#!/usr/bin/env bash

# Exit immediately if a command fails
set -e

# Function to kill all processes started by this script
cleanup() {
    echo -e "\n🛑 Shutting down servers..."
    # Kill all background jobs started in this session
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

# Trap interrupt signals (Ctrl+C)
trap cleanup INT TERM

# --- Backend Section ---
echo "🐍 Booting Backend..."
# Check if we are in the right folder (adjust as needed)
python3 -m venv venv --quiet
source venv/bin/activate
pip install -r requirements.txt --quiet

python manage.py migrate
# Use 0.0.0.0 to match your production binding style
python manage.py runserver https://complaint-system-be-production.up.railway.app/ > >(sed 's/^/[BACKEND] /') 2>&1 &

# --- Frontend Section ---
echo "⚛️ Booting Frontend..."
# Using -d check to ensure the folder exists before cd
if [ -d "../frontend" ]; then
    cd ../frontend
    npm install --silent
    npm run dev > >(sed 's/^/[FRONTEND] /') 2>&1 &
else
    echo "❌ Frontend folder not found at ../frontend"
    cleanup
fi

echo "🚀 System is live! Backend: :8000 | Frontend: :5173"
wait
