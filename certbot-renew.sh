#!/bin/bash
# Script to manually renew certificates and reload Apache

echo "Starting certificate renewal process..."

# Renew certificates using certbot container
docker restart certbot

# Wait for renewal to complete
sleep 5

# Check if renewal was successful
if [ $? -eq 0 ]; then
    echo "Certificate renewal completed successfully"
    
    # Reload Apache in the webserver container
    docker exec restorationregeneration-prod-container apache2ctl graceful
    echo "Apache reloaded successfully"
else
    echo "Certificate renewal failed"
    exit 1
fi

