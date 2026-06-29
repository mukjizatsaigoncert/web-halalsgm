import BlogCard from "@/components/BlogCard";
import ImageFallback from "@/helpers/ImageFallback";
import {
  fetchArticles,
  transformStrapiArticle,
  buildStrapiImageUrl,
} from "@/lib/strapi/api/articles";
import { fetchAllCategories } from "@/lib/strapi/api/categories";
import CallToAction from "@/partials/CallToAction";
import SeoMeta from "@/partials/SeoMeta";
import HeroSlider from "@/partials/HeroSlider";
import Link from "next/link";
import AnimatedNumber from "@/layouts/partials/AnimatedNumber";

// Revalidate mỗi 60 giây
export const revalidate = 60;

export default async function Home() {
  // Fetch tin tức từ Strapi
  const articlesData = await fetchArticles(1, 6);
  const articles = articlesData.data.map(transformStrapiArticle);

  // Fetch categories từ Strapi
  const categories = await fetchAllCategories();

  // Thông tin công ty
  const companyInfo = {
    name: "Trung Tâm Điện Ảnh và Truyền Hình Sài Gòn",
    slogan: "Chuyên nghiệp - Sáng tạo - Trách nhiệm",
    description:
      "Chúng tôi cung cấp đa dạng các giải pháp online – offline marketing uy tín dựa trên ngân sách phù hợp cho từng dự án quy mô lớn nhỏ khác nhau.",
  };

  // Lĩnh vực hoạt động (fallback nếu không có từ API)
  const defaultServices = [
    {
      name: "Tổ chức sự kiện",
      slug: "to-chuc-su-kien",
      description: "Tổ chức sự kiện chuyên nghiệp, hội nghị, hội thảo",
      image: "/images/custom/anh1.jpg",
    },
    {
      name: "Sản xuất video",
      slug: "san-xuat-video",
      description: "Sản xuất TVC, phim quảng cáo, video marketing",
      image: "/images/custom/anh2.jpg",
    },
    {
      name: "Thiết kế thương hiệu",
      slug: "thiet-ke-thuong-hieu",
      description: "Thiết kế logo, nhận diện thương hiệu, bộ nhận diện",
      image: "/images/custom/anh3.jpg",
    },
    {
      name: "Quản lý kênh truyền thông",
      slug: "quan-ly-kenh-truyen-thong",
      description: "Quản lý fanpage, social media, digital marketing",
      image: "/images/custom/tru-so-chinh.jpg",
    },
  ];

  // Đối tác chiến lược - mapping với ảnh từ thư mục partner
  const partners = [
    { name: "SOKA", logo: "/images/partner/logo_soka.png" },
    { name: "Nhân Hòa", logo: "/images/partner/nhanhoa.png" },
    { name: "Saigon Cert", logo: "/images/partner/logo-saigoncert.jpg" },
    { name: "VOVTV", logo: "/images/partner/vovtv.jpg" },
    { name: "Web4S", logo: "/images/partner/logo-web4s-1.png" },
    { name: "Đất Nước", logo: "/images/partner/dat-nuoc.jpg" },
    { name: "Trung Tâm", logo: "/images/partner/logo-trung-tam.jpg" },
  ];

  // Khách hàng - mapping với ảnh từ thư mục client
  const clients = [
    { name: "Vingroup", logo: "/images/client/company-logo-vingroup.png" },
    { name: "Vinhomes", logo: "/images/client/logo-vinhomes.jpg" },
    {
      name: "VinFast",
      logo: "/images/client/logo-vinfast-inkythuatso-21-11-08-55.jpg",
    },
    {
      name: "VinPearl",
      logo: "/images/client/vinpearl-logo-inkythuatso-1-13-10-21-19.jpg",
    },
    { name: "VinUni", logo: "/images/client/trường_đại_học_vinuni_logo.png" },
    { name: "Viettel", logo: "/images/client/viettel.jpg" },
    { name: "Mobifone", logo: "/images/client/logo-mobifone-png.png" },
    { name: "SOKA", logo: "/images/client/logo_soka.png" },
    { name: "Vichi", logo: "/images/client/logo_vichi.png" },
    { name: "Web4S", logo: "/images/client/logo-web4s-1.png" },
    { name: "Nhân Hòa", logo: "/images/client/nhanhoa.png" },
  ];

  // Các cơ sở
  const offices = [
    {
      name: "Trụ sở chính",
      address: "Số 139 Man Thiện, P. Hiệp Phú, TP. Thủ Đức, TP. HCM",
      image: "/images/custom/tru-so-chinh.jpg",
    },
    {
      name: "VPGD phía Nam",
      address: "61A-63A Võ Văn Tần, Q.3, TP. HCM",
      image: "/images/custom/anh1.jpg",
    },
    {
      name: "VPGD phía Bắc",
      address: "Số 6 ngõ 95 Chùa Bộc, Q. Đống Đa, Hà Nội",
      image: "/images/custom/anh2.jpg",
    },
    {
      name: "VPGD Cần Thơ",
      address: "05 Tổ 1- KV1, P. Hưng Phú, Q. Cái Răng, Cần Thơ",
      image: "/images/custom/anh3.jpg",
    },
  ];

  return (
    <>
      <SeoMeta
        title="Trang Chủ"
        meta_title="Trung Tâm Điện Ảnh và Truyền Hình Sài Gòn"
        description={companyInfo.description}
      />

      {/* Hero Slider */}
      <HeroSlider
        slides={[
          {
            image: "/images/custom/anh1.jpg",
            tag: companyInfo.slogan,
            heading: companyInfo.name,
            subheading: companyInfo.description,
          },
          {
            image: "/images/custom/anh2.jpg",
            tag: "Chuyên nghiệp & Sáng tạo",
            heading: "Giải pháp truyền thông toàn diện",
            subheading: "Từ sản xuất video, tổ chức sự kiện đến quản lý thương hiệu.",
          },
          {
            image: "/images/custom/anh3.jpg",
            tag: "Đối tác tin cậy",
            heading: "Đồng hành cùng doanh nghiệp của bạn",
            subheading: "Hơn 15 năm kinh nghiệm trong ngành truyền thông và sự kiện.",
          },
        ]}
        stats={[
          { end: 15, suffix: "+", label: "Năm kinh nghiệm" },
          { end: 500, suffix: "+", label: "Dự án thành công" },
          { end: 100, suffix: "+", label: "Khách hàng tin tưởng" },
        ]}
        ctaLabel="Liên hệ ngay"
        ctaLink="/lien-he"
      />

      {/* Giới thiệu */}
      <section className="py-20 md:py-28 bg-linear-to-b from-white to-slate-50">
        <div className="container">
          <div className="row items-center gap-y-12">
            {/* Images Column */}
            <div className="col-12 lg:col-6">
              <div className="relative" data-aos="fade-right">
                {/* Main Image */}
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                  <ImageFallback
                    src="/images/custom/tru-so-chinh.jpg"
                    width={600}
                    height={450}
                    alt="Trụ sở chính"
                    className="w-full aspect-4/3 object-cover"
                  />
                </div>

                {/* Floating Card */}
                <div className="absolute -bottom-6 -right-6 lg:bottom-8 lg:-right-8 z-20 bg-white rounded-2xl shadow-xl p-6 max-w-[200px]">
                  <AnimatedNumber
                    value="15+"
                    className="text-5xl font-bold text-primary mb-1"
                  />
                  <div className="text-body-color text-sm">
                    Năm kinh nghiệm trong ngành
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -top-4 -left-4 w-full h-full bg-secondary/20 rounded-3xl -z-10" />
                <div className="absolute top-8 left-8 w-20 h-20 bg-primary/10 rounded-full -z-10" />
              </div>
            </div>

            {/* Content Column */}
            <div className="col-12 lg:col-6 lg:pl-12">
              <div
                data-aos="fade-up-sm"
                className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-2 mb-6"
              >
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                  Về chúng tôi
                </span>
              </div>

              <h2
                data-aos="fade-up-sm"
                data-aos-delay="100"
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-6 leading-tight"
              >
                Đơn Vị Hàng Đầu Trong Lĩnh Vực{" "}
                <span className="text-primary">Truyền Thông</span>
              </h2>

              <p
                data-aos="fade-up-sm"
                data-aos-delay="150"
                className="text-lg text-body-color mb-8 leading-relaxed"
              >
                Với đội ngũ lãnh đạo giàu kinh nghiệm và nhân sự đa năng, chúng
                tôi cung cấp các dịch vụ tiếp thị trọn gói bao gồm: Tổ chức sự
                kiện, chiến dịch kích hoạt thương hiệu, sản xuất nội dung số và
                các dịch vụ quảng cáo khác.
              </p>

              {/* Features Grid */}
              <div
                data-aos="fade-up-sm"
                data-aos-delay="200"
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { icon: "🎯", text: "Đội ngũ chuyên gia" },
                  { icon: "💡", text: "Giải pháp sáng tạo" },
                  { icon: "🏆", text: "Cam kết chất lượng" },
                  { icon: "🤝", text: "Hỗ trợ 24/7" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium text-dark">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lĩnh vực hoạt động */}
      <section className="py-20 md:py-28 bg-light">
        <div className="container">
          <div className="text-center mb-12">
            <p
              data-aos="fade-up-sm"
              className="text-primary font-semibold mb-2 uppercase tracking-wider"
            >
              Dịch vụ của chúng tôi
            </p>
            <h2 data-aos="fade-up-sm" data-aos-delay="100" className="h2">
              Lĩnh Vực Hoạt Động
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(categories.length > 0
              ? categories.map((cat) => {
                  // Lấy ảnh từ cover, nếu không có thì dùng ảnh mặc định
                  let imageUrl = "/images/custom/anh1.jpg";
                  if (cat.cover?.url) {
                    imageUrl = buildStrapiImageUrl(cat.cover.url);
                  }
                  return {
                    name: cat.name,
                    slug: cat.slug,
                    description: cat.description || "",
                    image: imageUrl,
                  };
                })
              : defaultServices
            ).map((service, index) => (
              <Link
                key={service.slug}
                href={`/linh-vuc-hoat-dong/${service.slug}`}
                data-aos="fade-up-sm"
                data-aos-delay={index * 50 + 150}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageFallback
                    src={service.image}
                    width={400}
                    height={300}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 right-4 text-white font-bold text-lg">
                    {service.name}
                  </h3>
                </div>
                <div className="p-4">
                  <p className="text-body-color text-sm line-clamp-2">
                    {service.description || "Xem chi tiết dịch vụ"}
                  </p>
                  <span className="inline-flex items-center gap-1 text-primary font-medium text-sm mt-3 group-hover:gap-2 transition-all">
                    Xem thêm →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tin tức */}
      <section className="section">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
            <div>
              <p
                data-aos="fade-up-sm"
                className="text-primary font-semibold mb-2 uppercase tracking-wider"
              >
                Tin tức & Sự kiện
              </p>
              <h2 data-aos="fade-up-sm" data-aos-delay="100" className="h2">
                Bài Viết Mới Nhất
              </h2>
            </div>
            <Link
              href="/tin-tuc"
              data-aos="fade-up-sm"
              data-aos-delay="150"
              className="btn btn-outline-primary"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="row">
            {articles.length > 0 ? (
              articles
                .slice(0, 3)
                .map((post, i) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    index={i}
                    section="tin-tuc"
                    className="md:col-6 lg:col-4"
                  />
                ))
            ) : (
              <div className="col-12 text-center py-12">
                <p className="text-body-color">Chưa có bài viết nào.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Đối tác chiến lược */}
      <section className="section bg-light">
        <div className="container">
          <div className="text-center mb-12">
            <p
              data-aos="fade-up-sm"
              className="text-primary font-semibold mb-2 uppercase tracking-wider"
            >
              Hợp tác cùng phát triển
            </p>
            <h2 data-aos="fade-up-sm" data-aos-delay="100" className="h2">
              Đối Tác Chiến Lược
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
            {partners.map((partner, index) => (
              <div
                key={partner.name}
                data-aos="fade-up-sm"
                data-aos-delay={index * 50 + 150}
                className="bg-white border border-border rounded-xl p-6 flex items-center justify-center hover:border-primary hover:shadow-lg transition-all group"
              >
                <ImageFallback
                  src={partner.logo}
                  width={150}
                  height={80}
                  alt={partner.name}
                  className="max-w-full max-h-16 object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Khách hàng */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <p
              data-aos="fade-up-sm"
              className="text-primary font-semibold mb-2 uppercase tracking-wider"
            >
              Tin tưởng & Đồng hành
            </p>
            <h2 data-aos="fade-up-sm" data-aos-delay="100" className="h2">
              Khách Hàng Của Chúng Tôi
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {clients.map((client, index) => (
              <div
                key={client.name}
                data-aos="fade-up-sm"
                data-aos-delay={index * 30 + 150}
                className="bg-white border border-border rounded-xl p-6 flex items-center justify-center hover:border-primary hover:shadow-lg transition-all cursor-default group"
              >
                <ImageFallback
                  src={client.logo}
                  width={150}
                  height={80}
                  alt={client.name}
                  className="max-w-full max-h-16 object-contain group-hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Các cơ sở */}
      <section className="section bg-light">
        <div className="container">
          <div className="text-center mb-12">
            <p
              data-aos="fade-up-sm"
              className="text-primary font-semibold mb-2 uppercase tracking-wider"
            >
              Hệ thống văn phòng
            </p>
            <h2 data-aos="fade-up-sm" data-aos-delay="100" className="h2">
              Các Cơ Sở Của Chúng Tôi
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, index) => (
              <div
                key={office.name}
                data-aos="fade-up-sm"
                data-aos-delay={index * 50 + 150}
                className="bg-white rounded-2xl overflow-hidden shadow-lg group"
              >
                <div className="relative h-40 overflow-hidden">
                  <ImageFallback
                    src={office.image}
                    width={400}
                    height={200}
                    alt={office.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-primary mb-2">{office.name}</h4>
                  <p className="text-body-color text-sm">{office.address}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/lien-he"
              data-aos="fade-up-sm"
              className="btn btn-primary"
            >
              Liên hệ với chúng tôi
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
