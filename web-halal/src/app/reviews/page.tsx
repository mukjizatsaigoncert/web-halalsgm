import ImageFallback from "@/helpers/ImageFallback";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToAction from "@/partials/CallToAction";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import Testimonial from "@/partials/Testimonial";
import { ReviewPage } from "@/types";

const ReviewsPage = () => {
  const reviewsIndex =
    getListPage<ReviewPage["frontmatter"]>("reviews/_index.md");
  const featuredTestimonials = reviewsIndex.frontmatter.testimonials?.filter(
    (f) => f.featured
  );

  return (
    <>
      <SeoMeta {...reviewsIndex.frontmatter} />
      <PageHeader title={reviewsIndex.frontmatter.title} />

      <section className="section pb-0">
        <div className="container">
          {featuredTestimonials?.map((testimonial, i) => (
            <div
              className={`row g-5 mb-32 last:mb-0 items-center lg:justify-between flex flex-col md:flex-row ${
                i % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
              key={i}
            >
              <div
                data-aos={i % 2 === 0 ? "fade-right-sm" : "fade-left-sm"}
                data-aos-delay="300"
                className="col-10 lg:col-5"
              >
                {testimonial.avatar && (
                  <ImageFallback
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={600}
                    height={800}
                    loading="lazy"
                  />
                )}
              </div>

              <div className="col-10 lg:col-6">
                <p
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  className="text-primary text-h5 lg:text-h4 before:content-['“'] after:content-['”']"
                  dangerouslySetInnerHTML={markdownify(testimonial.content)}
                />

                <div
                  data-aos="fade-up-sm"
                  data-aos-delay="250"
                  className="flex items-center flex-wrap gap-3 justify-between mt-10 lg:mt-14"
                >
                  <h6
                    className="font-medium text-2xl relative pl-5 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2.5 before:h-2.5 before:rounded-full before:bg-current"
                    dangerouslySetInnerHTML={markdownify(testimonial.name)}
                  />
                  <p
                    dangerouslySetInnerHTML={markdownify(
                      testimonial.designation
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Testimonial isNoSectionBottom testimonial={reviewsIndex} />
      <CallToAction isNoSectionBottom isNoSectionTop />
    </>
  );
};

export default ReviewsPage;
