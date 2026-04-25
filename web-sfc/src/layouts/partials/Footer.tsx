import config from "@/config/config.json";
import social from "@/config/social.json";
import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";

export default function Footer() {
  // Thông tin liên hệ (giống lien-he page)
  const contactInfo = {
    hotline: ["0918 545 332", "0968 972 331", "0793 827 777"],
    email: "knknpb9999@gmail.com",
    address: "Số 139 Man Thiện, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh",
  };

  // Quick Links
  const quickLinks = [
    { name: "Trang chủ", url: "/" },
    { name: "Giới thiệu", url: "/gioi-thieu" },
    { name: "Tin tức", url: "/tin-tuc" },
    { name: "Tuyển dụng", url: "/tuyen-dung" },
    { name: "Liên hệ", url: "/lien-he" },
  ];

  // Lĩnh vực hoạt động
  const services = [
    { name: "Tổ chức sự kiện", url: "/linh-vuc-hoat-dong/to-chuc-su-kien" },
    { name: "Sản xuất video", url: "/linh-vuc-hoat-dong/san-xuat-video" },
    {
      name: "Thiết kế thương hiệu",
      url: "/linh-vuc-hoat-dong/thiet-ke-thuong-hieu",
    },
    {
      name: "Quản lý kênh truyền thông",
      url: "/linh-vuc-hoat-dong/quan-ly-kenh-truyen-thong",
    },
  ];

  return (
    <footer className="bg-primary pt-16 pb-8">
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-white/20">
          {/* Column 1: Logo & Description */}
          <div className="lg:col-span-1">
            <ImageFallback
              src={config.site.logo_footer}
              width={200}
              height={50}
              alt="Logo"
              className="mb-4"
              loading="lazy"
            />
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Trung tâm Điện ảnh và Truyền hình Sài Gòn - Đơn vị hàng đầu trong
              lĩnh vực sản xuất nội dung truyền thông, tổ chức sự kiện và
              marketing online.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {social.main.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-secondary flex items-center justify-center text-white transition-colors"
                  aria-label={item.name}
                >
                  <span className="text-sm">{item.name.charAt(0)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">
              Liên Kết Nhanh
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.url}
                    className="text-white/70 hover:text-secondary transition-colors flex items-center gap-2"
                  >
                    <span className="text-secondary">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Lĩnh vực hoạt động */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">
              Lĩnh Vực Hoạt Động
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    href={service.url}
                    className="text-white/70 hover:text-secondary transition-colors flex items-center gap-2"
                  >
                    <span className="text-secondary">→</span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6">
              Thông Tin Liên Hệ
            </h4>
            <ul className="space-y-4">
              {/* Hotline */}
              <li>
                <p className="text-white/50 text-sm mb-1">📞 Hotline</p>
                <div className="space-y-1">
                  {contactInfo.hotline.map((phone, index) => (
                    <Link
                      key={index}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="block text-white hover:text-secondary transition-colors font-medium"
                    >
                      {phone}
                    </Link>
                  ))}
                </div>
              </li>

              {/* Email */}
              <li>
                <p className="text-white/50 text-sm mb-1">✉️ Email</p>
                <Link
                  href={`mailto:${contactInfo.email}`}
                  className="text-white hover:text-secondary transition-colors font-medium break-all"
                >
                  {contactInfo.email}
                </Link>
              </li>

              {/* Address */}
              <li>
                <p className="text-white/50 text-sm mb-1">📍 Địa chỉ</p>
                <Link
                  href={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.address)}`}
                  target="_blank"
                  className="text-white/80 hover:text-secondary transition-colors text-sm leading-relaxed"
                >
                  {contactInfo.address}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Trung tâm Điện ảnh và Truyền hình Sài
            Gòn. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
