#!/usr/bin/env bash
set -e


MAESTRO_PORT=${MAESTRO_PORT:=5000}
GUNICORN_WORKERS=${GUNICORN_WORKERS:=10}
GUNICORN_THREADS=${GUNICORN_THREADS:=4}


printf "Starting Maestro API...\n"

gunicorn \
--bind 0.0.0.0:${MAESTRO_PORT} \
--workers ${GUNICORN_WORKERS} \
--threads ${GUNICORN_THREADS} \
--forwarded-allow-ips "*" \
--access-logfile "-" \
--timeout 1200 \
--preload \
wsgi:maestro_app
