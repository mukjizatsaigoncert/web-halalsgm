#!/usr/bin/env bash
# =============================================================
# monitor.sh — Quick health & metrics snapshot for the SFC stack
#
# Usage:
#   ./scripts/monitor.sh           # full report
#   ./scripts/monitor.sh redis     # Redis only
#   ./scripts/monitor.sh health    # health endpoints only
#   ./scripts/monitor.sh logs      # tail last 50 lines from all services
# =============================================================
set -euo pipefail
cd "$(dirname "$0")/.."

# Load env
[[ -f .env ]] && export $(grep -v '^#' .env | grep -v '^$' | xargs)

METRICS_TOKEN="${METRICS_TOKEN:-}"
API_URL="http://localhost:1337"
FE_URL="http://localhost:3000"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'; BOLD='\033[1m'

ok()   { echo -e "${GREEN}✅ $*${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $*${NC}"; }
fail() { echo -e "${RED}❌ $*${NC}"; }
hdr()  { echo -e "\n${BOLD}━━ $* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"; }

MODE="${1:-all}"

# ── Container status ─────────────────────────────────────────────────────────
show_containers() {
  hdr "🐳 Docker Containers"
  docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || \
  docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep sfc
}

# ── Health endpoints ──────────────────────────────────────────────────────────
show_health() {
  hdr "🏥 Health Endpoints"

  # Backend liveness
  if status=$(curl -sf "${API_URL}/api/health" 2>/dev/null); then
    ok "Backend liveness: $(echo $status | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d["status"], "uptime="+str(d["uptimeSeconds"])+"s")' 2>/dev/null || echo $status)"
  else
    fail "Backend liveness: UNREACHABLE"
  fi

  # Backend readiness
  if status=$(curl -sf "${API_URL}/api/health/ready" 2>/dev/null); then
    ok "Backend readiness: $(echo $status | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d["status"])' 2>/dev/null || echo $status)"
  else
    fail "Backend readiness: FAIL"
  fi

  # Frontend
  if curl -sf "${FE_URL}/api/health" -o /dev/null 2>/dev/null; then
    ok "Frontend: reachable"
  else
    warn "Frontend: not reachable (may be behind nginx)"
  fi
}

# ── Metrics endpoint ──────────────────────────────────────────────────────────
show_metrics() {
  hdr "📊 Metrics (/api/health/metrics)"
  local auth_header=""
  [[ -n "$METRICS_TOKEN" ]] && auth_header="-H 'Authorization: Bearer ${METRICS_TOKEN}'"

  local raw
  raw=$(curl -sf ${auth_header:+"$auth_header"} "${API_URL}/api/health/metrics" 2>/dev/null) || {
    warn "Metrics endpoint unreachable (backend down or wrong token)"
    return
  }

  echo "$raw" | python3 -c "
import sys, json
d = json.load(sys.stdin)
mem = d.get('memory', {})
redis = d.get('redis', {})
db = d.get('database', {})
print(f\"  Uptime:         {d.get('uptime_seconds', '?')}s\")
print(f\"  Memory RSS:     {mem.get('rss_mb','?')} MB\")
print(f\"  Heap used/total:{mem.get('heap_used_mb','?')} / {mem.get('heap_total_mb','?')} MB\")
print()
if redis.get('status') == 'connected':
  hr = redis.get('hit_rate_pct')
  hr_str = f'{hr}%' if hr is not None else 'N/A (cold)'
  print(f\"  Redis status:   {redis['status']}\")
  print(f\"  Redis hit rate: {hr_str}  (hits={redis.get('hits',0)}, misses={redis.get('misses',0)})\")
  print(f\"  Cached API keys:{redis.get('cached_api_keys',0)}  (TTL={redis.get('ttl_seconds')}s)\")
else:
  print(f\"  Redis: {redis.get('status','?')}\")
print()
print(f\"  DB status:      {db.get('status','?')}\")
print(f\"  DB connections: {db.get('active_connections','?')}\")
" 2>/dev/null || echo "$raw" | head -20
}

# ── Redis direct ──────────────────────────────────────────────────────────────
show_redis() {
  hdr "🔴 Redis Direct Stats"
  if ! docker exec sfc-redis-1 redis-cli -a "${REDIS_PASSWORD:-}" ping &>/dev/null; then
    fail "Redis not reachable"; return
  fi
  docker exec sfc-redis-1 redis-cli -a "${REDIS_PASSWORD:-}" info stats 2>/dev/null | \
    grep -E "keyspace_hits|keyspace_misses|total_commands_processed|expired_keys|evicted_keys" | \
    while IFS=: read key val; do
      printf "  %-32s %s\n" "$key" "$(echo $val | tr -d '\r')"
    done
  echo ""
  echo "  Cached API keys:"
  docker exec sfc-redis-1 redis-cli -a "${REDIS_PASSWORD:-}" \
    --scan --pattern "strapi:api:*" 2>/dev/null | wc -l | xargs printf "  %-32s %s\n" "  count"
}

# ── Resource usage ────────────────────────────────────────────────────────────
show_resources() {
  hdr "💻 Resource Usage"
  docker stats --no-stream --format \
    "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}" \
    2>/dev/null | grep -E "NAME|sfc-"
}

# ── Nginx cache stats ─────────────────────────────────────────────────────────
show_nginx() {
  hdr "🌐 Nginx (last 100 requests)"
  docker exec sfc-nginx-1 tail -100 /var/log/nginx/access.log 2>/dev/null | \
    awk '{
      if ($0 ~ "HIT") hits++
      else if ($0 ~ "MISS") misses++
      total++
    } END {
      printf "  Requests: %d  |  Cache HIT: %d  |  MISS: %d\n", total, hits+0, misses+0
      if (total>0) printf "  Hit rate: %.0f%%\n", (hits+0)/total*100
    }' || warn "Nginx log not accessible"
}

# ── Logs tail ─────────────────────────────────────────────────────────────────
show_logs() {
  hdr "📋 Recent Logs (last 20 lines per service)"
  for svc in backend frontend; do
    echo -e "\n${BOLD}--- $svc ---${NC}"
    docker compose logs --tail=20 $svc 2>/dev/null || true
  done
}

# ── Disk usage ────────────────────────────────────────────────────────────────
show_disk() {
  hdr "💾 Disk & Volumes"
  df -h / | tail -1 | awk '{printf "  Disk: used=%s / total=%s (%s used)\n", $3, $2, $5}'
  echo ""
  docker volume ls --format "{{.Name}}" | grep sfc | while read vol; do
    size=$(docker run --rm -v "$vol":/data alpine du -sh /data 2>/dev/null | cut -f1)
    printf "  %-30s %s\n" "$vol" "$size"
  done
}

# ── Main ──────────────────────────────────────────────────────────────────────
case "$MODE" in
  containers) show_containers ;;
  health)     show_health ;;
  metrics)    show_metrics ;;
  redis)      show_redis ;;
  resources)  show_resources ;;
  nginx)      show_nginx ;;
  logs)       show_logs ;;
  disk)       show_disk ;;
  all)
    show_containers
    show_health
    show_metrics
    show_redis
    show_resources
    show_nginx
    show_disk
    echo ""
    ok "Monitor complete — $(date)"
    ;;
  *)
    echo "Usage: $0 [all|containers|health|metrics|redis|resources|nginx|logs|disk]"
    exit 1
    ;;
esac

