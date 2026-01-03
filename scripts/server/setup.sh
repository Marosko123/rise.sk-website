#!/bin/bash
# ============================================
# Rise.sk Hetzner Server Initial Setup Script
# Run this script once on a fresh Ubuntu 24.04 server
# Usage: curl -sSL https://raw.githubusercontent.com/Marosko123/rise.sk-website/master/scripts/server/setup.sh | bash
# Or: bash scripts/server/setup.sh
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Configuration
DOMAIN="rise.sk"
EMAIL="dadvolvarino@gmail.com"  # For Let's Encrypt notifications
APP_DIR="/opt/rise"
GITHUB_REPO="https://github.com/Marosko123/rise.sk-website.git"

log_info "Starting Rise.sk server setup..."
log_info "Domain: $DOMAIN"
log_info "App directory: $APP_DIR"

# ============================================
# 1. System Update
# ============================================
log_info "Updating system packages..."
apt-get update && apt-get upgrade -y

# ============================================
# 2. Install Essential Packages
# ============================================
log_info "Installing essential packages..."
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    git \
    ufw \
    fail2ban \
    htop \
    ncdu \
    unzip \
    wget \
    software-properties-common

# ============================================
# 3. Install Docker
# ============================================
log_info "Installing Docker..."

# Add Docker's official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

log_success "Docker installed successfully!"
docker --version
docker compose version

# ============================================
# 4. Configure Firewall (UFW)
# ============================================
log_info "Configuring firewall..."

ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https
ufw --force enable

log_success "Firewall configured!"
ufw status

# ============================================
# 5. Configure Fail2ban
# ============================================
log_info "Configuring fail2ban..."

cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 24h
EOF

systemctl restart fail2ban
systemctl enable fail2ban

log_success "Fail2ban configured!"

# ============================================
# 6. Create App Directory and Clone Repository
# ============================================
log_info "Setting up application directory..."

mkdir -p $APP_DIR
cd $APP_DIR

if [ -d ".git" ]; then
    log_info "Repository already exists, pulling latest changes..."
    git pull origin master
else
    log_info "Cloning repository..."
    git clone $GITHUB_REPO .
fi

# Create necessary directories
mkdir -p certbot/conf certbot/www nginx/conf.d

log_success "Repository cloned to $APP_DIR"

# ============================================
# 7. Setup Environment Variables
# ============================================
log_info "Setting up environment variables..."

if [ ! -f ".env.production" ]; then
    cat > .env.production << 'EOF'
# Production Environment Variables
NODE_ENV=production

# SendGrid (fill in your values)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@rise.sk
TO_EMAIL=dadvolvarino@gmail.com

# Keystatic Auth (optional)
KEYSTATIC_USER=admin
KEYSTATIC_PASSWORD=your_secure_password

# Domain
NEXT_PUBLIC_SITE_URL=https://rise.sk
EOF
    log_warning "Created .env.production - Please fill in your API keys!"
else
    log_info ".env.production already exists"
fi

# ============================================
# 8. Initial SSL Certificate (Let's Encrypt)
# ============================================
log_info "Setting up SSL certificates..."

# Use initial nginx config (HTTP only)
cp nginx/conf.d/rise.initial.conf nginx/conf.d/default.conf

# Start nginx temporarily
docker compose up -d nginx

# Wait for nginx to start
sleep 5

# Get SSL certificate
docker compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Switch to full SSL config
rm nginx/conf.d/default.conf
cp nginx/conf.d/rise.conf nginx/conf.d/default.conf

log_success "SSL certificates obtained!"

# ============================================
# 9. Start All Services
# ============================================
log_info "Starting all services..."

docker compose down
docker compose up -d

log_success "All services started!"

# ============================================
# 10. Setup Automatic SSL Renewal Cron
# ============================================
log_info "Setting up SSL auto-renewal..."

(crontab -l 2>/dev/null; echo "0 12 * * * cd $APP_DIR && docker compose run --rm certbot renew --quiet && docker compose exec nginx nginx -s reload") | crontab -

log_success "SSL auto-renewal configured!"

# ============================================
# 11. Setup Automatic Updates Cron
# ============================================
log_info "Setting up automatic security updates..."

cat > /etc/apt/apt.conf.d/50unattended-upgrades << 'EOF'
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

systemctl enable unattended-upgrades
systemctl start unattended-upgrades

log_success "Automatic updates configured!"

# ============================================
# 12. Final Health Check
# ============================================
log_info "Running health check..."

sleep 15  # Wait for services to fully start

if curl -sf http://localhost:3000/api/health > /dev/null; then
    log_success "Application health check passed!"
else
    log_error "Application health check failed!"
fi

if curl -sf http://localhost > /dev/null; then
    log_success "Nginx health check passed!"
else
    log_warning "Nginx might still be starting..."
fi

# ============================================
# Summary
# ============================================
echo ""
echo "============================================"
log_success "🎉 Rise.sk Server Setup Complete!"
echo "============================================"
echo ""
log_info "Server IP: $(curl -s ifconfig.me)"
log_info "App Directory: $APP_DIR"
log_info "Domain: $DOMAIN"
echo ""
log_info "Useful commands:"
echo "  - View logs: docker compose logs -f"
echo "  - Restart: docker compose restart"
echo "  - Update: git pull && docker compose pull && docker compose up -d"
echo "  - SSL renew: docker compose run --rm certbot renew"
echo ""
log_warning "Don't forget to:"
echo "  1. Update DNS records to point to this server"
echo "  2. Fill in .env.production with your API keys"
echo "  3. Add GitHub secrets for CI/CD"
echo ""
