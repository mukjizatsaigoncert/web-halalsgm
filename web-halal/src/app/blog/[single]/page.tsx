import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import similarItems from "@/lib/utils/similarItems";
import { markdownify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";
import type { BlogPost } from "@/types";
import { format } from "date-fns";
import { notFound } from "next/navigation";

const blog_folder = "blog";

// remove dynamicParams
export const dynamicParams = false;

// generate static params
export const generateStaticParams: () => { single: string }[] = () => {
  const posts = getSinglePage<BlogPost["frontmatter"]>(blog_folder);

  const paths = posts.map((post) => ({
    single: post.slug!,
  }));

  return paths;
};

const BlogPostPage = async (props: { params: Promise<{ single: string }> }) => {
  const posts = getSinglePage<BlogPost["frontmatter"]>("blog");
  const post = posts.find(async (p) => p.slug === (await props.params).single);

  if (!post) return notFound();

  const similarPosts = similarItems(post, posts);

  return (
    <>
      <SeoMeta {...post.frontmatter} />
      <section>
        <div className="bg-primary row justify-center text-center">
          <div
            data-aos="zoom-in-sm"
            data-aos-delay="200"
            className="col-10 xl:col-7 pt-[16.25rem] pb-[10rem] text-white"
          >
            {post.frontmatter.date && (
              <span>
                Posted on{" "}
                {format(new Date(post.frontmatter.date), "MMMM dd, yyyy")}
              </span>
            )}
            <h1
              className="text-center pt-3.5 text-white"
              dangerouslySetInnerHTML={markdownify(post.frontmatter.title)}
            />
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
                    className="w-full object-cover aspect-[16/9]"
                  />
                </div>
              )}
              <div className="content mb-10">
                <MDXContent content={post.content} />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section pb-0">
        <div className="container">
          <div className="row justify-between">
            <div className="lg:col-3 max-lg:text-center">
              <p
                data-aos="fade-up-sm"
                data-aos-delay="150"
                className="font-medium text-primary uppercase"
                dangerouslySetInnerHTML={markdownify("BLOG")}
              />
              <h2
                data-aos="fade-up-sm"
                data-aos-delay="200"
                className="my-3 font-medium text-primary"
                dangerouslySetInnerHTML={markdownify("Related Contents")}
              />
              <div data-aos="fade-up-sm" data-aos-delay="300">
                <Button enable label="View All" link="/blog" />
              </div>
            </div>
            <div className="lg:col-8 max-lg:mt-14">
              <div className="row">
                {similarPosts.map((post, i) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    index={i}
                    className="md:col-6"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPostPage;
