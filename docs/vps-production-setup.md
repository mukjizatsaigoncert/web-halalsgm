# 🚀 VPS Production Setup Guide

Hướng dẫn triển khai đầy đủ cho stack: **Next.js 15 + Strapi 5 + PostgreSQL + Redis + Nginx (brotli) + Cloudflare**

---

## Yêu cầu tối thiểu

| Thành phần | Tối thiểu | Khuyến nghị |
|---|---|---|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 2 GB | 4 GB |
| Disk | 20 GB SSD | 40 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

---

## Bước 1 – Chuẩn bị server

```bash
# Cập nhật hệ thống
apt update && apt upgrade -y

# Cài Docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER
newgrp docker

# Kiểm tra
docker --version
docker compose version
```

---

## Bước 2 – Cài Fail2ban (chống brute-force SSH)

```bash
# Cài fail2ban
apt install fail2ban -y

# Nếu đã cài rồi, reinstall để restore file gốc (tránh jail.conf bị hỏng)
apt-get install --reinstall fail2ban -y

# Xoá jail.local cũ nếu có
rm -f /etc/fail2ban/jail.local

# Tạo jail.local bằng tee (tương thích hơn heredoc)
tee /etc/fail2ban/jail.local > /dev/null << 'EOF'
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5

[sshd]
enabled = true
backend = systemd
EOF

# Kiểm tra file được tạo đúng
cat /etc/fail2ban/jail.local

# Bật và khởi động
systemctl enable fail2ban
systemctl restart fail2ban
sleep 3

# Kiểm tra status
systemctl status fail2ban --no-pager
fail2ban-client status sshd
```

> **Nếu vẫn lỗi**, kiểm tra log:
> ```bash
> journalctl -u fail2ban -n 20 --no-pager
> # Xem dòng lỗi cụ thể trong file nào
> ```

---

## Bước 3 – Clone repo và cấu hình

```bash
cd /root
git clone <your-repo-url> web-sfc-fe
cd web-sfc-fe

# Tạo file .env từ example
cp .env.example .env
```

### Điền các giá trị vào .env

```bash
# Generate tất cả secrets
cd backend-halal
bash scripts/generate-secrets.sh   # copy output vào .env

# Hoặc generate từng cái
openssl rand -base64 32   # cho mỗi Strapi secret
openssl rand -hex 32      # cho REVALIDATE_SECRET
openssl rand -hex 16      # cho METRICS_TOKEN
```

Mở `.env` và điền đầy đủ:
```bash
nano /root/web-sfc-fe/.env
```

**Các biến bắt buộc phải điền:**
- `POSTGRES_PASSWORD` – mật khẩu DB
- `REDIS_PASSWORD` – mật khẩu Redis
- `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` – Strapi secrets
- `REVALIDATE_SECRET` – webhook cache invalidation
- `BACKEND_PUBLIC_URL`, `NEXT_PUBLIC_STRAPI_URL`, `NEXT_PUBLIC_SITE_URL` – URLs

---

## Bước 4 – SSL với Let's Encrypt

```bash
# Cài certbot
apt install certbot -y

# Cấp cert (thay domain thật)
certbot certonly --standalone \
  -d halalsgm.vn \
  -d www.halalsgm.vn \
  -d api.halalsgm.vn \
  --email admin@halalsgm.vn \
  --agree-tos \
  --non-interactive

# Cert sẽ nằm ở: /etc/letsencrypt/live/
# Tạo symlink để nginx mount
mkdir -p /root/web-sfc-fe/nginx/certs
ln -s /etc/letsencrypt /root/web-sfc-fe/nginx/certs/live
```

### Tự động renew SSL

```bash
# Thêm vào crontab
crontab -e
```
Thêm dòng:
```
0 3 * * * certbot renew --quiet && docker compose -f /root/web-sfc-fe/docker-compose.yml exec nginx nginx -s reload
```

---

## Bước 5 – Deploy lần đầu

```bash
cd /root/web-sfc-fe

# Build và khởi động (production)
docker compose up -d --build

# Xem logs
docker compose logs -f

# Kiểm tra health
curl http://localhost:1337/api/health
curl http://localhost:3000/api/health
```

---

## Bước 6 – Cấu hình Strapi Webhook (cache revalidation)

Sau khi deploy, vào Strapi Admin:

1. Truy cập: `https://api.halalsgm.vn/admin`
2. Vào **Settings → Webhooks → Create new webhook**
3. Điền:
   - **Name**: `Next.js Revalidate`
   - **URL**: `https://halalsgm.vn/api/revalidate`
   - **Headers**: `Authorization: Bearer <REVALIDATE_SECRET>` (giá trị trong .env)
4. Tích chọn **Events**:
   - ✅ Entry: `create`, `update`, `delete`, `publish`, `unpublish`
5. Save → Test webhook → kiểm tra response `{ "revalidated": true }`

> **Tại sao cần?** Khi admin publish bài mới, Strapi gọi webhook → Next.js xoá cache tag `strapi-content` → trang web hiển thị nội dung mới ngay lập tức thay vì đợi 60 giây.

---

## Bước 7 – Backup tự động PostgreSQL

```bash
# Xem script backup
cat /root/web-sfc-fe/scripts/backup-postgres.sh

# Tạo thư mục backup
mkdir -p /var/backups/halal-postgres

# Thêm cronjob backup lúc 2h sáng hàng ngày
crontab -e
```
Thêm dòng:
```
0 2 * * * /root/web-sfc-fe/scripts/backup-postgres.sh >> /var/log/halal-backup.log 2>&1
```

Kiểm tra backup chạy được:
```bash
bash /root/web-sfc-fe/scripts/backup-postgres.sh
ls -la /var/backups/halal-postgres/
```

---

## Bước 8 – Uptime Monitoring (miễn phí)

### UptimeRobot (khuyến nghị)
1. Đăng ký tại https://uptimerobot.com (free, 50 monitors)
2. Thêm HTTP monitors:
   - `https://halalsgm.vn` – keyword: `200`
   - `https://api.halalsgm.vn/api/health` – keyword: `"status":"ok"`
3. Bật alert qua Email / Telegram

### BetterStack (tùy chọn thêm)
- Free tier: 10 monitors, 3 phút interval
- Tích hợp incident management tốt hơn

---

## Bước 9 – Firewall (UFW)

```bash
apt install ufw -y

ufw default deny incoming
ufw default allow outgoing

# SSH (quan trọng – làm trước!)
ufw allow ssh

# HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

ufw enable
ufw status
```

---

## Kiểm tra sau deploy

```bash
cd /root/web-sfc-fe

# Chạy monitor script
bash scripts/monitor.sh

# Kiểm tra từng phần
bash scripts/monitor.sh health    # health endpoints
bash scripts/monitor.sh redis     # Redis stats
bash scripts/monitor.sh resources # CPU/RAM usage
bash scripts/monitor.sh disk      # disk & volumes
```

---

## Cấu trúc file trên VPS

```
/root/web-sfc-fe/          ← source code
/root/web-sfc-fe/.env      ← secrets (chmod 600)
/etc/letsencrypt/          ← SSL certs (Let's Encrypt)
/var/backups/halal-postgres/ ← database backups
/var/log/halal-backup.log    ← backup logs
```

```bash
# Bảo mật file .env
chmod 600 /root/web-sfc-fe/.env
```

---

## Update code (deploy mới)

```bash
cd /root/web-sfc-fe

# Pull code mới
git pull origin main

# Rebuild và restart
docker compose up -d --build

# Xem logs
docker compose logs -f --tail=100
```

Hoặc dùng script có sẵn:
```bash
bash scripts/deploy.sh
```

---

## Xử lý sự cố thường gặp

### Container không start
```bash
docker compose ps                    # xem status
docker compose logs <service-name>  # xem log chi tiết
```

### Redis lỗi password
```bash
docker exec halal-redis-1 redis-cli -a $REDIS_PASSWORD ping
```

### PostgreSQL không connect
```bash
docker exec halal-postgres-1 pg_isready -U halal -d halal
```

### SSL cert hết hạn
```bash
certbot renew --force-renewal
docker compose exec nginx nginx -s reload
```

---

## Scale lên khi cần (500+ CCU)

Khi traffic tăng, các bước scale theo thứ tự:

1. **Tăng RAM Redis**: Sửa `--maxmemory 512mb` trong `docker-compose.yml`
2. **Tăng DB pool**: Thêm `DATABASE_POOL_MAX=20` vào `.env`
3. **Scale backend**: Thêm nhiều replica Strapi + Nginx upstream load balance
4. **Tách database**: Chuyển PostgreSQL ra server riêng / dùng managed DB
5. **CDN uploads**: Chuyển từ local disk sang Cloudflare R2

---

## Tham khảo thêm

- [Cloudflare R2 migration](./cloudflare-setup.md)
- [Nginx config](../nginx/conf.d/halal.conf)
- [Monitor script](../scripts/monitor.sh)
- [Backup script](../scripts/backup-postgres.sh)

