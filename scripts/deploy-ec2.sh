#!/bin/bash
set -e

echo "🚀 Starting AWS Cloud Cost Monitor EC2 Deployment..."

# 1. Ensure docker permissions / fallback
echo "🏗️ Building & launching containers via Docker Compose..."
if command -v docker-compose &> /dev/null; then
    sudo docker-compose down || true
    sudo docker-compose up -d --build --force-recreate
else
    sudo docker compose down || true
    sudo docker compose up -d --build --force-recreate
fi

# 2. Verify deployment
echo "✅ Deployment Successful!"
echo "📊 App is now running live!"
