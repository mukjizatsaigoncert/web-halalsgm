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
    tag: "Chuyên nghiệp - Sáng tạo - Trách nhiệm",
    heading: "Trung Tâm Điện Ảnh và Truyền Hình Sài Gòn",
    subheading:
      "Chúng tôi cung cấp đa dạng các giải pháp online – offline marketing uy tín dựa trên ngân sách phù hợp cho từng dự án.",
  },
  {
    image: "/images/halal/slide-2.jpg",
    tag: "Chuyên nghiệp & Sáng tạo",
    heading: "Giải pháp truyền thông toàn diện",
    subheading:
      "Từ sản xuất video, tổ chức sự kiện đến quản lý thương hiệu.",
  },
  {
    image: "/images/halal/slide-3.jpg",
    tag: "Đối tác tin cậy",
    heading: "Đồng hành cùng doanh nghiệp của bạn",
    subheading: "Hơn 15 năm kinh nghiệm trong ngành truyền thông và sự kiện.",
  },
];

const HERO_STATS = [
  { end: 15, suffix: "+", label: "Năm kinh nghiệm" },
  { end: 500, suffix: "+", label: "Dự án thành công" },
  { end: 100, suffix: "+", label: "Khách hàng tin tưởng" },
  { end: 50, suffix: "+", label: "Giải thưởng quốc tế" },
];

const POLICY_ITEMS = [
  {
    image: "/images/halal/svc-1.webp",
    title: "Tổ chức sự kiện",
    description: "Chúng tôi tổ chức các sự kiện chuyên nghiệp, hội nghị, hội thảo quy mô lớn.",
  },
  {
    image: "/images/halal/svc-7.webp",
    title: "Sản xuất video",
    description: "Sản xuất TVC, phim quảng cáo và nội dung số chất lượng cao.",
  },
  {
    image: "/images/halal/svc-4.webp",
    title: "Tiêu chuẩn chất lượng",
    description: "Cam kết đảm bảo chất lượng, đúng tiến độ và vượt kỳ vọng khách hàng.",
  },
];

const PROJECTS = [
  {
    image: "/images/halal/news-4.jpg",
    title: "Sự kiện kỷ niệm thành lập",
    description: "Tổ chức lễ kỷ niệm 20 năm thành lập doanh nghiệp",
    href: "/projects",
  },
  {
    image: "/images/halal/news-5.jpg",
    title: "TVC quảng cáo thương hiệu",
    description: "Sản xuất phim quảng cáo phát sóng toàn quốc",
    href: "/projects",
  },
  {
    image: "/images/halal/news-6.jpg",
    title: "Hội nghị khách hàng quốc tế",
    description: "Tổ chức hội nghị 500 đại biểu trong và ngoài nước",
    href: "/projects",
  },
];

const REVIEWS = [
  {
    projectTitle: "Dự án tổ chức sự kiện thường niên",
    description:
      "Đội ngũ chuyên nghiệp, tận tâm. Chúng tôi rất hài lòng với chất lượng dịch vụ tổ chức sự kiện và sản xuất nội dung của công ty. Mọi chi tiết đều được chăm chút tỉ mỉ.",
    personImage: "/images/custom/tru-so-chinh.jpg",
    personName: "Nguyễn Văn An",
    personRole: "Giám đốc Marketing",
    satisfactionPercent: 100,
    satisfactionLabel: "Hài lòng",
    satisfactionDesc:
      "Chất lượng dịch vụ vượt mong đợi, đội ngũ sáng tạo và chuyên nghiệp.",
  },
  {
    projectTitle: "Chiến dịch truyền thông sản phẩm mới",
    description:
      "Công ty đã giúp chúng tôi triển khai chiến dịch ra mắt sản phẩm rất thành công. Doanh số tăng 35% so với cùng kỳ năm ngoái nhờ chiến lược truyền thông bài bản.",
    personImage: "/images/custom/anh1.jpg",
    personName: "Trần Thị Bình",
    personRole: "CEO",
    satisfactionPercent: 98,
    satisfactionLabel: "Hài lòng",
    satisfactionDesc:
      "Kết quả chiến dịch vượt KPI đề ra, hợp tác lâu dài rất đáng tin cậy.",
  },
];

const SERVICE_TABS = [
  { label: "Tổ chức sự kiện & hội nghị", image: "/images/custom/anh1.jpg" },
  { label: "Sản xuất video & TVC quảng cáo", image: "/images/custom/anh2.jpg" },
  { label: "Thiết kế nhận diện thương hiệu", image: "/images/custom/anh3.jpg" },
  { label: "Quản lý mạng xã hội & digital", image: "/images/custom/tru-so-chinh.jpg" },
  { label: "Truyền thông & PR doanh nghiệp", image: "/images/custom/anh1.jpg" },
];

const PARTNERS = [
  { name: "Partner 1", logo: "/images/halal/logo-1.jpg" },
  { name: "Partner 2", logo: "/images/halal/logo-2.jpg" },
  { name: "Partner 3", logo: "/images/halal/logo-3.jpg" },
  { name: "Partner 4", logo: "/images/halal/logo-4.jpg" },
  { name: "Partner 5", logo: "/images/halal/logo-5.jpg" },
  { name: "Partner 6", logo: "/images/halal/logo-6.jpg" },
];

const TEAM_MEMBERS = [
  { name: "Nguyễn Văn Long", role: "Giám đốc điều hành", image: "/images/custom/anh1.jpg" },
  { name: "Trần Thị Hoa", role: "Giám đốc sáng tạo", image: "/images/custom/anh2.jpg" },
  { name: "Lê Minh Tuấn", role: "Trưởng phòng sự kiện", image: "/images/custom/anh3.jpg" },
  { name: "Phạm Quỳnh Anh", role: "Quản lý dự án", image: "/images/custom/tru-so-chinh.jpg" },
];

const STATIC_BLOG_POSTS = [
  {
    slug: "xu-huong-san-xuat-noi-dung-video-2025",
    frontmatter: {
      title: "Xu hướng sản xuất nội dung video năm 2025",
      image: "/images/halal/news-1.jpg",
      date: "2025-10-15",
      author: "SFC Productions",
    },
  },
  {
    slug: "to-chuc-su-kien-doanh-nghiep",
    frontmatter: {
      title: "Tổ chức sự kiện doanh nghiệp: Bí quyết thành công",
      image: "/images/halal/news-2.jpg",
      date: "2025-10-15",
      author: "SFC Productions",
    },
  },
  {
    slug: "thiet-ke-nhan-dien-thuong-hieu",
    frontmatter: {
      title: "Thiết kế nhận diện thương hiệu hiệu quả trong thời đại số",
      image: "/images/halal/news-3.jpg",
      date: "2025-10-15",
      author: "SFC Productions",
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
        meta_title="Trung Tâm Điện Ảnh và Truyền Hình Sài Gòn"
        description="Chúng tôi cung cấp đa dạng các giải pháp online – offline marketing uy tín dựa trên ngân sách phù hợp."
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
        tag="Xây dựng một nền tảng vững chắc"
        heading="Định hình chất lượng bằng chuyên môn của chúng tôi"
        description="Chúng tôi hiểu rằng mỗi dự án của khách hàng là một ước mơ. Với đội ngũ lãnh đạo giàu kinh nghiệm và nhân sự đa năng, chúng tôi cam kết mang đến những sản phẩm truyền thông chất lượng, sáng tạo và hiệu quả."
        image1="/images/halal/about-2.jpeg"
        image2="/images/halal/news-6.jpg"
      />

      {/* 3. Policy — 3 feature cards */}
      <HomePolicy items={POLICY_ITEMS} />

      {/* 3. About 2 — dark bg + projects */}
      <HomeAbout2
        heading="Xây dựng một tương lai tốt đẹp hơn thông qua"
        headingHighlight="sự chính trực và đổi mới"
        description="Công ty truyền thông hàng đầu cung cấp các giải pháp bền vững, chất lượng cao. Chúng tôi xây dựng những chiến dịch sáng tạo, góp phần nâng cao giá trị thương hiệu và phát triển kinh doanh."
        ctaLabel="Liên hệ tư vấn"
        ctaLink="/lien-he"
        projects={PROJECTS}
      />

      {/* 4. Marquee */}
      <HomeMarquee text="Chuyên nghiệp — Sáng tạo — Trách nhiệm — Chất lượng." />

      {/* 5. Reviews */}
      <HomeReview
        tag="Khách hàng nói về chúng tôi"
        heading={"Xây dựng và kiến tạo\ntương lai bền vững"}
        items={REVIEWS}
      />

      {/* 6. Services tab */}
      <HomeServices
        tag="Chúng tôi cung cấp"
        heading="Dịch vụ truyền thông chất lượng cao để đáp ứng nhu cầu dự án của bạn"
        tabs={SERVICE_TABS}
      />

      {/* 7. Partners */}
      <HomePartner partners={PARTNERS} />

      {/* 8. Contact Banner */}
      <HomeContactBanner
        heading="Khởi đầu cho chiến lược truyền thông chất lượng cao"
        ctaLabel="Liên hệ ngay"
        ctaLink="/lien-he"
        bgImage="/images/halal/about-2.jpeg"
      />

      {/* 9. Team */}
      <HomeTeam
        tag="Đội ngũ của chúng tôi"
        heading="Về chúng tôi"
        description="Đội ngũ với bề dày kinh nghiệm về truyền thông, sản xuất nội dung và tổ chức sự kiện chuyên nghiệp."
        members={TEAM_MEMBERS}
      />

      {/* 10. Blog — Tin tức & Bài viết */}
      <HomeBlog
          tag="Tin tức & Bài viết"
          heading={"Chúng tôi xây dựng và thiết kế\ntương lai"}
          posts={articles.length > 0 ? articles : STATIC_BLOG_POSTS}
          section="tin-tuc"
          viewAllLabel="Xem thêm"
          viewAllLink="/tin-tuc"
      />

    </>
  );
}
