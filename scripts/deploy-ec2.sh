#!/bin/bash
set -e

echo "🚀 Starting AWS Cloud Cost Monitor EC2 Deployment..."

# 1. Force clean build without Docker layer cache
echo "🏗️ Building & launching containers via Docker Compose (no cache)..."
if command -v docker-compose &> /dev/null; then
    sudo docker-compose build --no-cache
    sudo docker-compose down || true
    sudo docker-compose up -d --force-recreate
else
    sudo docker compose build --no-cache
    sudo docker compose down || true
    sudo docker compose up -d --force-recreate
fi

# 2. Verify deployment
echo "✅ Deployment Successful!"
echo "📊 App is now running live!"
