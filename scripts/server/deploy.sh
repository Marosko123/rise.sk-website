#!/bin/bash
# ============================================
# Quick Deploy Script for Rise.sk
# Run on server to pull and deploy latest changes
# Usage: bash scripts/server/deploy.sh
# ============================================

set -e

cd /opt/rise

echo "📦 Pulling latest changes..."
git pull origin master

echo "🐳 Pulling latest Docker image..."
docker compose pull app 2>/dev/null || true

echo "🔄 Rebuilding and restarting services..."
docker compose up -d --build app

echo "🧹 Cleaning up old images..."
docker image prune -f

echo "⏳ Waiting for health check..."
sleep 10

if curl -sf http://localhost:3000/api/health > /dev/null; then
    echo "✅ Deployment successful! Application is healthy."
else
    echo "❌ Health check failed. Check logs with: docker compose logs app"
    exit 1
fi
