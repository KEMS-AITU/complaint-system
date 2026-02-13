#!/usr/bin/env bash


set -e


cleanup() {
    echo -e "\n🛑 Shutting down servers..."
    
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}


trap cleanup INT TERM


echo "🐍 Booting Backend..."

python3 -m venv venv --quiet
source venv/bin/activate
pip install -r requirements.txt --quiet

python manage.py migrate

python manage.py runserver 127.0.0.1:8000 > >(sed 's/^/[BACKEND] /') 2>&1 &


echo "⚛️ Booting Frontend..."

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
