import { fetchArticles, transformStrapiArticle } from "@/lib/strapi/api/articles";
import SeoMeta from "@/partials/SeoMeta";
import HomeCertPortal from "@/partials/HomeCertPortal";
import HomeBlog from "@/partials/HomeBlog";

export const revalidate = 60;

// ─── Static data (thay nội dung theo thực tế) ──────────────────────────

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

      {/* 1. Cert Portal — tra cứu, thông báo, nộp hồ sơ, liên kết nhanh */}
      <HomeCertPortal
        announcements={articles.length > 0 ? articles : STATIC_BLOG_POSTS}
        announcementsSection="tin-tuc"
      />

      {/* 2. News — Tin tức & Bài viết */}
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
