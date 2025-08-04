#!/bin/bash
# Script to reload Apache after certificate renewal

echo "Reloading Apache after certificate renewal..."

# Reload Apache in the webserver container
docker exec restorationregeneration-prod-container apache2ctl graceful

echo "Apache reloaded successfully" 