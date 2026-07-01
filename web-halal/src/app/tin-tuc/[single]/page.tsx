import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import ImageFallback from "@/helpers/ImageFallback";
import ImageSlider from "@/components/ImageSlider";
import SocialShare from "@/components/SocialShare";
import {
  fetchAllArticleSlugs,
  fetchArticleBySlug,
  fetchRelatedArticles,
  STRAPI_URL,
  transformStrapiArticle,
} from "@/lib/strapi/api/articles";
import {
  StrapiBlock,
  StrapiBlockComponent,
  StrapiBlockMedia,
  StrapiBlockQuote,
  StrapiBlockRichText,
  StrapiBlockSlider,
} from "@/lib/strapi/model/block.model";
import { markdownify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { notFound } from "next/navigation";

// Revalidate route mỗi 60 giây
export const revalidate = 60;

// Render nội dung từ blocks của Strapi V5
function renderBlocks(blocks?: StrapiBlock[]) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return blocks.map((block, index) => {
    switch (block.__component) {
      case StrapiBlockComponent.RichText: {
        const richTextBlock = block as StrapiBlockRichText;
        // Dùng markdownify với div=true để parse block elements (headings, lists, etc.)
        return (
          <div
            key={index}
            className="prose prose-lg max-w-none mb-8"
            dangerouslySetInnerHTML={
              markdownify(richTextBlock.body || "", true) as { __html: string }
            }
          />
        );
      }

      case StrapiBlockComponent.Media: {
        const mediaBlock = block as StrapiBlockMedia;
        if (mediaBlock.file?.url) {
          const mediaUrl = mediaBlock.file.url.startsWith("http")
            ? mediaBlock.file.url
            : `${STRAPI_URL}${mediaBlock.file.url}`;

          return (
            <div key={index} className="mb-8">
              <ImageFallback
                src={mediaUrl}
                alt=""
                width={1200}
                height={800}
                className="w-full object-cover rounded-lg"
              />
            </div>
          );
        }
        console.warn(
          `⚠️  [renderBlocks] ${StrapiBlockComponent.Media} block ${block.id} không có file data`
        );
        return null;
      }

      case StrapiBlockComponent.Quote: {
        const quoteBlock = block as StrapiBlockQuote;
        return (
          <blockquote
            key={index}
            className="border-l-4 border-primary pl-6 my-8 italic text-lg"
          >
            <p>{quoteBlock.body}</p>
            {quoteBlock.title && (
              <footer className="text-sm mt-2 text-body-color">
                — {quoteBlock.title}
              </footer>
            )}
          </blockquote>
        );
      }

      case StrapiBlockComponent.Slider: {
        const sliderBlock = block as StrapiBlockSlider;
        if (sliderBlock.files && sliderBlock.files.length > 0) {
          // Transform files to ImageSlider format
          const images = sliderBlock.files.map((file) => ({
            url: file.url.startsWith("http")
              ? file.url
              : `${STRAPI_URL}${file.url}`,
            alt: "",
          }));

          return (
            <div key={index} className="mb-8">
              <ImageSlider
                images={images}
                slidesPerView={1}
                autoplay={images.length > 1}
              />
            </div>
          );
        }
        console.warn(
          `⚠️  [renderBlocks] ${StrapiBlockComponent.Slider} block ${block.id} không có files data`
        );
        return null;
      }

      default:
        console.warn(
          `⚠️  [renderBlocks] Unknown component: ${block.__component}`
        );
        return null;
    }
  });
}

export async function generateStaticParams() {
  const slugs = await fetchAllArticleSlugs();

  return slugs.map((slug) => ({
    single: slug,
  }));
}

const TinTucDetailPage = async (props: {
  params: Promise<{ single: string }>;
}) => {
  const { single } = await props.params;

  // Fetch bài viết hiện tại
  const article = await fetchArticleBySlug(single);

  if (!article) {
    return notFound();
  }

  const post = transformStrapiArticle(article);

  // Fetch bài viết liên quan - Strapi V5: category không còn có data wrapper
  const categoryId = article.category?.id;
  const relatedArticlesData = await fetchRelatedArticles(single, categoryId);
  const relatedPosts = relatedArticlesData.data.map(transformStrapiArticle);

  return (
    <>
      <SeoMeta
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        image={post.frontmatter.image}
      />
      <section>
        <div className="bg-primary row justify-center text-center">
          <div
            data-aos="zoom-in-sm"
            data-aos-delay="200"
            className="col-10 xl:col-7 pt-65 pb-40 text-white"
          >
            {post.frontmatter.date && (
              <span>
                Đăng ngày{" "}
                {format(new Date(post.frontmatter.date), "dd MMMM, yyyy", {
                  locale: vi,
                })}
              </span>
            )}
            <h1 className="text-center pt-3.5 text-white">
              {post.frontmatter.title}
            </h1>
          </div>
        </div>
        <div className="container section-sm pb-0">
          <div className="row justify-center">
            <article className="col-11 mx-auto lg:col-10">
              {post.frontmatter.image && (
                <div className="pb-10">
                  <ImageFallback
                    src={post.frontmatter.image}
                    height={800}
                    width={1200}
                    alt={post.frontmatter.title}
                    className="w-full object-cover aspect-video"
                  />
                </div>
              )}
              <div className="content mb-10">
                {article.blocks && article.blocks.length > 0 ? (
                  renderBlocks(article.blocks)
                ) : (
                  <div className="prose prose-lg max-w-none">
                    <p>{post.frontmatter.description}</p>
                  </div>
                )}
              </div>

              {/* Social Share */}
              <div className="border-t border-border pt-8 pb-8">
                <SocialShare
                  url={`${process.env.NEXT_PUBLIC_SITE_URL || "https://dienanhtruyenhinh.vn"}/tin-tuc/${single}`}
                  title={post.frontmatter.title}
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="section pb-0">
          <div className="container">
            <div className="row justify-between">
              <div className="lg:col-3 max-lg:text-center">
                <p
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  className="font-medium text-primary uppercase"
                >
                  TIN TỨC
                </p>
                <h2
                  data-aos="fade-up-sm"
                  data-aos-delay="200"
                  className="my-3 font-medium text-primary"
                >
                  Bài Viết Liên Quan
                </h2>
                <div data-aos="fade-up-sm" data-aos-delay="300">
                  <Button enable label="Xem Tất Cả" link="/tin-tuc" />
                </div>
              </div>
              <div className="lg:col-8 max-lg:mt-14">
                <div className="row">
                  {relatedPosts.map((relatedPost, i) => (
                    <BlogCard
                      key={relatedPost.slug}
                      post={relatedPost}
                      index={i}
                      className="md:col-6"
                      section="tin-tuc"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default TinTucDetailPage;
