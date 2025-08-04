#!/bin/bash
# Script to renew certificates and reload Apache

echo "Starting certificate renewal process..."

# Renew certificates
docker exec certbot certbot renew --force-renewal --config-dir /etc/letsencrypt --logs-dir /var/log/letsencrypt

# Check if renewal was successful
if [ $? -eq 0 ]; then
    echo "Certificate renewal completed successfully"
    
    # Reload Apache
    docker exec restorationregeneration-prod-container apache2ctl graceful
    echo "Apache reloaded successfully"
else
    echo "Certificate renewal failed"
    exit 1
fi 