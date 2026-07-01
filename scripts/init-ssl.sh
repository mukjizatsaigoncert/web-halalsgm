#!/usr/bin/env bash
# Bootstrap Let's Encrypt certificates for the Halal stack using certbot's
# standalone mode, then copy them into nginx/certs/ where docker-compose
# mounts them read-only.
#
# Usage:  sudo ./scripts/init-ssl.sh halalsgm.vn www.halalsgm.vn api.halalsgm.vn admin@halalsgm.vn
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "usage: $0 <domain> [<domain> ...] <email>"
  exit 1
fi

EMAIL="${!#}"
DOMAINS=("${@:1:$#-1}")

if ! command -v certbot >/dev/null; then
  echo "installing certbot..."
  apt-get update && apt-get install -y certbot
fi

# Temporarily stop nginx so certbot standalone can bind :80
docker compose stop nginx || true

for d in "${DOMAINS[@]}"; do
  echo "[ssl] issuing cert for $d"
  certbot certonly --standalone --non-interactive --agree-tos \
    --email "$EMAIL" \
    -d "$d"
done

mkdir -p nginx/certs
cp -RL /etc/letsencrypt/live nginx/certs/
cp -RL /etc/letsencrypt/archive nginx/certs/ 2>/dev/null || true

echo "[ssl] restarting nginx"
docker compose up -d nginx

echo "[ssl] add the following to root crontab for auto-renewal:"
echo "  0 2 * * * certbot renew --quiet --deploy-hook 'docker compose -f $(pwd)/docker-compose.yml exec nginx nginx -s reload'"
