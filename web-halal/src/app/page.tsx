import { fetchArticles, fetchHeroSliders, transformStrapiArticle } from "@/lib/strapi/api/articles";
import SeoMeta from "@/partials/SeoMeta";
import HeroSlider from "@/partials/HeroSlider";
import HomeCertPortal from "@/partials/HomeCertPortal";
import HomeBlog from "@/partials/HomeBlog";

export const revalidate = 60;

export default async function Home() {
  const [articlesData, heroSliders] = await Promise.all([
    fetchArticles(1, 3),
    fetchHeroSliders(),
  ]);
  const articles = articlesData.data.map(transformStrapiArticle);

  const heroSlides = heroSliders.length > 0
    ? heroSliders.map((slide) => ({
        tag: slide.tag,
        heading: slide.heading,
        subheading: slide.subheading,
        image: slide.image?.url ?? null,
      }))
    : null;

  return (
    <>
      <SeoMeta
        title="Trang Chủ"
        meta_title="SaigonCert - Chứng nhận và Giám định"
        description="Chứng nhận Halal, ISO 9001, ISO 14001, hợp quy phân bón, thức ăn chăn nuôi và giám định hàng hóa uy tín tại Việt Nam."
      />

      {/* 1. Hero slider — banner ảnh full-width, giống khối slider đầu trang tham chiếu */}
      <HeroSlider slides={heroSlides} />

      {/* 2. Cert Portal — tra cứu, thông báo, nộp hồ sơ, liên kết nhanh */}
      <HomeCertPortal
        announcements={articles}
        announcementsSection="tin-tuc"
      />

      {/* 3. News — Tin tức & Bài viết */}
      <HomeBlog
        tag="Tin tức & Bài viết"
        heading={"Cập nhật tin tức\nngành chứng nhận"}
        posts={articles}
        section="tin-tuc"
        viewAllLabel="Xem thêm"
        viewAllLink="/tin-tuc"
      />
    </>
  );
}
