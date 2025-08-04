#!/bin/bash
# Renewal hook script for certbot
# This script is called after certificate renewal

echo "Certificate renewal completed, reloading Apache..."

# Reload Apache in the webserver container
docker exec restorationregeneration-prod-container apache2ctl graceful

echo "Apache reloaded successfully" 