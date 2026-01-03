# Cloudflare Setup Guide for Rise.sk

## Prerequisites
- Hetzner server running with Docker
- Domain rise.sk with access to DNS settings

## Step 1: Cloudflare Account Setup

1. Go to [cloudflare.com](https://cloudflare.com) and create a free account
2. Click "Add a Site" and enter `rise.sk`
3. Select the **Free** plan (sufficient for our needs)

## Step 2: DNS Configuration

Cloudflare will scan your existing DNS records. Verify these are correct:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | rise.sk | 91.98.199.69 | ☁️ Proxied |
| A | www | 91.98.199.69 | ☁️ Proxied |
| AAAA | rise.sk | 2a01:4f8:1c1a:6eaa::1 | ☁️ Proxied |
| AAAA | www | 2a01:4f8:1c1a:6eaa::1 | ☁️ Proxied |

**Important**: Make sure the cloud icon is **orange** (proxied), not grey (DNS only).

## Step 3: Change Nameservers

At your domain registrar, update nameservers to the ones Cloudflare provides (e.g.):
- `aria.ns.cloudflare.com`
- `chad.ns.cloudflare.com`

Wait up to 24 hours for DNS propagation.

## Step 4: SSL/TLS Configuration

Go to **SSL/TLS** → **Overview**:
- Set encryption mode to **Full (strict)**

Go to **SSL/TLS** → **Edge Certificates**:
- Always Use HTTPS: **On**
- Automatic HTTPS Rewrites: **On**
- Minimum TLS Version: **TLS 1.2**

## Step 5: Speed Optimization

Go to **Speed** → **Optimization**:
- Auto Minify: **CSS, JavaScript, HTML** ✅
- Brotli: **On**
- Early Hints: **On**
- Rocket Loader: **Off** (can break React apps)

Go to **Caching** → **Configuration**:
- Caching Level: **Standard**
- Browser Cache TTL: **4 hours**

## Step 6: Security Settings

Go to **Security** → **Settings**:
- Security Level: **Medium**
- Challenge Passage: **30 minutes**
- Browser Integrity Check: **On**

Go to **Security** → **Bots**:
- Bot Fight Mode: **On**

## Step 7: Page Rules (Optional, Free plan has 3)

Create these page rules for better performance:

1. **Cache Static Assets**
   - URL: `rise.sk/_next/static/*`
   - Setting: Cache Level → Cache Everything, Edge Cache TTL → 1 month

2. **Bypass Cache for API**
   - URL: `rise.sk/api/*`
   - Setting: Cache Level → Bypass

3. **Bypass Cache for Keystatic Admin**
   - URL: `rise.sk/keystatic/*`
   - Setting: Cache Level → Bypass, Security Level → High

## Step 8: (Optional) Restrict Hetzner Firewall

After confirming Cloudflare is working, you can restrict HTTP/HTTPS access to Cloudflare IPs only on Hetzner:

1. Go to Hetzner Console → Firewalls
2. Edit existing firewall rules
3. Change HTTP (80) and HTTPS (443) sources from "Any" to Cloudflare IP ranges

Cloudflare IPv4 ranges: https://www.cloudflare.com/ips-v4
Cloudflare IPv6 ranges: https://www.cloudflare.com/ips-v6

## Verification

After setup, verify:

```bash
# Check if Cloudflare is active
curl -I https://rise.sk | grep -i "cf-"

# Should see headers like:
# cf-ray: xxxxx
# cf-cache-status: HIT/MISS/DYNAMIC
```

## Costs

| Service | Monthly Cost |
|---------|--------------|
| Cloudflare Free | €0 |
| Hetzner CX23 | €2.99 |
| **Total** | **€2.99** |

## Troubleshooting

### Error 521 - Web server is down
- Check if Docker containers are running: `docker compose ps`
- Check app logs: `docker compose logs app`

### Error 522 - Connection timed out
- Verify Hetzner firewall allows Cloudflare IPs
- Check nginx is running: `docker compose logs nginx`

### Error 526 - Invalid SSL certificate
- Ensure SSL mode is "Full (strict)"
- Verify Let's Encrypt certificate is valid: `docker compose run --rm certbot certificates`

### Mixed content warnings
- Enable "Automatic HTTPS Rewrites" in Cloudflare
- Check CSP headers allow HTTPS resources

## Maintenance

The server automatically updates Cloudflare IP ranges weekly via cron job.
To manually update:

```bash
cd /opt/rise
bash scripts/server/update-cloudflare-ips.sh
```
