import BlogCard from "@/components/BlogCard";
import ImageFallback from "@/helpers/ImageFallback";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToAction from "@/partials/CallToAction";
import FAQs from "@/partials/FAQs";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import Testimonial from "@/partials/Testimonial";
import type { AboutPage, BlogPost, Faqs, ReviewPage } from "@/types";

export default function AboutPage() {
  const about = getListPage<AboutPage["frontmatter"]>("about/_index.md");
  const posts = getSinglePage<BlogPost["frontmatter"]>("blog");
  const testimonial =
    getListPage<ReviewPage["frontmatter"]>("reviews/_index.md");
  const faqsData = getListPage<Faqs["frontmatter"]>("faqs/_index.md");

  const {
    title,
    description,
    meta_title,
    image,
    images_gallery,
    blog_section,
    team_section,
  } = about.frontmatter;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <PageHeader title={title} />

      <section className="section">
        <div className="container">
          <h2
            className="h4 leading-12 text-center"
            dangerouslySetInnerHTML={markdownify(description || "")}
          />

          <div className="flex flex-row gap-4 md:gap-6 items-center mt-14 overflow-hidden">
            <div className="w-[24%]">
              <div data-aos="zoom-in-sm" data-aos-delay="150">
                <ImageFallback
                  src={images_gallery[0]}
                  alt="NextSpace"
                  width={294}
                  height={352}
                  className="object-contain object-top w-full"
                />
              </div>
            </div>

            <div className="w-full xl:w-[80%] flex flex-col gap-4 md:gap-6">
              <div className="flex flex-row gap-4 md:gap-6">
                <div
                  data-aos="zoom-in-sm"
                  data-aos-delay="150"
                  className="w-1/3 mt-auto"
                >
                  <ImageFallback
                    src={images_gallery[1]}
                    alt="NextSpace"
                    width={294}
                    height={352}
                    className="object-contain object-bottom w-full"
                  />
                </div>
                <div
                  data-aos="zoom-in-sm"
                  data-aos-delay="200"
                  className="w-1/3 items-baseline"
                >
                  <ImageFallback
                    src={images_gallery[2]}
                    alt="NextSpace"
                    width={290}
                    height={258}
                    className="object-contain object-bottom w-full"
                  />
                </div>
                <div
                  data-aos="zoom-in-sm"
                  data-aos-delay="250"
                  className="w-1/3 mt-auto"
                >
                  <ImageFallback
                    src={images_gallery[3]}
                    alt="NextSpace"
                    width={263}
                    height={310}
                    className="object-contain object-bottom w-full"
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 md:gap-6">
                <div
                  data-aos="zoom-in-sm"
                  data-aos-delay="300"
                  className="w-1/2"
                >
                  <ImageFallback
                    src={images_gallery[4]}
                    alt="NextSpace"
                    width={390}
                    height={258}
                    className="object-contain object-top w-full"
                  />
                </div>
                <div
                  data-aos="zoom-in-sm"
                  data-aos-delay="350"
                  className="w-1/2"
                >
                  <ImageFallback
                    src={images_gallery[5]}
                    alt="NextSpace"
                    width={290}
                    height={208}
                    className="object-contain object-top max-sm:w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {blog_section.enable && (
        <section className="section pt-0">
          <div className="container">
            <div className="row g-5 justify-between items-start max-lg:text-center">
              <div className="lg:col-3">
                <p
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  className="font-medium text-primary uppercase"
                  dangerouslySetInnerHTML={markdownify(
                    blog_section.subtitle || ""
                  )}
                />
                <h2
                  data-aos="fade-up-sm"
                  data-aos-delay="200"
                  className="mt-3 font-medium text-primary"
                  dangerouslySetInnerHTML={markdownify(
                    blog_section.title || ""
                  )}
                />
              </div>
              <p
                data-aos="fade-up-sm"
                data-aos-delay="300"
                className="lg:col-8 h4 text-primary md:indent-20 text-center lg:text-left"
                dangerouslySetInnerHTML={markdownify(
                  blog_section.description || ""
                )}
              />
            </div>

            <div className="row g-4 section-sm pb-0">
              {posts
                ?.filter((post) => post.frontmatter.featured)
                .slice(0, blog_section.show_blog_count || 3)
                .map((post, i) => (
                  <BlogCard key={post.slug} index={i} post={post} />
                ))}
            </div>
          </div>
        </section>
      )}

      <Testimonial isNoSectionTop testimonial={testimonial} />

      {/* Team Section */}
      {team_section.enable && (
        <section className="section pt-0">
          <div className="container">
            {/* section title   */}
            <div className="row g-5 justify-between items-start max-lg:text-center">
              <div className="lg:col-3">
                <p
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  className="font-medium text-primary uppercase"
                  dangerouslySetInnerHTML={markdownify(
                    team_section.subtitle || ""
                  )}
                />
                <h2
                  data-aos="fade-up-sm"
                  data-aos-delay="200"
                  className="mt-3 font-medium text-primary"
                  dangerouslySetInnerHTML={markdownify(
                    team_section.title || ""
                  )}
                />
              </div>

              <div className="lg:col-8">
                <div className="md:columns-2 gap-x-[100px]">
                  {team_section.members?.map((t, i) => (
                    <div
                      key={i}
                      data-aos="fade-up-sm"
                      data-aos-delay={i * 100 + 150}
                      className="mt-[5rem] last:mb-0 group relative max-md:w-[80%] mx-auto"
                    >
                      <div className="overflow-hidden">
                        <ImageFallback
                          src={t.avatar!}
                          width={500}
                          height={600}
                          loading={"lazy"}
                          alt={t.name}
                          className="group-hover:scale-105 transition duration-300 ease-out"
                        />
                      </div>

                      <div className="flex gap-2 flex-wrap items-center pt-8 justify-between">
                        <h3
                          className="h5 font-medium"
                          dangerouslySetInnerHTML={markdownify(t.name)}
                        />
                        <p
                          dangerouslySetInnerHTML={markdownify(t.designation!)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <CallToAction isNoSectionTop />
      <FAQs isNoSectionTop faqsData={faqsData} />
    </>
  );
}
