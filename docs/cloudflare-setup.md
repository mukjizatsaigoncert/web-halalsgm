# Cloudflare CDN — Hướng dẫn cấu hình

Sau khi deploy server, cần cấu hình thêm trên **Cloudflare Dashboard** để kích hoạt CDN đầy đủ.

---

## 1. Trỏ DNS về server

| Type  | Name        | Content (IP server) | Proxy      |
|-------|-------------|---------------------|------------|
| A     | `halalsgm.vn`    | `<SERVER_IP>`       | ✅ Proxied |
| A     | `www`       | `<SERVER_IP>`       | ✅ Proxied |
| A     | `api`       | `<SERVER_IP>`       | ✅ Proxied |

> **Lưu ý:** Khi proxy được bật (màu cam), traffic đi qua Cloudflare CDN, nginx sẽ thấy IP của Cloudflare. Đã xử lý sẵn bằng `set_real_ip_from` trong nginx.

---

## 2. SSL/TLS Mode

**SSL/TLS → Overview → Encryption mode:** chọn **Full (strict)**

> Cloudflare ↔ Origin dùng HTTPS với cert hợp lệ (Let's Encrypt đã có sẵn). Không dùng "Flexible" — sẽ gây redirect loop.

---

## 3. Cache Rules (quan trọng nhất)

Vào **Caching → Cache Rules → Create rule**.

### Rule 1 — Static assets (Next.js & uploads)
| Field | Value |
|-------|-------|
| **Condition** | URI Path matches `/_next/static/*` OR URI Path matches `/uploads/*` |
| **Cache eligibility** | Eligible for cache |
| **Edge TTL** | Override origin, 30 days |
| **Browser TTL** | Override origin, 7 days |

### Rule 2 — API responses (dùng Redis TTL)
| Field | Value |
|-------|-------|
| **Condition** | Hostname `api.halalsgm.vn` AND URI Path starts with `/api/` AND Request Method `GET` |
| **Cache eligibility** | Eligible for cache |
| **Edge TTL** | Use origin Cache-Control header *(nginx đã set `s-maxage=60`)* |
| **Browser TTL** | Bypass cache |

### Rule 3 — Không cache admin & mutations
| Field | Value |
|-------|-------|
| **Condition** | Hostname `api.halalsgm.vn` AND (URI Path starts with `/admin` OR Request Method in `POST, PUT, DELETE, PATCH`) |
| **Cache eligibility** | Bypass cache |

---

## 4. Cấu hình Security

### WAF — Rate Limiting
Vào **Security → WAF → Rate limiting rules**:

| Rule | Match | Threshold | Action |
|------|-------|-----------|--------|
| Contact form | `api.halalsgm.vn/api/contacts` POST | 5 req/min per IP | Block 10 phút |
| Admin brute force | `api.halalsgm.vn/admin/login` | 10 req/min per IP | Challenge |

### Bot Fight Mode
**Security → Bots → Bot Fight Mode:** bật ON

### Under Attack Mode
Bật khi cần tại **Security → Settings** (chỉ dùng tạm thời khi bị tấn công).

---

## 5. Performance

### Minify (tuỳ chọn)
**Speed → Optimization → Content Optimization:**
- JavaScript: ✅
- CSS: ✅
- HTML: ✅ (cẩn thận với dynamic content)

### HTTP/2 & HTTP/3
**Network:**
- HTTP/2: ✅ (default)
- HTTP/3 with QUIC: ✅
- 0-RTT Connection Resumption: ✅

### Tiered Cache
**Caching → Tiered Cache:** bật **Smart Tiered Cache Topology** để giảm cache miss đến origin.

---

## 6. Purge cache khi deploy

Sau mỗi lần deploy, purge cache Cloudflare để tránh stale content:

```bash
# Purge toàn bộ cache (dùng khi deploy lớn)
curl -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/purge_cache" \
  -H "Authorization: Bearer <CF_API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything": true}'

# Purge theo URL cụ thể (nhẹ nhàng hơn)
curl -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/purge_cache" \
  -H "Authorization: Bearer <CF_API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{
    "files": [
      "https://halalsgm.vn/",
      "https://halalsgm.vn/blog",
      "https://api.halalsgm.vn/api/articles"
    ]
  }'
```

> Lấy `ZONE_ID` tại **Overview** của domain. Tạo `CF_API_TOKEN` tại **My Profile → API Tokens → Edit zone DNS**.

---

## 7. Luồng cache tổng quan sau khi cấu hình

```
User
 │
 ▼
Cloudflare Edge (CDN)
 │  - Static/_next/static: cache 1 năm
 │  - HTML pages: cache 5 phút (s-maxage=300)
 │  - /api/* GET: cache 60 giây (s-maxage=60)
 │  - /uploads/*: cache 30 ngày
 │  - POST/PUT/DELETE: bypass
 │
 ▼ (cache miss)
Nginx (origin)
 │
 ├──> Frontend (Next.js)
 │
 └──> Backend (Strapi)
          │
          ▼
       Redis (in-memory cache, TTL=60s)
          │ (cache miss)
          ▼
       PostgreSQL
```

**Tỷ lệ hit thực tế kỳ vọng:**
- Static assets: ~99% hit tại Cloudflare
- HTML pages: ~80-90% hit tại Cloudflare
- API GET: ~70% hit tại Cloudflare + ~90% hit tại Redis (cache miss đến PG rất ít)

