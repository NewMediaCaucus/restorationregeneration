# Certificate Renewal Instructions

## Why certificates stopped updating
The certbot container is intentionally idle (`sleep infinity`) so you can `docker exec` into it. **It never runs `certbot renew` on its own.** Automatic renewal requires a **host cron job** that runs `docker exec certbot certbot renew ...` and reloads Apache.

A common mistake is scheduling **`docker restart certbot`** only—that restarts the container but **does not** renew certificates.

See **README-certbot.md** for the full guide (cron examples, dry-run, troubleshooting).

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

# Check expiry for the primary lineage
sudo docker exec certbot openssl x509 -in /etc/letsencrypt/live/rr.newmediacaucus.org/fullchain.pem -text -noout | grep "Not After"
```

### Step 4: Test HTTPS Access

```bash
curl -I https://rr.newmediacaucus.org
```

### Step 5: Set Up Automatic Renewal (Important!)

To prevent this from happening again, set up a cron job:

```bash
# Edit crontab
sudo crontab -e

# Add this line to run renewal twice daily (at 2 AM and 2 PM)
0 2,14 * * * cd /home/rrnmc/restorationregeneration && /usr/bin/docker exec certbot certbot renew --webroot --webroot-path=/var/www/html --quiet && /usr/bin/docker exec restorationregeneration-prod-container apache2ctl graceful >/dev/null 2>&1

# Or use the renewal script (in root's crontab, omit sudo)
0 2,14 * * * cd /home/rrnmc/restorationregeneration && ./certbot-renew.sh >>/var/log/certbot-cron.log 2>&1
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

