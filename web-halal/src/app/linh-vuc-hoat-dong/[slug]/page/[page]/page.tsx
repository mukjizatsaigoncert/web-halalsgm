import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import config from "@/config/config.json";
import { transformStrapiArticle } from "@/lib/strapi/api/articles";
import {
  fetchArticlesByCategorySlug,
  fetchCategoryBySlug,
  fetchAllCategorySlugs,
} from "@/lib/strapi/api/categories";
import CallToAction from "@/partials/CallToAction";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { notFound } from "next/navigation";

// Revalidate route mỗi 60 giây
export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
    page: string;
  }>;
}

const LinhVucHoatDongPaginatedPage = async ({ params }: PageProps) => {
  const { slug, page } = await params;
  const currentPage = parseInt(page, 10);

  // Validate page number
  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  // Fetch category info
  const category = await fetchCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Fetch articles theo category với pagination
  const strapiData = await fetchArticlesByCategorySlug(
    slug,
    currentPage,
    config.settings.pagination
  );
  const articles = strapiData.data.map(transformStrapiArticle);
  const totalPages = strapiData.meta.pagination.pageCount;

  // Nếu page vượt quá số trang
  if (currentPage > totalPages && totalPages > 0) {
    notFound();
  }

  // Metadata cho trang
  const pageMetadata = {
    title: `${category.name} - Trang ${currentPage}`,
    meta_title: `${category.name} - Trang ${currentPage} | Lĩnh Vực Hoạt Động`,
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
          {/* Page indicator */}
          <div className="row justify-center mb-8">
            <div className="col-12 text-center">
              <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                Trang {currentPage} / {totalPages}
              </span>
            </div>
          </div>

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
                <Pagination
                  section={`linh-vuc-hoat-dong/${slug}`}
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </>
            ) : (
              <div className="col-12 text-center py-12">
                <div className="bg-light rounded-2xl p-8">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="h4 mb-2">Không có bài viết</h3>
                  <p className="text-body-color">
                    Không tìm thấy bài viết nào ở trang này.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <CallToAction isNoSectionTop />
    </>
  );
};

export default LinhVucHoatDongPaginatedPage;

// Generate static params
export async function generateStaticParams() {
  const categorySlugs = await fetchAllCategorySlugs();

  // Tạo params cho mỗi category với các trang
  const params: { slug: string; page: string }[] = [];

  for (const slug of categorySlugs) {
    const data = await fetchArticlesByCategorySlug(slug, 1, 1);
    const totalPages = data.meta.pagination.pageCount;

    // Bắt đầu từ trang 2 (trang 1 đã có ở [slug]/page.tsx)
    for (let page = 2; page <= totalPages; page++) {
      params.push({ slug, page: page.toString() });
    }
  }

  return params;
}
