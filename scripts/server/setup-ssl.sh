#!/bin/bash
# =============================================================================
# Rise.sk SSL Setup Script for Hetzner + Cloudflare
# =============================================================================
# ⚠️  RUN THIS ON THE HETZNER SERVER, NOT LOCALLY!
# 
# Prerequisites:
#   - Docker and Docker Compose installed on server
#   - Domain DNS pointing to this server via Cloudflare
#   - Project deployed to /opt/rise or your deployment directory
# =============================================================================

set -e

DOMAIN="rise.sk"
EMAIL="rise@rise.sk"  # Change this to your email

# Detect project directory (where docker-compose.yml is)
if [ -f "/opt/rise/docker-compose.yml" ]; then
    PROJECT_DIR="/opt/rise"
elif [ -f "/root/rise/docker-compose.yml" ]; then
    PROJECT_DIR="/root/rise"
elif [ -f "./docker-compose.yml" ]; then
    PROJECT_DIR="$(pwd)"
else
    echo "❌ Error: Cannot find docker-compose.yml"
    echo "   Run this script from your project directory or deploy to /opt/rise"
    exit 1
fi

echo "🔐 Rise.sk SSL Setup Script"
echo "=============================="
echo "📁 Project directory: $PROJECT_DIR"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  Please run as root (sudo ./setup-ssl.sh)"
    exit 1
fi

cd "$PROJECT_DIR"

# Step 1: Create required directories
echo "📁 Creating directories..."
mkdir -p /var/www/certbot
mkdir -p /etc/letsencrypt

# Step 2: Ensure Cloudflare is in "Flexible" mode temporarily
echo ""
echo "⚠️  IMPORTANT: Before continuing, make sure:"
echo "   1. Cloudflare SSL/TLS is set to 'Flexible' (temporarily)"
echo "   2. Your domain DNS is pointing to this server via Cloudflare"
echo ""
read -p "Press Enter when ready to continue..."

# Step 3: Start with initial HTTP-only config
echo ""
echo "📝 Setting up initial HTTP config..."

# Check if initial config exists
if [ ! -f "nginx/conf.d/rise.initial.conf" ]; then
    echo "⚠️  Creating initial HTTP config..."
    cat > nginx/conf.d/rise.initial.conf << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name rise.sk www.rise.sk;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
fi

# Backup current config if exists
if [ -f "nginx/conf.d/rise.conf" ]; then
    cp nginx/conf.d/rise.conf nginx/conf.d/rise.conf.ssl-backup
    echo "   Backed up current config to rise.conf.ssl-backup"
fi

# Use initial config (HTTP only)
cp nginx/conf.d/rise.initial.conf nginx/conf.d/rise.conf
echo "   Using HTTP-only config for certificate acquisition"

# Step 4: Start Nginx with HTTP-only config
echo "🚀 Starting Nginx..."
docker compose up -d nginx

sleep 5

# Step 5: Test if HTTP is working
echo "🧪 Testing HTTP access..."
if curl -s -o /dev/null -w "%{http_code}" "http://${DOMAIN}/.well-known/acme-challenge/test" | grep -q "404\|200"; then
    echo "✅ HTTP is accessible"
else
    echo "❌ HTTP not accessible. Check your firewall and DNS."
    exit 1
fi

# Step 6: Obtain SSL certificate
echo ""
echo "🔒 Obtaining Let's Encrypt certificate..."
docker run --rm \
    -v /etc/letsencrypt:/etc/letsencrypt \
    -v /var/www/certbot:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

# Step 7: Check if certificate was obtained
if [ -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    echo "✅ SSL certificate obtained successfully!"
else
    echo "❌ Failed to obtain SSL certificate"
    exit 1
fi

# Step 8: Restore full SSL config
echo ""
echo "📝 Enabling full SSL configuration..."
if [ -f "nginx/conf.d/rise.conf.ssl-backup" ]; then
    mv nginx/conf.d/rise.conf.ssl-backup nginx/conf.d/rise.conf
fi

# Step 9: Restart Nginx with SSL
echo "🔄 Restarting Nginx with SSL..."
docker compose restart nginx

sleep 5

# Step 10: Test HTTPS
echo "🧪 Testing HTTPS access..."
if curl -s -o /dev/null -w "%{http_code}" --insecure "https://${DOMAIN}/api/health" | grep -q "200"; then
    echo "✅ HTTPS is working!"
else
    echo "⚠️  HTTPS might not be fully working yet. Check nginx logs."
fi

echo ""
echo "=============================="
echo "🎉 SSL Setup Complete!"
echo "=============================="
echo ""
echo "Next steps:"
echo "1. Go to Cloudflare Dashboard → SSL/TLS"
echo "2. Change SSL mode to 'Full (Strict)'"
echo "3. Enable 'Always Use HTTPS'"
echo "4. (Optional) Enable 'Automatic HTTPS Rewrites'"
echo ""
echo "Certificate will auto-renew via certbot container."
echo ""
