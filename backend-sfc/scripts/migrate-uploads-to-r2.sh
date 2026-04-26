#!/usr/bin/env bash
# ============================================================
# migrate-uploads-to-r2.sh
#
# Migrate existing Strapi local uploads to Cloudflare R2.
# Run this ONCE after setting up R2, before switching the
# upload provider in plugins.ts / .env.
#
# Requirements:
#   - rclone installed  (https://rclone.org/install/)
#   - R2_* env vars set (or pass as arguments)
#
# Usage:
#   R2_ACCOUNT_ID=xxx R2_ACCESS_KEY_ID=xxx \
#   R2_SECRET_ACCESS_KEY=xxx R2_BUCKET=sfc-uploads \
#   ./scripts/migrate-uploads-to-r2.sh
#
#   Or with Docker volume:
#   ./scripts/migrate-uploads-to-r2.sh --from-volume sfc_strapi-uploads
# ============================================================
set -euo pipefail

R2_ACCOUNT_ID="${R2_ACCOUNT_ID:?R2_ACCOUNT_ID is required}"
R2_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID:?R2_ACCESS_KEY_ID is required}"
R2_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY:?R2_SECRET_ACCESS_KEY is required}"
R2_BUCKET="${R2_BUCKET:-sfc-uploads}"

UPLOADS_DIR="${UPLOADS_DIR:-./public/uploads}"
FROM_VOLUME=""

# Parse --from-volume flag
while [[ $# -gt 0 ]]; do
  case $1 in
    --from-volume) FROM_VOLUME="$2"; shift 2 ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

# If using Docker volume, extract to temp dir first
TEMP_DIR=""
if [[ -n "$FROM_VOLUME" ]]; then
  TEMP_DIR=$(mktemp -d)
  echo "[migrate] Extracting Docker volume '$FROM_VOLUME' → $TEMP_DIR ..."
  docker run --rm \
    -v "${FROM_VOLUME}:/data:ro" \
    -v "${TEMP_DIR}:/output" \
    alpine sh -c "cp -r /data/. /output/"
  UPLOADS_DIR="$TEMP_DIR"
fi

echo "[migrate] Source: $UPLOADS_DIR"
echo "[migrate] Destination: r2://$R2_BUCKET"

# Configure rclone on-the-fly (no config file needed)
export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_ACL=public-read

echo "[migrate] Starting upload with rclone sync..."
rclone sync "$UPLOADS_DIR" "r2:$R2_BUCKET" \
  --progress \
  --transfers 8 \
  --checkers 16 \
  --no-traverse \
  --s3-upload-concurrency 4

echo "[migrate] ✅ Done! All files uploaded to R2 bucket: $R2_BUCKET"

# Cleanup temp dir
if [[ -n "$TEMP_DIR" ]]; then
  rm -rf "$TEMP_DIR"
  echo "[migrate] Temp dir cleaned up."
fi

echo ""
echo "Next steps:"
echo "  1. Set R2_* env vars in .env"
echo "  2. Set R2_PUBLIC_URL to your R2 custom domain or .r2.dev URL"
echo "  3. Rebuild backend: docker compose up --build backend -d"
echo "  4. Verify uploads in Strapi Admin → Media Library"

