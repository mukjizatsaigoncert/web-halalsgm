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

const BLOG_FOLDER = "blog";

const BlogIndexPage = () => {
  const faqsData = getListPage<Faqs["frontmatter"]>("faqs/_index.md");
  const posts = getSinglePage<BlogPost["frontmatter"]>(BLOG_FOLDER);
  const postIndex = getListPage<BlogPost["frontmatter"]>(
    `${BLOG_FOLDER}/_index.md`
  );
  const sortedPosts = sortByDate(posts);
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  const currentPosts = sortedPosts.slice(0, config.settings.pagination);

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
              currentPage={1}
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

export default BlogIndexPage;
