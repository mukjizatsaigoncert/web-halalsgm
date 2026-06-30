import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    image: string;
    date: string;
    description?: string;
    author?: string;
  };
}

interface HomeBlogProps {
  tag?: string;
  heading?: string;
  posts: BlogPost[];
  section?: string;
  viewAllLabel?: string;
  viewAllLink?: string;
}

export default function HomeBlog({
  tag = "Tin tức & Bài viết",
  heading = "Chúng tôi xây dựng và thiết kế tương lai",
  posts,
  section = "tin-tuc",
  viewAllLabel = "Xem thêm",
  viewAllLink = "/tin-tuc",
}: HomeBlogProps) {
  if (posts.length === 0) return null;

  return (
    <section className="relative py-20 md:py-[80px] bg-white border-t border-current/20">
      <div className="container mx-auto px-4 xl:max-w-[1290px]">

        {/* Heading — tag + title only, no button here */}
        <div className="text-center mb-14" data-aos="fade-up-sm">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4 text-dark/60">
            {tag}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-dark leading-tight">
            {heading.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>

        {/* Cards — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post, i) => {
            let dateStr = "";
            try {
              dateStr = format(new Date(post.frontmatter.date), "dd MMMM, yyyy", { locale: vi });
            } catch {
              dateStr = post.frontmatter.date ?? "";
            }
            return (
              <article
                key={post.slug}
                className="group"
                data-aos="fade-up-sm"
                data-aos-delay={i * 100}
              >
                {/* Image */}
                <Link
                  href={`/${section}/${post.slug}`}
                  className="block overflow-hidden rounded-2xl"
                >
                  <ImageFallback
                    src={post.frontmatter.image}
                    width={500}
                    height={340}
                    alt={post.frontmatter.title}
                    className="w-full aspect-[3/2] object-cover rounded-2xl transition-transform duration-300 group-hover:scale-[1.08]"
                  />
                </Link>

                {/* Info */}
                <div className="mt-5">
                  {post.frontmatter.author && (
                    <p className="text-[14px] uppercase text-dark mb-[10px] font-medium">
                      {post.frontmatter.author}
                    </p>
                  )}
                  <h3 className="font-bold text-dark leading-snug mb-3">
                    <Link
                      href={`/${section}/${post.slug}`}
                      className="hover:text-secondary transition-colors"
                      style={{ fontSize: "28px" }}
                    >
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                  <p className="text-dark/60 text-[14px]">{dateStr}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* View all button — below cards */}
        <div className="text-center mt-10">
          <Link
            href={viewAllLink}
            className="inline-block bg-secondary text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            {viewAllLabel}
          </Link>
        </div>

      </div>
    </section>
  );
}
