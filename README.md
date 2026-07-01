# SAIGONCERT-v2 — Hướng dẫn triển khai

Em ơi, đây là cẩm nang anh viết để em chạy được hệ thống Halal (SaigonCert) từ con số 0 — cả lúc chạy local để code lẫn lúc deploy lên server thật. Em cứ đọc tuần tự từ trên xuống là làm được, không cần biết devops trước.

---

## 1. Hệ thống có gì?

Website của mình tên là **Halal** (SaigonCert), gồm 4 mảnh ghép, đóng gói gọn trong **Docker Compose** cho dễ chạy:

| Thành phần | Công nghệ | Vai trò |
|---|---|---|
| **Frontend** (`web-halal/`) | Next.js 15 + React 19 | Giao diện người dùng (https://halalsgm.vn) |
| **Backend** (`backend-halal/`) | Strapi 5 (Node.js 20) | API + trang quản trị nội dung (https://api.halalsgm.vn) |
| **Database** | PostgreSQL 16 | Lưu trữ dữ liệu |
| **Nginx** | Nginx 1.27 | Reverse proxy, SSL, rate-limit, cache |

Sơ đồ giao tiếp:

```
Internet ──HTTPS──▶ Nginx (80/443)
                     ├──▶ Frontend (Next.js, port 3000)
                     └──▶ Backend (Strapi, port 1337) ──▶ PostgreSQL (5432)
```

Em hình dung thế này cho dễ:

- **Lên prod**: chỉ Nginx "đứng ra cửa" tiếp khách. Frontend, Backend, DB nấp hết bên trong network nội bộ Docker, ngoài Internet không sờ tới được.
- **Chạy dev**: Nginx tắt cho gọn. Frontend ở `localhost:3001`, Backend ở `localhost:1337`, DB ở `localhost:5433` — em mở trực tiếp để debug nhanh.

---

## 2. Yêu cầu máy

| Môi trường | Cần có |
|---|---|
| **Dev (máy em)** | Docker + Docker Compose v2, Git |
| **Production (server)** | Ubuntu 22.04+ (hoặc tương đương), Docker, Docker Compose v2, Git, certbot (cho SSL) |

Em check Docker đã đúng version chưa:

```bash
docker --version          # cần >= 20
docker compose version    # cần v2 — tức là `docker compose`, không phải `docker-compose`
```

---

## 3. Tải mã nguồn

```bash
git clone <URL-repo-này> SAIGONCERT-v2
cd SAIGONCERT-v2
```

> Hai thư mục `backend-halal` và `web-halal` là code nằm cùng repo này luôn nhé, không phải submodule. Nếu clone xong em thấy chúng trống thì chạy `git status` xem có gì lạ không, báo anh.

---

## 4. Cấu hình biến môi trường (`.env`)

Tất cả config nằm trong file `.env` ở thư mục gốc. Có sẵn file mẫu rồi, em copy ra:

```bash
cp .env.example .env
```

### 4.1. Sinh secret cho Strapi

Strapi cần 6 chuỗi secret ngẫu nhiên (kiểu khoá để ký JWT, mã hoá dữ liệu...). Anh đã có script sinh tự động, em chạy:

```bash
./backend-halal/scripts/generate-secrets.sh --write
```

Script sẽ ghi 6 dòng này thẳng vào `.env`, em không phải tự nghĩ:
- `APP_KEYS`
- `API_TOKEN_SALT`
- `ADMIN_JWT_SECRET`
- `TRANSFER_TOKEN_SALT`
- `JWT_SECRET`
- `ENCRYPTION_KEY`

### 4.2. Mấy biến BẮT BUỘC em phải tự sửa

Mở `.env` lên, sửa lại mấy chỗ sau:

```bash
# Database
POSTGRES_DB=halal
POSTGRES_USER=halal
POSTGRES_PASSWORD=<đặt mật khẩu mạnh, đừng để 123456 nha>

# URL public (đổi theo domain thật mình đang dùng)
BACKEND_PUBLIC_URL=https://api.halalsgm.vn
NEXT_PUBLIC_STRAPI_URL=https://api.halalsgm.vn
NEXT_PUBLIC_SITE_URL=https://halalsgm.vn

# CORS — domain frontend nào được phép gọi backend
CORS_ORIGINS=https://halalsgm.vn,https://www.halalsgm.vn

# reCAPTCHA v3 (đăng ký ở https://www.google.com/recaptcha/admin)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<site-key>
RECAPTCHA_SECRET_KEY=<secret-key>
RECAPTCHA_MIN_SCORE=0.5
```

### 4.3. Mấy biến tuỳ chọn

```bash
# Sentry (theo dõi lỗi runtime) — không dùng thì để trống
FRONTEND_SENTRY_DSN=
BACKEND_SENTRY_DSN=
SENTRY_ENV=production
```

> Lưu ý quan trọng: **TUYỆT ĐỐI không commit `.env` lên git**. File này đã có trong `.gitignore` rồi nên em yên tâm, miễn đừng `git add -f` là được.

---

## 5. Chạy ở môi trường DEV (máy em)

Chế độ dev anh đã setup tắt Nginx, mở port trực tiếp ra `localhost` để em debug cho lẹ.

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Lần đầu build hơi lâu (cỡ 5-10 phút tuỳ máy), những lần sau cache lại nên nhanh thôi. Build xong em vào mấy URL này:

| Service | URL |
|---|---|
| Frontend | http://localhost:3001 |
| Backend API | http://localhost:1337/api |
| Strapi Admin | http://localhost:1337/admin |
| PostgreSQL | `localhost:5433` (user/pass theo `.env`) |

### Lần đầu vào Strapi Admin

1. Mở http://localhost:1337/admin
2. Form đăng ký admin sẽ hiện ra — em tạo tài khoản đầu tiên ở đây.
3. Vào **Settings → Users & Permissions → Roles → Public** xem mấy quyền đọc đã bật chưa. Bình thường script tự bật rồi, em chỉ check cho chắc.

### Lúc muốn dừng

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

Nếu em muốn xoá luôn cả dữ liệu DB (làm lại từ đầu) thì thêm `-v`: `down -v`. **Cẩn thận, lệnh này mất hết dữ liệu**, đừng nhấn nhầm trên prod.

---

## 6. Triển khai PRODUCTION

### 6.1. Chuẩn bị server

```bash
# Cài Docker (Ubuntu)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Logout rồi login lại để quyền có hiệu lực

# Cài certbot (để xin SSL)
sudo apt update && sudo apt install -y certbot
```

Anh hay clone code vào `/opt/halal` cho nhất quán, em làm theo:

```bash
sudo mkdir -p /opt && sudo chown $USER:$USER /opt
cd /opt
git clone <URL-repo> halal
cd halal
```

### 6.2. Trỏ DNS

Vào trang quản lý DNS (Cloudflare/tên miền em mua), tạo 3 bản ghi A trỏ về IP server:

```
halalsgm.vn          A    <IP-server>
www.halalsgm.vn      A    <IP-server>
api.halalsgm.vn      A    <IP-server>
```

Đợi DNS lan toả (vài phút tới vài giờ). Em check bằng `dig halalsgm.vn` hoặc vào https://dnschecker.org cho trực quan.

### 6.3. Cấu hình `.env`

Làm y như **mục 4** ở trên, nhớ dùng URL `https://` và domain thật.

### 6.4. Lấy chứng chỉ SSL

Script `init-ssl.sh` dùng certbot ở chế độ standalone — nó sẽ chiếm port 80 một lúc để verify, nên **chạy trước khi Nginx khởi động**.

```bash
sudo ./scripts/init-ssl.sh halalsgm.vn www.halalsgm.vn api.halalsgm.vn admin@halalsgm.vn
```

`admin@halalsgm.vn` là email Let's Encrypt gửi cảnh báo khi cert sắp hết hạn.

Script sẽ tự làm 3 việc:
1. Xin chứng chỉ cho cả 3 domain.
2. Copy vào `nginx/certs/`.
3. In ra dòng cron để em copy paste vào `sudo crontab -e`, bật auto-renew:

```cron
0 2 * * * certbot renew --quiet --deploy-hook 'docker compose -f /opt/halal/docker-compose.yml exec nginx nginx -s reload'
```

Em nhớ thêm dòng đó vào cron, không thì 90 ngày sau cert hết hạn là website sập.

### 6.5. Khởi động toàn bộ stack

```bash
docker compose up -d --build
```

Check trạng thái:

```bash
docker compose ps
```

Cột `STATUS` của tất cả service phải là `healthy`. Lần đầu đợi cỡ 1-2 phút cho healthcheck pass, đừng vội.

### 6.6. Kiểm tra hoạt động

- https://halalsgm.vn → trang chủ frontend hiện ra là ngon.
- https://api.halalsgm.vn/api/health → trả về JSON `{"status":"ok"}` (hoặc tương tự).
- https://api.halalsgm.vn/admin → form đăng ký admin Strapi (lần đầu).

---

## 7. Vận hành hàng ngày

### 7.1. Cập nhật code (deploy)

Anh viết sẵn script zero-downtime, em chỉ chạy 1 lệnh:

```bash
# Cập nhật toàn bộ
./scripts/deploy.sh all

# Hoặc chỉ một thành phần khi cần nhanh
./scripts/deploy.sh backend
./scripts/deploy.sh frontend
```

Script tự `git pull`, build image mới, rolling update từng service (đợi healthy mới chuyển), rồi dọn image cũ — em không phải lo downtime.

### 7.2. Xem log

```bash
# Xem hết các service
docker compose logs -f

# Hoặc soi 1 thằng cụ thể
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
docker compose logs -f postgres
```

`-f` là follow (xem real-time). Bấm `Ctrl+C` để thoát.

### 7.3. Backup database

Có script backup gọn gàng, dump rồi nén `.sql.gz`:

```bash
./scripts/backup-postgres.sh
```

Em đặt cron chạy hàng đêm (3h sáng cho đỡ trùng giờ làm việc):

```cron
0 3 * * * /opt/halal/scripts/backup-postgres.sh >> /var/log/halal-backup.log 2>&1
```

Mặc định backup lưu ở `/var/backups/halal/`, giữ 30 ngày. Muốn đẩy lên S3 cho an toàn hơn thì set biến này:

```bash
export BACKUP_S3_BUCKET=s3://your-bucket/halal-backups
```

### 7.4. Restore database

Lỡ tay xoá dữ liệu thì restore từ backup gần nhất:

```bash
gunzip -c /var/backups/halal/halal-<timestamp>.sql.gz | \
  docker compose exec -T postgres pg_restore -U halal -d halal --clean --if-exists
```

### 7.5. Vào shell của container

Khi cần debug sâu hoặc query DB tay:

```bash
docker compose exec backend sh
docker compose exec postgres psql -U halal -d halal
```

---

## 8. Cấu trúc thư mục

Để em khỏi lạc khi mở repo lần đầu:

```
SAIGONCERT-v2/
├── backend-halal/              # Strapi 5 (Node.js 20)
│   ├── src/                  # Code Strapi (content types, controllers...)
│   ├── scripts/
│   │   ├── generate-secrets.sh
│   │   └── seed.js
│   └── Dockerfile
├── web-halal/                  # Next.js 15
│   ├── src/app/              # App Router pages
│   ├── src/config/config.json
│   └── Dockerfile
├── nginx/
│   ├── nginx.conf            # Cấu hình chính (gzip, rate-limit zones)
│   ├── conf.d/halal.conf     # Server blocks (halalsgm.vn, api.halalsgm.vn)
│   ├── conf.d/proxy-params.conf
│   └── certs/                # SSL certs (do init-ssl.sh tạo)
├── scripts/
│   ├── deploy.sh             # Rolling deploy
│   ├── init-ssl.sh           # Lấy SSL lần đầu
│   └── backup-postgres.sh    # Backup DB
├── docker-compose.yml        # Cấu hình production
├── docker-compose.dev.yml    # Override cho dev
├── .env.example              # Mẫu biến môi trường
└── .env                      # Thật (KHÔNG commit)
```

---

## 9. Database — Các bảng dữ liệu

Cái hay của Strapi là em **không phải viết migration tay**. Mỗi khi em sửa file schema trong `backend-halal/src/api/*/content-types/*/schema.json` rồi restart backend, Strapi tự tạo/cập nhật bảng giùm.

Ngoài mấy bảng nghiệp vụ liệt kê dưới đây, Strapi còn tự đẻ ra một loạt bảng hệ thống (`admin_users`, `admin_roles`, `admin_permissions`, `up_users` cho user public, `up_roles`, `files` cho media, `files_folder`...). Em không cần đụng vào, để Strapi lo.

### 9.1. Tổng quan các bảng nghiệp vụ

| Tên bảng (PostgreSQL) | Loại | Draft & Publish | API endpoint | Mục đích |
|---|---|---|---|---|
| `articles` | Collection | Có | `/api/articles` | Bài viết blog |
| `authors` | Collection | Không | `/api/authors` | Tác giả bài viết |
| `categories` | Collection | Không | `/api/categories` | Danh mục bài viết |
| `careers` | Collection | Có | `/api/careers` | Tin tuyển dụng |
| `contacts` | Collection | Có | `/api/contacts` (POST) | Form liên hệ gửi từ web |
| `abouts` | Single | Không | `/api/about` | Trang "Giới thiệu" |
| `globals` | Single | Không | `/api/global` | Cấu hình toàn site (tên, favicon, SEO) |

Anh giải thích nhanh:
- **Single type** = bảng chỉ có 1 dòng duy nhất (kiểu config).
- **Collection type** = bảng nhiều dòng (kiểu danh sách bài viết).
- **Draft & Publish** = có thêm cột `published_at`. Bản ghi nào cột đó `null` thì là draft, API public sẽ giấu đi không trả ra.

### 9.2. Chi tiết từng bảng

#### `articles` — Bài viết blog
| Cột | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | bigint (PK) | ✓ | Auto |
| `title` | string | | Tiêu đề |
| `description` | text (≤300 ký tự) | | Mô tả ngắn |
| `slug` | uid | | Tự sinh từ `title` |
| `cover` | media | | Ảnh bìa (1 file) |
| `author` | relation → `authors` | | manyToOne |
| `category` | relation → `categories` | | manyToOne |
| `blocks` | dynamic zone | | Nội dung động: `media`, `quote`, `rich-text`, `slider` |
| `published_at` | timestamp | | Null = draft |
| `created_at`, `updated_at` | timestamp | | Auto |

#### `authors` — Tác giả
| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | bigint (PK) | |
| `name` | string | Tên tác giả |
| `avatar` | media | Ảnh đại diện |
| `email` | string | |
| `articles` | relation ← `articles` | oneToMany (xem các bài đã viết) |

#### `categories` — Danh mục
| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | bigint (PK) | |
| `name` | string | Tên danh mục |
| `slug` | uid | URL-friendly |
| `description` | text | |
| `cover` | media | Ảnh đại diện danh mục |
| `articles` | relation ← `articles` | oneToMany |

#### `careers` — Tuyển dụng
| Cột | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | bigint (PK) | ✓ | |
| `name` | string | ✓ | Tên vị trí |
| `description` | text | | Mô tả ngắn |
| `workingTime` | enum | | `full-time` / `part-time` / `contract` / `intern` |
| `detailInfo` | richtext | | Mô tả chi tiết (HTML) |
| `careerStatus` | boolean | | `true` = đang tuyển |
| `published_at` | timestamp | | |

#### `contacts` — Form liên hệ
| Cột | Kiểu | Bắt buộc | Mặc định | Ghi chú |
|---|---|---|---|---|
| `id` | bigint (PK) | ✓ | | |
| `name` | string | ✓ | | Họ tên |
| `phoneNumber` | string | ✓ | | SĐT |
| `title` | string | ✓ | | Chủ đề |
| `description` | text | ✓ | | Nội dung |
| `email` | email | ✓ | | |
| `contactStatus` | boolean | | `false` | Admin đánh dấu đã xử lý |

> Public chỉ có quyền **POST** (gửi form), không đọc được. Admin xem qua trang Strapi.

#### `abouts` — Trang "Giới thiệu" (Single Type)
| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | bigint (PK) | Luôn chỉ 1 dòng |
| `title` | string | |
| `blocks` | dynamic zone | Nội dung động (xem 9.3) |

#### `globals` — Cấu hình toàn site (Single Type)
| Cột | Kiểu | Bắt buộc | Ghi chú |
|---|---|---|---|
| `id` | bigint (PK) | | |
| `siteName` | string | ✓ | Tên website |
| `siteDescription` | text | ✓ | Mô tả site |
| `favicon` | media | | |
| `defaultSeo` | component `shared.seo` | | SEO mặc định (xem 9.3) |

### 9.3. Component (bảng phụ)

Mấy component này được lưu ở bảng riêng, kết nối với bản ghi cha qua bảng trung gian `*_components` do Strapi tự tạo — em không phải biết chi tiết bên trong, chỉ cần biết là khi dùng dynamic zone thì dữ liệu chạy về đây.

| Tên bảng | Component | Trường | Dùng ở |
|---|---|---|---|
| `components_shared_media` | `shared.media` | `file` (media) | dynamic zone của `articles`, `abouts` |
| `components_shared_quotes` | `shared.quote` | `title` (string), `body` (text) | dynamic zone |
| `components_shared_rich_texts` | `shared.rich-text` | `body` (richtext) | dynamic zone |
| `components_shared_sliders` | `shared.slider` | `files` (media nhiều file) | dynamic zone |
| `components_shared_seos` | `shared.seo` | `metaTitle`*, `metaDescription`*, `shareImage` (media) | `globals.defaultSeo` |

(* = bắt buộc)

### 9.4. Sơ đồ quan hệ

```
authors ──┐
           │ manyToOne
           ▼
       articles ──┬──▶ dynamic zone: media | quote | rich-text | slider (components_shared_*)
           ▲      │
           │ manyToOne
categories ┘

careers       (độc lập)
contacts      (độc lập, public chỉ POST)

abouts (single) ──▶ dynamic zone: media | quote | rich-text | slider
globals (single) ──▶ defaultSeo (components_shared_seos)
```

### 9.5. Vào DB ngó/sửa thủ công

Khi cần xem dữ liệu thô hoặc fix gấp:

```bash
# Mở psql
docker compose exec postgres psql -U halal -d halal

# Trong psql:
\dt                       # liệt kê tất cả bảng
\d articles               # xem cấu trúc bảng articles
SELECT id, title, published_at FROM articles ORDER BY id DESC LIMIT 10;
SELECT id, name, email, contact_status, created_at FROM contacts ORDER BY created_at DESC;
```

> Để ý cái này dễ nhầm: trong PostgreSQL Strapi dùng tên cột `snake_case` (như `published_at`, `contact_status`), nhưng API JSON lại trả `camelCase` (`publishedAt`, `contactStatus`). Nên khi viết SQL nhớ dùng snake_case.

---

## 10. Bảng tham chiếu nhanh các port

| Service | Port nội bộ (container) | Port lộ ra ngoài (dev) | Port lộ ra ngoài (prod) |
|---|---|---|---|
| Frontend | 3000 | 3001 | (qua Nginx) |
| Backend | 1337 | 1337 | (qua Nginx) |
| PostgreSQL | 5432 | 5433 | (không lộ) |
| Nginx | 80, 443 | (tắt) | 80, 443 |

---

## 11. Bảo mật & rate-limit

Anh đã siết sẵn mấy thứ này ở Nginx, em khỏi cấu hình lại:

| Endpoint | Giới hạn |
|---|---|
| `POST /api/contacts` (form liên hệ) | 5 req/phút, burst 3 |
| `POST /admin/login` (chống brute-force) | 10 req/phút, burst 5 |
| Còn lại | 60 req/phút, burst 120 |

Mấy thứ khác đã bật sẵn:
- TLS 1.2 + 1.3, HSTS 2 năm.
- CSP (Content Security Policy) đặt ở `web-halal/next.config.js`.
- Reverse proxy giấu hoàn toàn backend khỏi Internet — chỉ Nginx mới sờ tới được.
- reCAPTCHA v3 chống bot ở form liên hệ.

Em chạm vào mấy chỗ này thì cẩn thận, đừng nới lỏng vô cớ.
