# Certificate Renewal Instructions

## Problem Fixed
Your Let's Encrypt certificate has expired. The issue was that the certbot container was configured to run the renewal command once and exit, preventing automatic renewals from working.

## What Was Changed

1. **docker-compose.prod.yml**: Changed certbot container to use `sleep infinity` so it stays running
2. **certbot-renew.sh**: Fixed to properly execute renewal inside the running container
3. **certbot-force-renew.sh**: New script for force-renewing expired certificates
4. **README-certbot.md**: Updated with correct procedures

## Steps to Renew Your Expired Certificate

### Step 1: Update Docker Configuration (on your server)

```bash
# SSH into your server
ssh rrnmc@rr.shimmeringtrashpile.com

# Navigate to project directory
cd ~/restorationregeneration

# Pull the latest changes (if you've committed them)
git pull origin main

# Recreate the certbot container with new configuration
sudo docker compose -f docker-compose.prod.yml stop certbot
sudo docker compose -f docker-compose.prod.yml rm -f certbot
sudo docker compose -f docker-compose.prod.yml up -d certbot

# Make scripts executable
chmod +x certbot-renew.sh certbot-force-renew.sh
```

### Step 2: Force Renew Expired Certificates

```bash
# Run the force renewal script
sudo ./certbot-force-renew.sh
```

This script will:
- Check if certbot container is running (start it if needed)
- Force renew all certificates (even expired ones)
- Reload Apache to use the new certificates
- Show you the new expiry dates

### Step 3: Verify Certificates Are Renewed

```bash
# Check certificate status
sudo docker exec certbot certbot certificates

# Check expiry dates for both domains
sudo docker exec certbot openssl x509 -in /etc/letsencrypt/live/rr.newmediacaucus.org/fullchain.pem -text -noout | grep "Not After"
sudo docker exec certbot openssl x509 -in /etc/letsencrypt/live/rr.shimmeringtrashpile.com/fullchain.pem -text -noout | grep "Not After"
```

### Step 4: Test HTTPS Access

```bash
# Test both domains
curl -I https://rr.newmediacaucus.org
curl -I https://rr.shimmeringtrashpile.com
```

### Step 5: Set Up Automatic Renewal (Important!)

To prevent this from happening again, set up a cron job:

```bash
# Edit crontab
sudo crontab -e

# Add this line to run renewal twice daily (at 2 AM and 2 PM)
0 2,14 * * * cd /home/rrnmc/restorationregeneration && /usr/bin/docker exec certbot certbot renew --webroot --webroot-path=/var/www/html --quiet && /usr/bin/docker exec restorationregeneration-prod-container apache2ctl graceful >/dev/null 2>&1

# Or use the renewal script (recommended)
0 2,14 * * * cd /home/rrnmc/restorationregeneration && sudo ./certbot-renew.sh >/dev/null 2>&1
```

## Troubleshooting

### If Force Renewal Fails

```bash
# Check certbot logs
sudo docker logs certbot

# Check if .well-known directory is accessible
sudo docker exec restorationregeneration-prod-container ls -la /var/www/html/.well-known/acme-challenge/

# Test webroot access from outside
curl http://rr.newmediacaucus.org/.well-known/acme-challenge/test

# Check Apache error logs
sudo docker exec restorationregeneration-prod-container tail -20 /var/log/apache2/error.log
```

### If Container Won't Start

```bash
# Remove and recreate the container
sudo docker compose -f docker-compose.prod.yml stop certbot
sudo docker compose -f docker-compose.prod.yml rm -f certbot
sudo docker compose -f docker-compose.prod.yml up -d certbot

# Check container status
sudo docker ps | grep certbot
```

### If Apache Won't Reload

```bash
# Test Apache configuration
sudo docker exec restorationregeneration-prod-container apache2ctl -t

# Check certificate files exist
sudo docker exec certbot ls -la /etc/letsencrypt/live/

# Manually reload Apache
sudo docker exec restorationregeneration-prod-container apache2ctl graceful
```

## Manual Renewal Commands

For normal (non-expired) renewals:
```bash
sudo ./certbot-renew.sh
```

For force renewal (expired certificates):
```bash
sudo ./certbot-force-renew.sh
```

For manual renewal without script:
```bash
sudo docker exec certbot certbot renew --webroot --webroot-path=/var/www/html
sudo docker exec restorationregeneration-prod-container apache2ctl graceful
```

## Monitoring

Check certificate status anytime:
```bash
sudo docker exec certbot certbot certificates
```

Check renewal logs:
```bash
sudo docker logs certbot | grep -E "(renew|success|error)" | tail -20
```

## Notes

- Certificates are valid for 90 days
- Let's Encrypt recommends renewing when certificates are within 30 days of expiry
- The renewal script automatically checks and only renews if needed
- Force renewal bypasses the expiry check (needed for expired certificates)
- Rate limits: 50 renewals per week per domain (very unlikely to hit this)

