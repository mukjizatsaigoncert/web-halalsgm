import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import config from "@/config/config.json";
import { transformStrapiArticle } from "@/lib/strapi/api/articles";
import {
  fetchArticlesByCategorySlug,
  fetchCategoryBySlug,
  fetchAllCategorySlugs,
} from "@/lib/strapi/api/categories";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { notFound } from "next/navigation";

// Revalidate route mỗi 60 giây
export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const LinhVucHoatDongPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  // Fetch category info
  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Fetch articles theo category
  const strapiData = await fetchArticlesByCategorySlug(
    slug,
    1,
    config.settings.pagination
  );
  const articles = strapiData.data.map(transformStrapiArticle);
  const totalPages = strapiData.meta.pagination.pageCount;

  // Metadata cho trang
  const pageMetadata = {
    title: category.name,
    meta_title: `${category.name} - Lĩnh Vực Hoạt Động`,
    description:
      category.description ||
      `Các bài viết về ${category.name} - Lĩnh vực hoạt động của chúng tôi.`,
    image: "/images/og-image.png",
  };

  return (
    <>
      <SeoMeta {...pageMetadata} />
      <PageHeader title={category.name} />

      <section className="section">
        <div className="container">
          {/* Category Description */}
          {category.description && (
            <div className="row justify-center mb-12">
              <div className="col-12 lg:col-10">
                <div className="bg-light rounded-2xl p-6 text-center">
                  <p className="text-lg text-body-color">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
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
                {totalPages > 1 && (
                  <Pagination
                    section={`linh-vuc-hoat-dong/${slug}`}
                    currentPage={1}
                    totalPages={totalPages}
                  />
                )}
              </>
            ) : (
              <div className="col-12 text-center py-12">
                <div className="bg-light rounded-2xl p-8">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="h4 mb-2">Chưa có bài viết</h3>
                  <p className="text-body-color">
                    Lĩnh vực này chưa có bài viết nào. Vui lòng quay lại sau.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default LinhVucHoatDongPage;

// Generate static params cho tất cả categories
export async function generateStaticParams() {
  const slugs = await fetchAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}
