#!/usr/bin/env bash
# deploy-dev.sh — Deploy dev stack with docker-compose.dev.yml overlay.
#
# Usage: ./scripts/deploy-dev.sh [backend|frontend|all]
set -euo pipefail

cd "$(dirname "$0")/.."

TARGET="${1:-all}"
SHA=$(git rev-parse --short HEAD)
COMPOSE="docker compose -f docker-compose.yml -f docker-compose.dev.yml"

echo "[deploy-dev] target=$TARGET sha=$SHA"

if [[ ! -f .env ]]; then
  echo "[deploy-dev] ERROR: .env not found — create it from .env.example"
  exit 1
fi

build_and_up() {
  local svc=$1
  echo "[deploy-dev] building $svc ..."
  $COMPOSE build --pull "$svc"
  echo "[deploy-dev] restarting $svc ..."
  $COMPOSE up -d --no-deps "$svc"
}

case "$TARGET" in
  backend)
    build_and_up backend
    ;;
  frontend)
    build_and_up frontend
    ;;
  all)
    build_and_up backend
    build_and_up frontend
    ;;
  *)
    echo "[deploy-dev] unknown target: $TARGET"
    exit 1
    ;;
esac

echo "[deploy-dev] waiting for health checks ..."
sleep 15
$COMPOSE ps

echo "[deploy-dev] pruning dangling images ..."
docker image prune -f

echo "[deploy-dev] ✅ done — sha=$SHA"

