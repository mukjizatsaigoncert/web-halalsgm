#!/usr/bin/env bash
# Install a Cloudflare Origin CA certificate for co-hosted VPS deploys where
# HTTP_PORT/HTTPS_PORT are non-default and certbot --standalone can't bind
# host port 80 (see scripts/init-ssl.sh, which assumes exclusive port 80).
#
# Generate the cert first: Cloudflare Dashboard → SSL/TLS → Origin Server →
# Create Certificate (list all hostnames as SANs, e.g. halalsgm.vn,
# www.halalsgm.vn — 15-year validity, no renewal needed). Download the two
# PEM files it gives you, then run this script once per cert.
#
# Usage:  ./scripts/init-ssl-cloudflare.sh <cert.pem> <key.pem> <domain> [domain ...]
# Example:
#   ./scripts/init-ssl-cloudflare.sh ~/origin-cert.pem ~/origin-key.pem halalsgm.vn www.halalsgm.vn
#   ./scripts/init-ssl-cloudflare.sh ~/api-origin-cert.pem ~/api-origin-key.pem api.halalsgm.vn
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "usage: $0 <cert.pem> <key.pem> <domain> [domain ...]"
  exit 1
fi

CERT="$1"; KEY="$2"; shift 2
DOMAINS=("$@")

cd "$(dirname "$0")/.."

[[ -f "$CERT" ]] || { echo "cert not found: $CERT"; exit 1; }
[[ -f "$KEY"  ]] || { echo "key not found: $KEY"; exit 1; }

for d in "${DOMAINS[@]}"; do
  echo "[ssl] installing cert for $d"
  mkdir -p "nginx/certs/live/$d"
  cp "$CERT" "nginx/certs/live/$d/fullchain.pem"
  cp "$KEY"  "nginx/certs/live/$d/privkey.pem"
  chmod 600 "nginx/certs/live/$d/privkey.pem"
done

echo "[ssl] testing nginx config"
docker compose exec nginx nginx -t

echo "[ssl] reloading nginx"
docker compose exec nginx nginx -s reload

echo "[ssl] done — Origin CA certs are valid ~15 years, no renewal cron needed"
