#!/bin/bash
# Script to manually renew certificates and reload Apache

set -e

echo "Starting certificate renewal process..."

# Check if certbot container is running
if ! docker ps | grep -q certbot; then
    echo "Error: certbot container is not running. Starting it..."
    docker start certbot || docker compose -f docker-compose.prod.yml up -d certbot
    sleep 2
fi

# Renew certificates using certbot container
echo "Running certbot renew..."
if docker exec certbot certbot renew --webroot --webroot-path=/var/www/html --quiet; then
    echo "Certificate renewal completed successfully"
    
    # Reload Apache in the webserver container
    echo "Reloading Apache..."
    docker exec restorationregeneration-prod-container apache2ctl graceful
    echo "Apache reloaded successfully"
    
    # Show certificate status
    echo ""
    echo "Certificate status:"
    docker exec certbot certbot certificates
else
    echo "Certificate renewal failed"
    exit 1
fi

