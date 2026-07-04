import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { HALAL_SERVICE_CATEGORIES } from "@/config/halalCategories";

interface AnnouncementPost {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
  };
}

interface HomeCertPortalProps {
  announcements: AnnouncementPost[];
  announcementsSection?: string;
}

// ponytail: quick-links and counter-hours copy stay static placeholder
// content — no page/content model needed for a handful of fixed links.
const VERIFY_CATEGORIES = HALAL_SERVICE_CATEGORIES;

const QUICK_LINKS = [
  { icon: "/images/halal/svc-1.webp", label: "Lĩnh vực hoạt động", href: "/linh-vuc-hoat-dong" },
  { icon: "/images/halal/svc-2.webp", label: "Chứng nhận Halal", href: "/linh-vuc-hoat-dong/chung-nhan-halal" },
  { icon: "/images/halal/svc-3.webp", label: "Tin tức & Văn bản", href: "/tin-tuc" },
  { icon: "/images/halal/svc-4.webp", label: "Câu hỏi thường gặp", href: "/faqs" },
  { icon: "/images/halal/svc-5.webp", label: "Tuyển dụng", href: "/tuyen-dung" },
  { icon: "/images/halal/svc-6.webp", label: "Liên hệ hỗ trợ", href: "/lien-he" },
];

export default function HomeCertPortal({
  announcements,
  announcementsSection = "tin-tuc",
}: HomeCertPortalProps) {
  return (
    <section className="py-20 md:py-28 bg-light border-t border-border">
      <div className="container mx-auto px-4 xl:max-w-[1290px] space-y-14">

        {/* Row 1 — Verify status search + Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Verify status */}
          <div
            className="lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm flex flex-col justify-center"
            data-aos="fade-up-sm"
          >
            <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-secondary">
              Tra cứu chứng nhận
            </p>
            <h3 className="font-bold text-dark text-2xl mb-6">
              Tra cứu trạng thái chứng nhận Halal
            </h3>
            <form action="/tra-cuu-chung-nhan" className="flex flex-col sm:flex-row gap-3">
              <select
                name="category"
                className="rounded-lg border border-border px-4 py-3 text-sm text-text bg-white sm:w-64 focus:outline-none focus:ring-2 focus:ring-secondary/40"
                defaultValue=""
              >
                <option value="">Tất cả lĩnh vực</option>
                {VERIFY_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="q"
                required
                placeholder="Nhập tên doanh nghiệp hoặc số chứng nhận..."
                className="flex-1 rounded-lg border border-border px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/40"
              />
              <button
                type="submit"
                className="bg-secondary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Tra cứu
              </button>
            </form>
          </div>

          {/* Announcements */}
          <div
            className="lg:col-span-5 bg-white rounded-2xl p-8 shadow-sm"
            data-aos="fade-up-sm"
            data-aos-delay={150}
          >
            <h3 className="font-bold text-dark text-2xl mb-5">Thông báo</h3>
            <ul className="divide-y divide-border">
              {announcements.slice(0, 3).map((post) => {
                let dateStr = "";
                try {
                  dateStr = format(new Date(post.frontmatter.date), "dd/MM/yyyy", { locale: vi });
                } catch {
                  dateStr = post.frontmatter.date ?? "";
                }
                return (
                  <li key={post.slug} className="py-3 first:pt-0 last:pb-0">
                    <Link
                      href={`/${announcementsSection}/${post.slug}`}
                      className="flex items-center justify-between gap-4 group"
                    >
                      <span>
                        <span className="block text-sm font-medium text-dark group-hover:text-secondary transition-colors">
                          {post.frontmatter.title}
                        </span>
                        <span className="block text-xs text-text/50 mt-1">{dateStr}</span>
                      </span>
                      <span className="text-secondary flex-shrink-0">→</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5">
              <Link
                href={`/${announcementsSection}`}
                className="text-secondary text-sm font-semibold hover:underline"
              >
                Xem thêm →
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2 — Counter hours + Complaint/feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div
            className="lg:col-span-5 bg-white rounded-2xl p-8 shadow-sm"
            data-aos="fade-up-sm"
          >
            <h3 className="font-bold text-dark text-xl mb-4">Giờ làm việc</h3>
            <p className="text-text/70 text-sm">Thứ 2 - Thứ 6: 8:00 - 17:00</p>
            <p className="text-text/70 text-sm">Thứ 7 - Chủ nhật: Nghỉ</p>
          </div>
          <div
            className="lg:col-span-7 bg-white rounded-2xl p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            data-aos="fade-up-sm"
            data-aos-delay={150}
          >
            <div>
              <h3 className="font-bold text-dark text-xl mb-2">Phản hồi - Khiếu nại</h3>
              <p className="text-text/70 text-sm">
                Gửi phản hồi hoặc khiếu nại về dịch vụ chứng nhận của chúng tôi.
              </p>
            </div>
            <Link
              href="/lien-he"
              className="inline-block bg-dark text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Gửi phản hồi
            </Link>
          </div>
        </div>

        {/* Row 3 — Apply for certification CTA */}
        <div
          className="rounded-2xl bg-secondary px-8 py-12 md:px-14 text-center"
          data-aos="fade-up-sm"
        >
          <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">
            Hệ thống chứng nhận Halal
          </p>
          <h3 className="font-bold text-white text-2xl md:text-3xl mb-8">
            Nộp hồ sơ đăng ký chứng nhận Halal
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/nop-ho-so-chung-nhan?loai=trong-nuoc"
              className="inline-flex items-center gap-2 bg-white text-secondary font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Doanh nghiệp trong nước →
            </Link>
            <Link
              href="/nop-ho-so-chung-nhan?loai=quoc-te"
              className="inline-flex items-center gap-2 bg-gold text-dark font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Doanh nghiệp quốc tế →
            </Link>
          </div>
        </div>

        {/* Row 4 — Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {QUICK_LINKS.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex flex-col items-center text-center gap-3 group"
              data-aos="fade-up-sm"
              data-aos-delay={i * 80}
            >
              <span className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center text-secondary bg-white shadow-sm">
                <span className="absolute inset-0 bg-current opacity-10" />
                <ImageFallback
                  src={link.icon}
                  width={28}
                  height={28}
                  alt={link.label}
                  className="relative z-10 max-w-[28px] max-h-[28px] w-auto h-auto object-contain"
                />
              </span>
              <span className="text-sm font-medium text-dark group-hover:text-secondary transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
