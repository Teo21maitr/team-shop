#!/bin/bash
set -e

echo "Starting build process..."

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build

# Move built frontend to Django static directory
echo "Moving frontend build to Django static..."
cd ..
mkdir -p backend/static
rm -rf backend/static/*
cp -r frontend/dist/* backend/static/

# Collect static files
echo "Collecting static files..."
cd backend
python manage.py collectstatic --noinput

echo "Build complete!"
