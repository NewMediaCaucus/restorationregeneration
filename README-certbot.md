# Certbot SSL Certificate Management

## Overview

This project uses a Docker-based certbot container to manage Let's Encrypt certificates for the production site. The setup handles certificate generation, renewal, and Apache configuration; **automation depends on host cron** (see below).

## Architecture

### Container Setup
- **certbot container**: Manages SSL certificates using Let's Encrypt
- **webserver container**: Apache server that uses the certificates
- **Shared volumes**: `/etc/letsencrypt` is mounted to both containers

### Domains and certificates
- Apache may define more than one hostname (see `default.prod.conf`).
- **Certbot only renews certificate lineages that exist on the server** under `/etc/letsencrypt/renewal/`. The production site’s Let’s Encrypt cert is **`rr.newmediacaucus.org`**; renewals apply to whatever names are on that lineage (check with `certbot certificates`).

## How It Works

### Certificate Generation

1. **Initial certificate generation**: Uses webroot method for domain verification
2. **Apache configuration**: VirtualHost blocks handle both HTTP and HTTPS
3. **ACME challenge**: Let's Encrypt verifies domain ownership through `.well-known/acme-challenge/`

### Certificate Renewal

1. **Automatic renewal**: Requires a cron job to be set up (see Automation section)
2. **Manual renewal**: Can be triggered manually using the renewal scripts
3. **Apache reload**: Apache is automatically reloaded after successful renewal

## Configuration Files

### Docker Compose (`docker-compose.prod.yml`)
```yaml
certbot:
  image: certbot/certbot
  container_name: certbot
  user: root
  entrypoint: /bin/sh
  command: -c "sleep infinity"
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt
    - ./letsencrypt-logs:/var/log/letsencrypt
    - .:/var/www/html
  restart: unless-stopped
```

**Note**: The certbot container stays idle so you can `docker exec` into it. **It never runs `certbot renew` by itself.** Renewal must be triggered by **cron** (or manually via `certbot-renew.sh` / `certbot-force-renew.sh`).

### Apache Configuration (`default.prod.conf`)
- HTTP VirtualHost blocks for both domains
- HTTPS VirtualHost blocks with SSL certificate paths
- ACME challenge directory configuration

## Monitoring and Maintenance

### Check Certificate Status
```bash
# Check all certificates
sudo docker exec certbot certbot certificates

# Check certificate expiry (primary lineage)
sudo docker exec certbot openssl x509 -in /etc/letsencrypt/live/rr.newmediacaucus.org/fullchain.pem -text -noout | grep "Not After"
# If you have another lineage on this host, repeat with that directory under live/
```

### Check Container Status
```bash
# Check if certbot container is running
sudo docker ps | grep certbot

# Check certbot logs
sudo docker logs certbot --tail 20
```

### Test Certificate Renewal
```bash
# Test renewal without actually renewing (dry run)
sudo docker exec certbot certbot renew --webroot --webroot-path=/var/www/html --dry-run

# Test actual renewal (only renews if certificates are close to expiry)
sudo ./certbot-renew.sh
```

### Check Renewal Logs
```bash
# Check recent renewal activity
sudo docker logs certbot | grep -E "(renew|success|error)" | tail -10

# Check letsencrypt logs
sudo docker exec certbot tail -20 /var/log/letsencrypt/letsencrypt.log
```

## Manual Operations

### Renew Certificates Manually
```bash
# Run the renewal script (only renews if certificates are close to expiry)
sudo ./certbot-renew.sh

# Force renewal of expired certificates (use when certificates have expired)
sudo ./certbot-force-renew.sh
```

### Reload Apache After Renewal
```bash
# Reload Apache manually
sudo ./reload-apache.sh
```

### Test HTTPS Access
```bash
curl -I https://rr.newmediacaucus.org
# Optional: any other vhost you serve from this Apache config
```

## Troubleshooting

### Common Issues

#### 1. Cron runs `docker restart certbot` but certificates still expire
**Cause**: Restarting the container does **not** run `certbot renew`. The container only runs `sleep infinity`.

**Fix**: Use a cron line that runs `docker exec certbot certbot renew ...` and then reloads Apache (see [Automation](#set-up-automatic-renewal)). Verify with: `sudo docker exec certbot certbot renew --webroot --webroot-path=/var/www/html --dry-run`

#### 2. "Another instance of Certbot is already running"
**Cause**: Certbot process is already running in the container
**Solution**: 
```bash
# Stop and restart the certbot container
sudo docker stop certbot
sudo docker start certbot
```

#### 3. Certificate renewal fails
**Cause**: DNS issues, rate limits, or webroot access problems
**Solution**:
```bash
# Check DNS resolution
nslookup rr.newmediacaucus.org
nslookup rr.shimmeringtrashpile.com

# Check webroot access
curl http://rr.newmediacaucus.org/.well-known/acme-challenge/
```

#### 4. Apache configuration errors
**Cause**: Missing certificate files or configuration issues
**Solution**:
```bash
# Test Apache configuration
sudo docker exec restorationregeneration-prod-container apache2ctl -t

# Check certificate file existence
sudo docker exec certbot ls -la /etc/letsencrypt/live/
```

### Debug Commands

#### Check Certificate Files
```bash
# List all certificate files
sudo docker exec certbot find /etc/letsencrypt/live/ -name "*.pem" -exec openssl x509 -in {} -text -noout \; | grep -E "(Subject|Not After)"
```

#### Check Apache Error Logs
```bash
# Check Apache error logs
sudo docker exec restorationregeneration-prod-container tail -20 /var/log/apache2/error.log
```

#### Check Let's Encrypt Rate Limits
```bash
# Check rate limit status
sudo docker exec certbot certbot renew --dry-run
```

## Automation

### Set up Automatic Renewal
To ensure certificates are renewed automatically, you **must** set up a cron job. Without this, certificates will not renew automatically:

```bash
# Edit crontab as root or with sudo
sudo crontab -e

# Add one of these lines (choose based on your preference):

# Option 1: Run renewal twice daily (at 2 AM and 2 PM) - RECOMMENDED
0 2,14 * * * cd /home/rrnmc/restorationregeneration && /usr/bin/docker exec certbot certbot renew --webroot --webroot-path=/var/www/html --quiet && /usr/bin/docker exec restorationregeneration-prod-container apache2ctl graceful >/dev/null 2>&1

# Option 2: Use the renewal script (runs twice daily). In root's crontab, omit sudo:
0 2,14 * * * cd /home/rrnmc/restorationregeneration && ./certbot-renew.sh >>/var/log/certbot-cron.log 2>&1

# Option 3: Run every 6 hours (more frequent but still safe)
0 */6 * * * cd /home/rrnmc/restorationregeneration && ./certbot-renew.sh >>/var/log/certbot-cron.log 2>&1
```

**Do not** schedule only `docker restart certbot`—that does not renew certificates.

**Important**: Certificates will NOT renew automatically without a cron job that runs `certbot renew` (via `docker exec` or `certbot-renew.sh`). The certbot container does not renew on its own.

### Monitor Renewal Process
```bash
# Check when certificates were last renewed
sudo docker logs certbot | grep -E "(renew|success|error)" | tail -10

# Check certificate expiry dates
sudo docker exec certbot certbot certificates
```

## Certificate Details

### Let's Encrypt Certificates
- **Validity**: 90 days
- **Renewal**: Recommended to run renewal checks daily or twice daily via cron
- **Auto-renewal threshold**: Certificates are automatically renewed when within 30 days of expiry
- **Method**: Webroot verification
- **Domains**: Names on the same certificate lineage renew together; each lineage has its own renewal config

### Certificate Locations
- **Live certificates**: `/etc/letsencrypt/live/[domain]/`
- **Archive**: `/etc/letsencrypt/archive/[domain]/`
- **Logs**: `/var/log/letsencrypt/letsencrypt.log`

## Security Notes

### Certificate Security
- Certificates are stored in `/etc/letsencrypt/` on the host
- Private keys are protected with appropriate permissions
- Certificates are automatically renewed before expiry

### Rate Limits
- Let's Encrypt has rate limits (50 renewals per week per domain)
- Running renewal checks twice daily is well within limits (certbot only actually renews if certificates are within 30 days of expiry)
- Dry-run tests don't count against rate limits
- Force renewal counts against rate limits, so use sparingly

## Related Files

- `docker-compose.prod.yml` - Container configuration
- `default.prod.conf` - Apache SSL configuration
- `certbot-renew.sh` - Manual renewal script (for normal renewals)
- `certbot-force-renew.sh` - Force renewal script (for expired certificates); prints expiry for `rr.newmediacaucus.org` after success
- `reload-apache.sh` - Apache reload script
- `renewal-hook.sh` - Renewal hook script (alternative approach)

## Best Practices

1. **Set up cron job**: Ensure automatic renewal is configured (see Automation section)
2. **Monitor regularly**: Check certificate status weekly
3. **Test renewal**: Run dry-run tests monthly: `sudo docker exec certbot certbot renew --webroot --webroot-path=/var/www/html --dry-run`
4. **Backup certificates**: Consider backing up `/etc/letsencrypt/`
5. **Monitor logs**: Check for renewal errors in certbot logs
6. **Test HTTPS**: Verify your live site over HTTPS after renewal
7. **Verify cron is running**: Periodically check that your cron job is executing successfully

## Emergency Procedures

### If Certificates Expire
```bash
# Use the force renewal script (recommended)
sudo ./certbot-force-renew.sh

# OR manually force renewal
sudo docker exec certbot certbot renew --webroot --webroot-path=/var/www/html --force-renewal

# Reload Apache
sudo docker exec restorationregeneration-prod-container apache2ctl graceful
```

### If Container Fails
```bash
# Restart the certbot container (keeps volumes; does not renew certs by itself)
sudo docker restart certbot

# Check container status
sudo docker ps | grep certbot
```

### If Apache Configuration Fails
```bash
# Test configuration
sudo docker exec restorationregeneration-prod-container apache2ctl -t

# Check certificate paths
sudo docker exec certbot ls -la /etc/letsencrypt/live/
``` 