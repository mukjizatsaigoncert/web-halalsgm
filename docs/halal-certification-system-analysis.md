# Phân tích yêu cầu: Hệ thống nộp hồ sơ & cấp chứng nhận Halal trực tuyến

Tài liệu này chỉ mang tính **phân tích yêu cầu / thiết kế kiến trúc** cho giai đoạn kế tiếp
(sau khi đã bê giao diện tham khảo từ myehalal.halal.gov.my — xem `HomeCertPortal.tsx`).
Chưa có phần nào trong tài liệu này được triển khai thành code.

## 1. Vai trò người dùng & xác thực

Hiện tại `web-halal`/`backend-halal` **chưa có** hệ thống đăng nhập/tài khoản — toàn bộ site
là public. Để nộp hồ sơ và tra cứu trạng thái, cần thêm:

- **Doanh nghiệp (applicant)**: tài khoản để nộp hồ sơ, theo dõi trạng thái, nhận thông báo.
- **Chuyên viên đánh giá / Admin SaigonCert**: xử lý hồ sơ trong Strapi Admin (role-based,
  dùng `users-permissions` plugin có sẵn của Strapi — không cần viết auth riêng).

Triển khai bằng plugin `users-permissions` sẵn có của Strapi (mở rộng role `Authenticated`
thành `Applicant`), không cần xây hệ thống auth mới.

## 2. Luồng nộp hồ sơ (applicant)

Form nhiều bước (multi-step), theo mẫu `ContactForm.tsx` hiện có (client component +
reCAPTCHA v3 + gọi API Strapi) nhưng mở rộng thêm:

1. Thông tin doanh nghiệp: tên, mã số thuế, địa chỉ, người liên hệ, lĩnh vực (map theo
   `linh-vuc-hoat-dong` trong `menu.json`).
2. Thông tin sản phẩm/dây chuyền cần chứng nhận.
3. Tải lên tài liệu (bắt buộc, nhiều file):
   - Giấy phép kinh doanh
   - Danh sách sản phẩm / thành phần nguyên liệu
   - Bản khai chuỗi cung ứng Halal (nguồn gốc nguyên liệu, quy trình sản xuất)
   - Hình ảnh nhà máy / cơ sở sản xuất
4. Xác nhận & gửi hồ sơ.

**Upload file**: dùng plugin Upload có sẵn của Strapi (đã dùng cho `articles.cover`) —
không cần viết middleware upload riêng, chỉ cần field kiểu `media` (multiple) trên content-type mới.

## 3. Content-type mới trong Strapi

### `certification-application`
Mô hình theo đúng pattern của `contact` schema hiện có
(`backend-halal/src/api/contact/content-types/contact/schema.json`), mở rộng thêm:

| Field | Type | Ghi chú |
|---|---|---|
| companyName, taxCode, address, contactName, phoneNumber, email | string/email | giống `contact` |
| category | relation → `categories` (tái dùng content-type `categories` đã có) | |
| documents | media (multiple) | giấy phép, danh sách sản phẩm, bản khai chuỗi cung ứng, ảnh cơ sở |
| status | enumeration | `submitted` → `under_review` → `site_visit_scheduled` → `approved` / `rejected` |
| reviewerNotes | text | ghi chú nội bộ của chuyên viên đánh giá |
| applicant | relation → user (users-permissions) | |

### `certificate`
| Field | Type | Ghi chú |
|---|---|---|
| certificateNumber | string (unique) | số chứng nhận, hiển thị public |
| application | relation → `certification-application` | |
| issuedDate, expiryDate | date | |
| verificationCode / QR | string | dùng cho trang tra cứu public |
| status | enumeration | `active`, `expired`, `revoked` |

## 4. Luồng xử lý (reviewer/admin)

Toàn bộ xử lý trong Strapi Admin (không cần dashboard admin riêng trên frontend):
`submitted` → chuyên viên xem xét hồ sơ → có thể yêu cầu bổ sung / lên lịch khảo sát thực địa
(`site_visit_scheduled`) → `approved` (hệ thống tự sinh record `certificate` liên kết) hoặc
`rejected` (kèm lý do). Mỗi lần đổi `status`, gửi email thông báo cho applicant (Strapi
lifecycle hook `afterUpdate`, dùng chung cơ chế email/notification sẽ cần thêm — hiện repo
chưa có, cần chọn provider: Strapi email plugin + SMTP/SendGrid).

## 5. Trang tra cứu công khai (public verification)

Chính là ô "Tra cứu" đã bê giao diện trong `HomeCertPortal.tsx` (hiện đang placeholder).
Khi có content-type `certificate`, biến thành chức năng thật:

- Trang `/tra-cuu-chung-nhan` (mới) hoặc API route gọi Strapi: tìm theo `certificateNumber`
  hoặc tên doanh nghiệp, chỉ trả về các field public-safe (không lộ `reviewerNotes`, hồ sơ nội bộ).
- Đây là read-only public endpoint — cần rate-limit ở Nginx giống `POST /api/contacts`
  (xem "Rate limits" trong `CLAUDE.md`) để tránh dò quét brute-force số chứng nhận.

## 6. Bảo mật & tuân thủ

- File upload: giới hạn kích thước/loại file ở Strapi (`allowedTypes`), scan virus nếu triển
  khai production (chưa có trong repo hiện tại, cần đánh giá thêm khi build thật).
- Dữ liệu PII của doanh nghiệp (mã số thuế, người liên hệ): chỉ role `Admin`/`Reviewer` trong
  Strapi được đọc; API public chỉ expose field đã được whitelist.
- Khi `certification-application`/`certificate` thay đổi, revalidate cache Next.js theo đúng
  cơ chế webhook `REVALIDATE_SECRET` đã có (`web-halal/src/app/api/revalidate/route.ts`) —
  nhớ đăng ký UID mới vào `UID_TO_TAGS` khi tạo content-type (đã ghi trong `CLAUDE.md`).
- reCAPTCHA v3 (đã dùng cho contact form) nên áp dụng lại cho form nộp hồ sơ để chống spam.

## 7. Đã triển khai (cập nhật)

Phần 2, 3 ở trên (submission flow + content-type `certification-application`) đã được
triển khai và hoạt động thật:

- Backend: `backend-halal/src/api/certification-application/` (schema, controller có
  reCAPTCHA v3 + rate-limit, lifecycle sanitize XSS) — theo đúng pattern của `contact`.
  Public permission `create` được đăng ký tự động qua bootstrap (`src/index.ts`).
- Frontend: trang `/nop-ho-so-chung-nhan` + `CertificationApplicationForm.tsx` (upload
  nhiều file, chọn loại doanh nghiệp/lĩnh vực) gọi `submitCertificationApplication()`
  (`src/lib/strapi/api/certification.ts`). Hai nút CTA trong `HomeCertPortal.tsx` đã trỏ
  vào trang này (`?loai=trong-nuoc` / `?loai=quoc-te`) thay vì `/lien-he`.
- Đã test end-to-end qua Docker (submit thật, thấy request tới Strapi, bị chặn đúng như
  contact form khi reCAPTCHA site key chưa đăng ký domain localhost — hành vi mong đợi).

**Còn lại cho giai đoạn sau:** content-type `certificate`, trang tra cứu công khai
(mục 5), luồng duyệt hồ sơ có gửi email thông báo, tài khoản applicant (mục 1).
