#!/usr/bin/env bash
# Zero-minimal-downtime deploy for the docker-compose stack.
#
# Strategy:
#   1. git pull
#   2. build new images (tagged with git sha)
#   3. up -d with --no-deps --build so healthchecks gate traffic
#   4. prune dangling images
#
# Usage:  ./scripts/deploy.sh [backend|frontend|all]
set -euo pipefail

cd "$(dirname "$0")/.."

TARGET="${1:-all}"
SHA=$(git rev-parse --short HEAD)

echo "[deploy] target=$TARGET sha=$SHA"

# Pull latest source.
git fetch --tags origin
git pull --ff-only

# Reuse host env.
if [[ ! -f .env ]]; then
  echo "missing .env — copy from .env.example and fill in"
  exit 1
fi

build_and_up() {
  local svc=$1
  echo "[deploy] building $svc"
  docker compose build --pull "$svc"
  echo "[deploy] rolling $svc"
  docker compose up -d --no-deps "$svc"
}

case "$TARGET" in
  backend)  build_and_up backend ;;
  frontend) build_and_up frontend ;;
  all)
    build_and_up backend
    build_and_up frontend
    docker compose up -d nginx
    ;;
  *)
    echo "unknown target: $TARGET"
    exit 1
    ;;
esac

echo "[deploy] waiting for health..."
sleep 10
docker compose ps

echo "[deploy] pruning dangling images..."
docker image prune -f

echo "[deploy] done — sha=$SHA"
