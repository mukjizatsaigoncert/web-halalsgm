import ImageFallback from "@/helpers/ImageFallback";
import dateFormat from "@/lib/utils/dateFormat";
import { markdownify } from "@/lib/utils/textConverter";
import type { BlogPost } from "@/types";
import Link from "next/link";

interface Props {
  post: BlogPost;
  index: number;
  className?: string;
  section?: string; // Add section prop to determine the link path
}

export default function BlogCard({
  post,
  index,
  className,
  section = "blog",
}: Props) {
  const { title, image, date, description } = post.frontmatter;
  return (
    <div
      data-aos="fade-up-sm"
      data-aos-delay={index * 100 + 150}
      className={`${className ? className : "col-11 sm:col-9 md:col-6 lg:col-4"} mb-12 last:mb-0 mx-auto relative group`}
    >
      <div className="overflow-hidden">
        <ImageFallback
          src={image!}
          alt={title}
          width={450}
          height={600}
          className="object-cover aspect-[9/12] w-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>
      <p className="px-3 py-1 bg-primary/10 text-primary font-medium rounded-full text-sm w-fit mt-8 mb-7">
        {dateFormat(date!)}
      </p>

      <Link
        className="before:absolute before:inset-0"
        href={`/${section}/${post.slug}`}
      >
        <h2
          className="h5 mb-6"
          dangerouslySetInnerHTML={markdownify(title || "")}
        />
      </Link>
      <p
        className="text-base text-body-color mb-7 line-clamp-2"
        dangerouslySetInnerHTML={markdownify(description || "")}
      />
    </div>
  );
}
