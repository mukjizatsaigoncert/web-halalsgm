import Button from "@/components/Button";
import ImageFallback from "@/helpers/ImageFallback";
import { getSinglePage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import type { Homepage, ServicePage } from "@/types";

const HomeServicesSection = ({
  services,
}: {
  services: Homepage["frontmatter"]["services"];
}) => {
  const featuredHomeServices = getSinglePage<ServicePage["frontmatter"]>(
    "services"
  ).filter((s) => s.frontmatter.featured_in_homepage);

  return (
    services.enable && (
      <section className="section pt-0">
        <div className="container">
          <div className="row gap-4 justify-center lg:justify-between items-center max-lg:text-center">
            <div className="lg:col-6">
              <p
                data-aos="fade-up-sm"
                data-aos-delay="150"
                className="font-medium text-primary uppercase"
                dangerouslySetInnerHTML={markdownify(services.subtitle)}
              />
              <h2
                data-aos="fade-up-sm"
                data-aos-delay="200"
                className="mt-3 font-medium text-primary"
                dangerouslySetInnerHTML={markdownify(services.title)}
              />
            </div>

            {services.button.enable && (
              <div
                data-aos="fade-up-sm"
                data-aos-delay="300"
                className="lg:col-4 flex flex-col items-center lg:items-end mt-6 lg:mt-auto"
              >
                <Button {...services.button} />
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 xl:gap-24 pt-10 md:pt-40 px-4 sm:px-10 lg:px-0 overflow-hidden max-md:w-[90%] mx-auto">
            {featuredHomeServices.map((service, index) => (
              <div
                data-aos="fade-up-sm"
                data-aos-delay={index * 100 + 300}
                className="flex flex-col md:h-[550px] justify-end mb-14 last:mb-0"
                key={service.slug}
              >
                <div className="flex justify-center items-end md:h-[400px]">
                  <ImageFallback
                    src={service.frontmatter.image!}
                    alt={service.frontmatter.title}
                    width={600}
                    height={500}
                    className={`${
                      index % 3 === 1
                        ? "h-[500px] object-cover w-full"
                        : "h-[410px] object-cover w-full self-end"
                    }`}
                  />
                </div>

                <div className="mt-10 text-center">
                  <h3
                    className="h5 font-medium mb-2"
                    dangerouslySetInnerHTML={markdownify(
                      service.frontmatter.title
                    )}
                  />
                  <p
                    dangerouslySetInnerHTML={markdownify(
                      service.frontmatter.description || ""
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  );
};

export default HomeServicesSection;
