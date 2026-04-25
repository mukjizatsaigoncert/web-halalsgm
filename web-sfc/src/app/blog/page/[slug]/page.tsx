import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import config from "@/config/config.json";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import { sortByDate } from "@/lib/utils/sortFunctions";
import CallToAction from "@/partials/CallToAction";
import FAQs from "@/partials/FAQs";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { BlogPost, Faqs } from "@/types";
import { notFound } from "next/navigation";

const BLOG_FOLDER = "blog";

export async function generateStaticParams() {
  const posts = getSinglePage<BlogPost["frontmatter"]>(BLOG_FOLDER);
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  const paths = [];

  for (let i = 1; i < totalPages; i++) {
    paths.push({
      params: {
        slug: (i + 1).toString(),
      },
    });
  }
  return paths;
}

const BlogPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const faqsData = getListPage<Faqs["frontmatter"]>("faqs/_index.md");
  const postIndex = getListPage<BlogPost["frontmatter"]>(
    `${BLOG_FOLDER}/_index.md`
  );
  const posts = getSinglePage<BlogPost["frontmatter"]>(BLOG_FOLDER);
  const sortedPosts = sortByDate(posts);
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  const currentPage = slug && !isNaN(Number(slug)) ? Number(slug) : 1;
  const indexOfLastPost = currentPage * config.settings.pagination;
  const indexOfFirstPost = indexOfLastPost - config.settings.pagination;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  if (!postIndex) return notFound();

  return (
    <>
      <SeoMeta {...postIndex.frontmatter} />
      <PageHeader title={postIndex.frontmatter.title} />
      <section className="section">
        <div className="container">
          <div className="row">
            {currentPosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
            <Pagination
              section={BLOG_FOLDER}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </section>

      <CallToAction isNoSectionTop />
      <FAQs isNoSectionTop faqsData={faqsData} />
    </>
  );
};

export default BlogPage;
