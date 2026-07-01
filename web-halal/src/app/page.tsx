import { fetchArticles, transformStrapiArticle } from "@/lib/strapi/api/articles";
import SeoMeta from "@/partials/SeoMeta";
import HeroSlider from "@/partials/HeroSlider";
import HomeAbout1 from "@/partials/HomeAbout1";
import HomePolicy from "@/partials/HomePolicy";
import HomeAbout2 from "@/partials/HomeAbout2";
import HomeMarquee from "@/partials/HomeMarquee";
import HomeReview from "@/partials/HomeReview";
import HomeServices from "@/partials/HomeServices";
import HomePartner from "@/partials/HomePartner";
import HomeContactBanner from "@/partials/HomeContactBanner";
import HomeTeam from "@/partials/HomeTeam";
import HomeBlog from "@/partials/HomeBlog";

export const revalidate = 60;

// ─── Static data (thay ảnh + nội dung theo thực tế) ──────────────────────────

const HERO_SLIDES = [
  {
    image: "/images/halal/slide-1.jpg",
    tag: "Uy tín - Chính xác - Trách nhiệm",
    heading: "Công ty Cổ phần Chứng nhận và Giám định SaigonCert",
    subheading:
      "Chứng nhận Halal, ISO 9001, ISO 14001, hợp quy phân bón và thức ăn chăn nuôi, giám định hàng hóa - đồng hành cùng doanh nghiệp Việt vươn ra thị trường quốc tế.",
  },
  {
    image: "/images/halal/slide-2.jpg",
    tag: "Chứng nhận Halal",
    heading: "Mở cửa thị trường Halal Trung Đông",
    subheading:
      "Tư vấn và cấp chứng nhận Halal cho nông sản, thực phẩm Việt theo tiêu chuẩn GAC, JAKIM, World Halal Council.",
  },
  {
    image: "/images/halal/slide-3.jpg",
    tag: "Đối tác tin cậy",
    heading: "Đồng hành cùng doanh nghiệp của bạn",
    subheading: "Nhiều năm kinh nghiệm trong lĩnh vực chứng nhận và giám định chất lượng.",
  },
];

const HERO_STATS = [
  { end: 15, suffix: "+", label: "Năm kinh nghiệm" },
  { end: 500, suffix: "+", label: "Doanh nghiệp đã chứng nhận" },
  { end: 100, suffix: "+", label: "Khách hàng tin tưởng" },
  { end: 4, suffix: "+", label: "Tổ chức công nhận quốc tế" },
];

const POLICY_ITEMS = [
  {
    image: "/images/halal/svc-1.webp",
    title: "Chứng nhận Halal",
    description: "Tư vấn và cấp chứng nhận Halal cho sản phẩm, nhà máy theo tiêu chuẩn quốc tế.",
  },
  {
    image: "/images/halal/svc-7.webp",
    title: "Chứng nhận ISO",
    description: "Chứng nhận hệ thống quản lý ISO 9001:2015 và ISO 14001:2015.",
  },
  {
    image: "/images/halal/svc-4.webp",
    title: "Giám định hàng hóa",
    description: "Giám định nhà nước hàng hóa xuất nhập khẩu, đảm bảo chất lượng đúng quy chuẩn.",
  },
];

const PROJECTS = [
  {
    image: "/images/halal/news-4.jpg",
    title: "Nghị định 127/2026/NĐ-CP",
    description: "Hành lang pháp lý toàn diện đầu tiên cho quản lý chất lượng, phát triển sản phẩm và dịch vụ Halal tại Việt Nam",
    href: "/projects",
  },
  {
    image: "/images/halal/news-5.jpg",
    title: "Hợp tác Việt Nam - Qatar - UAE",
    description: "Thúc đẩy tiềm năng chinh phục thị trường Halal Trung Đông của nông sản, thực phẩm Việt",
    href: "/projects",
  },
  {
    image: "/images/halal/news-6.jpg",
    title: "Kết nối cộng đồng Halal quốc tế",
    description: "Tham dự sự kiện giao lưu văn hóa, thúc đẩy hợp tác thương mại Halal với các đối tác Trung Đông",
    href: "/projects",
  },
];

const REVIEWS = [
  {
    projectTitle: "Chứng nhận Halal cho lô hàng xuất khẩu",
    description:
      "Đội ngũ chuyên nghiệp, tận tâm. Chúng tôi rất hài lòng với quy trình đánh giá và cấp chứng nhận Halal của SaigonCert. Hồ sơ được hướng dẫn rõ ràng, đúng tiến độ.",
    personImage: "/images/custom/tru-so-chinh.jpg",
    personName: "Nguyễn Văn An",
    personRole: "Giám đốc Chất lượng, doanh nghiệp thực phẩm xuất khẩu",
    satisfactionPercent: 100,
    satisfactionLabel: "Hài lòng",
    satisfactionDesc:
      "Chất lượng dịch vụ vượt mong đợi, đội ngũ đánh giá khách quan và chuyên nghiệp.",
  },
  {
    projectTitle: "Chứng nhận hợp quy thức ăn chăn nuôi",
    description:
      "SaigonCert đã hỗ trợ chúng tôi hoàn tất chứng nhận hợp quy nhanh chóng, giúp sản phẩm sớm được lưu hành trên thị trường đúng quy định.",
    personImage: "/images/custom/anh1.jpg",
    personName: "Trần Thị Bình",
    personRole: "Tổng Giám đốc, công ty sản xuất thức ăn chăn nuôi",
    satisfactionPercent: 98,
    satisfactionLabel: "Hài lòng",
    satisfactionDesc:
      "Kết quả chứng nhận đúng hẹn, hợp tác lâu dài rất đáng tin cậy.",
  },
];

const SERVICE_TABS = [
  { label: "Chứng nhận Halal", image: "/images/custom/anh1.jpg" },
  { label: "Chứng nhận ISO 9001 & 14001", image: "/images/custom/anh2.jpg" },
  { label: "Hợp quy phân bón & thức ăn chăn nuôi", image: "/images/custom/anh3.jpg" },
  { label: "Giám định hàng hóa xuất nhập khẩu", image: "/images/custom/tru-so-chinh.jpg" },
  { label: "Khử trùng - Kiểm soát côn trùng", image: "/images/custom/anh1.jpg" },
];

const PARTNERS = [
  { name: "Ladophar", logo: "/images/halal/logo-1.jpg" },
  { name: "Traphacosapa", logo: "/images/halal/logo-2.jpg" },
  { name: "Nano France Pharmacy", logo: "/images/halal/logo-3.jpg" },
  { name: "Thabico Group", logo: "/images/halal/logo-4.jpg" },
  { name: "Vinpearl Resort & Golf Nam Hoi An", logo: "/images/halal/logo-5.jpg" },
  { name: "Marriott Resort Nha Trang", logo: "/images/halal/logo-6.jpg" },
];

const TEAM_MEMBERS = [
  { name: "Nguyễn Văn Long", role: "Giám đốc điều hành", image: "/images/custom/anh1.jpg" },
  { name: "Trần Thị Hoa", role: "Trưởng phòng Chứng nhận Halal", image: "/images/custom/anh2.jpg" },
  { name: "Lê Minh Tuấn", role: "Trưởng phòng Chứng nhận ISO", image: "/images/custom/anh3.jpg" },
  { name: "Phạm Quỳnh Anh", role: "Trưởng phòng Giám định", image: "/images/custom/tru-so-chinh.jpg" },
];

const STATIC_BLOG_POSTS = [
  {
    slug: "nghi-dinh-127-2026-halal",
    frontmatter: {
      title: "Nghị định 127/2026/NĐ-CP: Hành lang pháp lý cho ngành Halal Việt Nam",
      image: "/images/halal/news-1.jpg",
      date: "2025-10-15",
      author: "SaigonCert",
    },
  },
  {
    slug: "quy-trinh-chung-nhan-halal",
    frontmatter: {
      title: "Quy trình chứng nhận Halal: Những điều doanh nghiệp cần biết",
      image: "/images/halal/news-2.jpg",
      date: "2025-10-15",
      author: "SaigonCert",
    },
  },
  {
    slug: "thi-truong-halal-trung-dong",
    frontmatter: {
      title: "Cơ hội chinh phục thị trường Halal Trung Đông cho nông sản Việt",
      image: "/images/halal/news-3.jpg",
      date: "2025-10-15",
      author: "SaigonCert",
    },
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const articlesData = await fetchArticles(1, 3);
  const articles = articlesData.data.map(transformStrapiArticle);

  return (
    <>
      <SeoMeta
        title="Trang Chủ"
        meta_title="SaigonCert - Chứng nhận và Giám định"
        description="Chứng nhận Halal, ISO 9001, ISO 14001, hợp quy phân bón, thức ăn chăn nuôi và giám định hàng hóa uy tín tại Việt Nam."
      />

      {/* 1. Hero Slider */}
      <HeroSlider
        slides={HERO_SLIDES}
        stats={HERO_STATS}
        ctaLabel="Liên hệ ngay"
        ctaLink="/lien-he"
        cta2Label="Dự án của chúng tôi"
        cta2Link="/projects"
      />

      {/* 2. About 1 — 2 ảnh + heading */}
      <HomeAbout1
        tag="Xây dựng nền tảng chất lượng vững chắc"
        heading="Chứng nhận và giám định bằng chuyên môn của chúng tôi"
        description="SaigonCert hiểu rằng mỗi chứng nhận là một cam kết về chất lượng và uy tín của doanh nghiệp. Với đội ngũ chuyên gia đánh giá giàu kinh nghiệm, chúng tôi mang đến dịch vụ chứng nhận Halal, ISO, hợp quy và giám định hàng hóa chính xác, khách quan."
        image1="/images/halal/about-2.jpeg"
        image2="/images/halal/news-6.jpg"
      />

      {/* 3. Policy — 3 feature cards */}
      <HomePolicy items={POLICY_ITEMS} />

      {/* 3. About 2 — dark bg + projects */}
      <HomeAbout2
        heading="Đồng hành cùng doanh nghiệp Việt vươn ra thị trường"
        headingHighlight="Halal quốc tế"
        description="SaigonCert cung cấp dịch vụ chứng nhận và giám định uy tín, giúp doanh nghiệp đáp ứng các tiêu chuẩn chất lượng khắt khe và mở rộng thị trường xuất khẩu."
        ctaLabel="Liên hệ tư vấn"
        ctaLink="/lien-he"
        projects={PROJECTS}
      />

      {/* 4. Marquee */}
      <HomeMarquee text="Uy tín — Chính xác — Trách nhiệm — Chất lượng." />

      {/* 5. Reviews */}
      <HomeReview
        tag="Khách hàng nói về chúng tôi"
        heading={"Đồng hành cùng chất lượng\nvà uy tín"}
        items={REVIEWS}
      />

      {/* 6. Services tab */}
      <HomeServices
        tag="Chúng tôi cung cấp"
        heading="Dịch vụ chứng nhận và giám định chất lượng cao cho doanh nghiệp"
        tabs={SERVICE_TABS}
      />

      {/* 7. Partners */}
      <HomePartner partners={PARTNERS} />

      {/* 8. Contact Banner */}
      <HomeContactBanner
        heading="Sẵn sàng chứng nhận sản phẩm của bạn?"
        ctaLabel="Liên hệ ngay"
        ctaLink="/lien-he"
        bgImage="/images/halal/about-2.jpeg"
      />

      {/* 9. Team */}
      <HomeTeam
        tag="Đội ngũ của chúng tôi"
        heading="Về chúng tôi"
        description="Đội ngũ chuyên gia giàu kinh nghiệm trong chứng nhận Halal, ISO và giám định chất lượng."
        members={TEAM_MEMBERS}
      />

      {/* 10. Blog — Tin tức & Bài viết */}
      <HomeBlog
          tag="Tin tức & Bài viết"
          heading={"Cập nhật tin tức\nngành chứng nhận"}
          posts={articles.length > 0 ? articles : STATIC_BLOG_POSTS}
          section="tin-tuc"
          viewAllLabel="Xem thêm"
          viewAllLink="/tin-tuc"
      />

    </>
  );
}
