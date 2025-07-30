#!/bin/bash

# This script runs inside the container


# abort if we reference a variable which has not been set.
set -e -u

# Double square brackets tests the condition
# usermod exists on linux but not BSD/osx
# usermod is returning UID '0' already exists on the server
[[ $USERID ]] && usermod --uid "${USERID}" www-data

exec "$@"