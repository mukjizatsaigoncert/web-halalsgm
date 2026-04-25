import { markdownify } from "@/lib/utils/textConverter";
import type { Homepage } from "@/types";

const HomeServicesFactsSection = ({
  services_facts,
}: {
  services_facts: Homepage["frontmatter"]["services_facts"];
}) => {
  return (
    <>
      {services_facts.enable && (
        <section className="section bg-primary">
          <div className="container">
            {/* section title on desktop */}
            <div className="lg:hidden text-center mb-10">
              <p
                data-aos="fade-up-sm"
                data-aos-delay="150"
                className="font-medium text-white uppercase"
                dangerouslySetInnerHTML={markdownify(services_facts.title)}
              />
              <h2
                data-aos="fade-up-sm"
                data-aos-delay="250"
                className="mt-3 font-medium text-white"
                dangerouslySetInnerHTML={markdownify(services_facts.subtitle)}
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {/* section title on mobile */}
              <div className="max-lg:hidden">
                <p
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  className="font-medium text-white uppercase"
                  dangerouslySetInnerHTML={markdownify(services_facts.title)}
                />
                <h2
                  data-aos="fade-up-sm"
                  data-aos-delay="250"
                  className="mt-3 font-medium text-white"
                  dangerouslySetInnerHTML={markdownify(services_facts.subtitle)}
                />
              </div>

              {services_facts.metrics?.map((metric, i) => (
                <div
                  key={i}
                  className="text-white/90 p-8 service-card-hover group max-lg:text-center mb-6"
                >
                  {/* Number Animation */}
                  <div className="flex h-6 w-6 overflow-hidden items-center justify-center mb-16 max-lg:mx-auto">
                    <div className="h-6 w-6 transition duration-500 ease-out group-hover:-translate-y-full flex flex-col items-center">
                      <div className="min-w-6 flex justify-center items-center min-h-6">
                        <p className="text-lg">
                          {i + 1 < 10 ? `0${i + 1}` : i + 1}
                        </p>
                      </div>
                      <div
                        className="min-w-6 flex justify-center items-center min-h-6"
                        aria-hidden="true"
                      >
                        <p className="text-lg">
                          {i + 1 < 10 ? `0${i + 1}` : i + 1}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h6
                    className="text-white h5 font-normal mb-6"
                    dangerouslySetInnerHTML={markdownify(metric.name)}
                  />
                  <p
                    className="text-text-light/80 text-balance"
                    dangerouslySetInnerHTML={markdownify(metric.description)}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HomeServicesFactsSection;
