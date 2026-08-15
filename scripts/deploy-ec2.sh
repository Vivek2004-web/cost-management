#!/bin/bash
# ==============================================================================
# AWS Cloud Cost Monitor - EC2 Automated Deployment Script
# ==============================================================================

set -e

echo "🚀 Starting AWS Cloud Cost Monitor EC2 Deployment..."

# 1. Update Linux system packages
echo "📦 Updating Ubuntu/Debian system packages..."
sudo apt-get update -y && sudo apt-get upgrade -y

# 2. Install Docker & Docker Compose if not already installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "🐳 Installing Docker Compose plugin..."
    sudo apt-get install -y docker-compose-plugin
fi

# 3. Build & launch Docker containers
echo "🏗️ Building & launching containers via Docker Compose..."
sudo docker-compose up -d --build || sudo docker compose up -d --build

# 4. Verify running services
echo "✅ Deployment Successful!"
echo "📊 App is now running live:"
echo "   - Frontend Web UI: http://$(curl -s http://checkip.amazonaws.com)"
echo "   - Backend API: http://$(curl -s http://checkip.amazonaws.com):5001/api/health"
