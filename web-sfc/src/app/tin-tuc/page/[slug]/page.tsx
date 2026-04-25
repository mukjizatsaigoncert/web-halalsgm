import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import {
  fetchArticles,
  fetchTotalPages,
  transformStrapiArticle,
} from "@/lib/strapi/api/articles";
import CallToAction from "@/partials/CallToAction";
import FAQs from "@/partials/FAQs";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { Faqs } from "@/types";
import { notFound } from "next/navigation";

// Revalidate route mỗi 60 giây
export const revalidate = 60;

export async function generateStaticParams() {
  const totalPages = await fetchTotalPages();
  const paths = [];

  for (let i = 2; i <= totalPages; i++) {
    paths.push({
      slug: i.toString(),
    });
  }

  return paths;
}

const TinTucPaginationPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const faqsData = getListPage<Faqs["frontmatter"]>("faqs/_index.md");

  const currentPage = slug && !isNaN(Number(slug)) ? Number(slug) : 1;

  // Fetch dữ liệu từ Strapi
  const strapiData = await fetchArticles(
    currentPage,
    config.settings.pagination
  );
  const articles = strapiData.data.map(transformStrapiArticle);
  const totalPages = strapiData.meta.pagination.pageCount;

  if (currentPage > totalPages || currentPage < 1) {
    return notFound();
  }

  const pageMetadata = {
    title: `Tin Tức - Trang ${currentPage}`,
    meta_title: `Tin Tức - Trang ${currentPage} | Kiến Trúc & Nội Thất`,
    description:
      "Cập nhật tin tức mới nhất về kiến trúc, thiết kế nội thất và xu hướng xây dựng.",
    image: "/images/og-image.png",
  };

  return (
    <>
      <SeoMeta {...pageMetadata} />
      <PageHeader title="Tin Tức" />
      <section className="section">
        <div className="container">
          <div className="row">
            {articles.length > 0 ? (
              <>
                {articles.map((post, i) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    index={i}
                    section="tin-tuc"
                  />
                ))}
                <Pagination
                  section="tin-tuc"
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </>
            ) : (
              <div className="col-12 text-center py-12">
                <p className="text-lg text-body-color">
                  Chưa có bài viết nào. Vui lòng quay lại sau.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <CallToAction isNoSectionTop />
      <FAQs isNoSectionTop faqsData={faqsData} />
    </>
  );
};

export default TinTucPaginationPage;
