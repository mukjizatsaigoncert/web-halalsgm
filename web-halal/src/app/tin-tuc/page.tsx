import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import {
  fetchArticles,
  transformStrapiArticle,
} from "@/lib/strapi/api/articles";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { Faqs } from "@/types";

// Revalidate route mỗi 60 giây
export const revalidate = 60;

const TinTucPage = async () => {
  const faqsData = getListPage<Faqs["frontmatter"]>("faqs/_index.md");

  // Fetch dữ liệu từ Strapi
  const strapiData = await fetchArticles(1, config.settings.pagination);
  const articles = strapiData.data.map(transformStrapiArticle);
  const totalPages = strapiData.meta.pagination.pageCount;

  // Metadata cho trang
  const pageMetadata = {
    title: "Tin Tức",
    meta_title: "Tin Tức - Kiến Trúc & Nội Thất",
    description:
      "Cập nhật tin tức mới nhất về kiến trúc, thiết kế nội thất và xu hướng xây dựng.",
    image: "/images/og-image.png",
  };

  return (
    <>
      <SeoMeta {...pageMetadata} />
      <PageHeader title={pageMetadata.title} />
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
                  currentPage={1}
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
    </>
  );
};

export default TinTucPage;
