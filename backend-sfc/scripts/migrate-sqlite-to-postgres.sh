#!/usr/bin/env bash
# Migrate a Strapi SQLite dev database to PostgreSQL using Strapi's native
# export/import. This path is supported across DB clients because the export
# is a logical dump, not a pg_dump.
#
# Usage:
#   1. Start the SOURCE Strapi pointing at SQLite (default config)
#   2. Stop it, then run:  ./scripts/migrate-sqlite-to-postgres.sh
#   3. Update .env:  DATABASE_CLIENT=postgres  DATABASE_* credentials
#   4. Start Strapi — it will create the schema and import the dump
#
# Prereqs: strapi CLI available via npx, PostgreSQL reachable, tar + gzip.
set -euo pipefail

cd "$(dirname "$0")/.."

BACKUP_DIR=".migration"
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
ARCHIVE="${BACKUP_DIR}/sfc-${STAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "[1/3] Exporting current database to ${ARCHIVE}..."
npx strapi export \
  --file "${ARCHIVE%.tar.gz}" \
  --no-encrypt

echo
echo "[2/3] Verify the new PostgreSQL config in .env, then:"
echo "      DATABASE_CLIENT=postgres"
echo "      DATABASE_HOST=... DATABASE_PORT=5432 DATABASE_NAME=... DATABASE_USERNAME=... DATABASE_PASSWORD=..."
echo "      Press enter when ready, or Ctrl-C to abort."
read -r

echo "[3/3] Importing into the target database..."
npx strapi import --file "$ARCHIVE" --force

echo
echo "Migration complete. Backup kept at $ARCHIVE"
echo "Smoke-test the admin panel and content before deleting the SQLite file."
