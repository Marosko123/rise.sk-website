#!/bin/bash
# ============================================
# Update Cloudflare IP Ranges for Nginx
# Run weekly via cron to keep IPs up-to-date
# Usage: bash scripts/server/update-cloudflare-ips.sh
# ============================================

set -e

CLOUDFLARE_CONF="/opt/rise/nginx/conf.d/cloudflare.conf"
TEMP_FILE="/tmp/cloudflare-ips.conf"

echo "📥 Downloading Cloudflare IP ranges..."

# Create new config file
cat > "$TEMP_FILE" << 'HEADER'
# Cloudflare IP Ranges Configuration
# Auto-generated - DO NOT EDIT MANUALLY
# Last updated: $(date -I)
# Source: https://www.cloudflare.com/ips/

HEADER

# Fetch IPv4 ranges
echo "# IPv4 Ranges" >> "$TEMP_FILE"
curl -s https://www.cloudflare.com/ips-v4 | while read ip; do
    echo "set_real_ip_from $ip;" >> "$TEMP_FILE"
done

echo "" >> "$TEMP_FILE"

# Fetch IPv6 ranges
echo "# IPv6 Ranges" >> "$TEMP_FILE"
curl -s https://www.cloudflare.com/ips-v6 | while read ip; do
    echo "set_real_ip_from $ip;" >> "$TEMP_FILE"
done

# Add real_ip_header directive
cat >> "$TEMP_FILE" << 'FOOTER'

# Use CF-Connecting-IP header to get real visitor IP
real_ip_header CF-Connecting-IP;
FOOTER

# Backup existing config
if [ -f "$CLOUDFLARE_CONF" ]; then
    cp "$CLOUDFLARE_CONF" "${CLOUDFLARE_CONF}.bak"
fi

# Move new config in place
mv "$TEMP_FILE" "$CLOUDFLARE_CONF"

echo "✅ Cloudflare IP configuration updated!"

# Test nginx config
if docker exec rise-nginx nginx -t 2>/dev/null; then
    echo "🔄 Reloading nginx..."
    docker exec rise-nginx nginx -s reload
    echo "✅ Nginx reloaded successfully!"
else
    echo "❌ Nginx config test failed, restoring backup..."
    if [ -f "${CLOUDFLARE_CONF}.bak" ]; then
        mv "${CLOUDFLARE_CONF}.bak" "$CLOUDFLARE_CONF"
    fi
    exit 1
fi
