#!/usr/bin/env bash
# Generate cryptographically secure secrets for Strapi .env
# Usage: ./scripts/generate-secrets.sh [--write]
#   --write : append to .env (creates it from .env.example if missing)
set -euo pipefail

gen() { openssl rand -base64 32 | tr -d '\n'; }

APP_KEYS="$(gen),$(gen),$(gen),$(gen)"
API_TOKEN_SALT="$(gen)"
ADMIN_JWT_SECRET="$(gen)"
TRANSFER_TOKEN_SALT="$(gen)"
JWT_SECRET="$(gen)"
ENCRYPTION_KEY="$(gen)"

BLOCK=$(cat <<EOF
APP_KEYS=${APP_KEYS}
API_TOKEN_SALT=${API_TOKEN_SALT}
ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
TRANSFER_TOKEN_SALT=${TRANSFER_TOKEN_SALT}
JWT_SECRET=${JWT_SECRET}
ENCRYPTION_KEY=${ENCRYPTION_KEY}
EOF
)

if [[ "${1:-}" == "--write" ]]; then
  cd "$(dirname "$0")/.."
  if [[ ! -f .env ]]; then
    cp .env.example .env
    echo "Created .env from .env.example"
  fi
  # Remove existing secret lines, then append fresh ones
  tmp=$(mktemp)
  grep -vE '^(APP_KEYS|API_TOKEN_SALT|ADMIN_JWT_SECRET|TRANSFER_TOKEN_SALT|JWT_SECRET|ENCRYPTION_KEY)=' .env > "$tmp" || true
  mv "$tmp" .env
  printf '%s\n' "$BLOCK" >> .env
  chmod 600 .env
  echo "Wrote fresh secrets to .env (mode 600)"
else
  echo "# Copy these into .env (pass --write to do it automatically):"
  echo "$BLOCK"
fi
