# Certbot SSL Certificate Management

## Overview

This project uses a Docker-based certbot container to automatically manage SSL certificates for multiple domains using Let's Encrypt. The setup handles certificate generation, renewal, and Apache configuration.

## Architecture

### Container Setup
- **certbot container**: Manages SSL certificates using Let's Encrypt
- **webserver container**: Apache server that uses the certificates
- **Shared volumes**: `/etc/letsencrypt` is mounted to both containers

### Domains Supported
- `rr.shimmeringtrashpile.com` (existing)
- `rr.newmediacaucus.org` (newly added)

## How It Works

### Certificate Generation
1. **Initial certificate generation**: Uses webroot method for domain verification
2. **Apache configuration**: VirtualHost blocks handle both HTTP and HTTPS
3. **ACME challenge**: Let's Encrypt verifies domain ownership through `.well-known/acme-challenge/`

### Certificate Renewal
1. **Automatic renewal**: Certificates are renewed every 12 hours
2. **Manual renewal**: Can be triggered manually when needed
3. **Apache reload**: Apache is reloaded after successful renewal

## Configuration Files

### Docker Compose (`docker-compose.prod.yml`)
```yaml
certbot:
  image: certbot/certbot
  container_name: certbot
  user: root
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt
    - ./letsencrypt-logs:/var/log/letsencrypt
    - .:/var/www/html
  command: "sleep infinity"
```

### Apache Configuration (`default.prod.conf`)
- HTTP VirtualHost blocks for both domains
- HTTPS VirtualHost blocks with SSL certificate paths
- ACME challenge directory configuration

## Monitoring and Maintenance

### Check Certificate Status
```bash
# Check all certificates
sudo docker exec certbot certbot certificates

# Check certificate expiry dates
sudo docker exec certbot openssl x509 -in /etc/letsencrypt/live/rr.newmediacaucus.org/fullchain.pem -text -noout | grep "Not After"
sudo docker exec certbot openssl x509 -in /etc/letsencrypt/live/rr.shimmeringtrashpile.com/fullchain.pem -text -noout | grep "Not After"
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
sudo docker exec certbot certbot renew --dry-run

# Test manual renewal
sudo docker exec certbot certbot renew --force-renewal
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
# Run the renewal script
sudo ./certbot-renew.sh
```

### Reload Apache After Renewal
```bash
# Reload Apache manually
sudo ./reload-apache.sh
```

### Test HTTPS Access
```bash
# Test HTTPS for both domains
curl -I https://rr.newmediacaucus.org
curl -I https://rr.shimmeringtrashpile.com
```

## Troubleshooting

### Common Issues

#### 1. "Another instance of Certbot is already running"
**Cause**: Certbot process is already running in the container
**Solution**: 
```bash
# Stop and restart the certbot container
sudo docker stop certbot
sudo docker start certbot
```

#### 2. Certificate renewal fails
**Cause**: DNS issues, rate limits, or webroot access problems
**Solution**:
```bash
# Check DNS resolution
nslookup rr.newmediacaucus.org
nslookup rr.shimmeringtrashpile.com

# Check webroot access
curl http://rr.newmediacaucus.org/.well-known/acme-challenge/
```

#### 3. Apache configuration errors
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
To ensure certificates are renewed automatically, you can set up a cron job:

```bash
# Add to crontab (runs every 6 hours)
# 0 */6 * * * cd /home/rrnmc/restorationregeneration && sudo ./certbot-renew.sh
```

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
- **Renewal**: Every 12 hours (well before expiry)
- **Method**: Webroot verification
- **Domains**: Both domains renewed together

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
- The 12-hour renewal interval is well within limits
- Dry-run tests don't count against rate limits

## Related Files

- `docker-compose.prod.yml` - Container configuration
- `default.prod.conf` - Apache SSL configuration
- `certbot-renew.sh` - Manual renewal script
- `reload-apache.sh` - Apache reload script
- `renewal-hook.sh` - Renewal hook script (alternative approach)

## Best Practices

1. **Monitor regularly**: Check certificate status weekly
2. **Test renewal**: Run dry-run tests monthly
3. **Backup certificates**: Consider backing up `/etc/letsencrypt/`
4. **Monitor logs**: Check for renewal errors
5. **Test HTTPS**: Verify both domains work correctly

## Emergency Procedures

### If Certificates Expire
```bash
# Force renewal of all certificates
sudo docker exec certbot certbot renew --force-renewal

# Reload Apache
sudo docker exec restorationregeneration-prod-container apache2ctl graceful
```

### If Container Fails
```bash
# Restart the certbot container
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