#!/bin/bash
# Script to force renew expired certificates

set -e

echo "Starting FORCE certificate renewal process..."
echo "WARNING: This will force renewal even if certificates are not due for renewal."
echo ""

# Check if certbot container is running
if ! docker ps | grep -q certbot; then
    echo "Error: certbot container is not running. Starting it..."
    docker start certbot || docker compose -f docker-compose.prod.yml up -d certbot
    sleep 2
fi

# Show current certificate status
echo "Current certificate status:"
docker exec certbot certbot certificates || echo "Could not retrieve certificate status"

echo ""
echo "Starting force renewal..."

# Force renew certificates using certbot container
if docker exec certbot certbot renew --webroot --webroot-path=/var/www/html --force-renewal --quiet; then
    echo "Certificate force renewal completed successfully"
    
    # Reload Apache in the webserver container
    echo "Reloading Apache..."
    docker exec restorationregeneration-prod-container apache2ctl graceful
    echo "Apache reloaded successfully"
    
    # Show updated certificate status
    echo ""
    echo "Updated certificate status:"
    docker exec certbot certbot certificates
    
    echo ""
    echo "Checking certificate expiry dates:"
    for domain in rr.newmediacaucus.org rr.shimmeringtrashpile.com; do
        if docker exec certbot test -f /etc/letsencrypt/live/$domain/fullchain.pem; then
            echo -n "$domain: "
            docker exec certbot openssl x509 -in /etc/letsencrypt/live/$domain/fullchain.pem -text -noout | grep "Not After" | sed 's/^[[:space:]]*Not After[[:space:]]*: //'
        fi
    done
else
    echo "Certificate force renewal failed"
    echo "Check logs with: docker logs certbot"
    exit 1
fi

