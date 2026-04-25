#!/usr/bin/env bash
# Nightly PostgreSQL backup. Keeps 30 days of daily dumps, pushes older ones
# to long-term storage if BACKUP_S3_BUCKET is set.
#
# Usage (cron):
#   0 3 * * * /opt/sfc/scripts/backup-postgres.sh >> /var/log/sfc-backup.log 2>&1
#
# Env:
#   BACKUP_DIR       (default /var/backups/sfc)
#   RETENTION_DAYS   (default 30)
#   BACKUP_S3_BUCKET (optional, requires aws CLI)
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/backups/sfc}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
FILE="${BACKUP_DIR}/sfc-${STAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

# Run pg_dump inside the compose postgres container so we don't need a
# client on the host.
docker compose exec -T postgres pg_dump \
  --username="${POSTGRES_USER:-sfc}" \
  --dbname="${POSTGRES_DB:-sfc}" \
  --format=custom --compress=6 \
  | gzip > "$FILE"

echo "[backup] wrote $FILE ($(du -h "$FILE" | cut -f1))"

# Prune old local dumps.
find "$BACKUP_DIR" -type f -name 'sfc-*.sql.gz' -mtime +"$RETENTION_DAYS" -delete

# Push to S3 if configured.
if [[ -n "${BACKUP_S3_BUCKET:-}" ]] && command -v aws >/dev/null 2>&1; then
  aws s3 cp "$FILE" "s3://${BACKUP_S3_BUCKET}/postgres/$(basename "$FILE")"
  echo "[backup] uploaded to s3://${BACKUP_S3_BUCKET}/postgres/"
fi
