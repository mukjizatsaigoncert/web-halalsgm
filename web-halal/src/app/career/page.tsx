import config from "@/config/config.json";
import DynamicIcon from "@/helpers/DynamicIcon";
import ImageFallback from "@/helpers/ImageFallback";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToAction from "@/partials/CallToAction";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import type { CareerPage } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CareerPage() {
  const career = getListPage<CareerPage["frontmatter"]>("career/_index.md");

  if (!career) {
    return notFound();
  }

  const { title, description, image, available_jobs } = career.frontmatter;

  return (
    <>
      <SeoMeta {...career.frontmatter} />
      <PageHeader title={title} />
      <section className="section">
        <div className="container">
          <div className="row justify-between g-5">
            <div
              data-aos="zoom-out-sm"
              data-aos-delay="150"
              className="lg:col-5"
            >
              {image && (
                <ImageFallback
                  src={image}
                  height={800}
                  width={500}
                  alt={title}
                  className="w-full object-cover aspect-[16/9]"
                />
              )}

              <h3
                data-aos="fade-up-sm"
                data-aos-delay="150"
                className="h4 mt-10 mb-4 max-lg:text-center"
                dangerouslySetInnerHTML={markdownify(title)}
              />
              <p
                data-aos="fade-up-sm"
                data-aos-delay="200"
                className="text-balance text-lg max-lg:text-center"
                dangerouslySetInnerHTML={markdownify(description || "")}
              />

              <ul className="grid grid-cols-2 gap-8 mt-12">
                <li
                  data-aos="fade-up-sm"
                  data-aos-delay="250"
                  className="max-lg:text-center"
                >
                  <h4 className="h6 mb-3">Working Mail</h4>
                  <Link href={`mailto:${config.params.email}`}>
                    {config.params.email}
                  </Link>
                </li>
                <li
                  data-aos="fade-up-sm"
                  data-aos-delay="300"
                  className="max-lg:text-center"
                >
                  <h4 className="h6 mb-3">Office Phone</h4>
                  <Link href={`tel:${config.params.phone}`}>
                    {config.params.phone}
                  </Link>
                </li>
                <li
                  data-aos="fade-up-sm"
                  data-aos-delay="350"
                  className="max-lg:text-center"
                >
                  <h4 className="h6 mb-3">Office Address</h4>
                  <Link
                    target="_blank"
                    href={`https://www.google.com/maps?q=${encodeURIComponent(config.params.address)}`}
                    dangerouslySetInnerHTML={markdownify(config.params.address)}
                  />
                </li>
              </ul>
            </div>
            <div className="lg:col-6">
              <h3
                data-aos="fade-up-sm"
                data-aos-delay="150"
                className="h4 max-lg:mt-10 mb-4 max-lg:text-center"
                dangerouslySetInnerHTML={markdownify(available_jobs.title)}
              />
              <p
                data-aos="fade-up-sm"
                data-aos-delay="200"
                className="text-lg max-lg:text-center text-balance"
                dangerouslySetInnerHTML={markdownify(
                  available_jobs.description
                )}
              />

              <ul className="mt-10 space-y-4">
                {available_jobs.jobs?.map((job, i) => (
                  <li
                    key={i}
                    data-aos="fade-up-sm"
                    data-aos-delay={i * 100 + 150}
                    className="border border-border py-8 px-7 flex justify-between items-center flex-wrap group relative gap-4"
                  >
                    <div>
                      <Link
                        href={job.link}
                        className="before:absolute before:inset-0"
                        target="_blank"
                      >
                        <h2
                          className="h5 mb-2"
                          dangerouslySetInnerHTML={markdownify(job.name)}
                        />
                      </Link>

                      <p
                        className="text-lg"
                        dangerouslySetInnerHTML={markdownify(job.location)}
                      />
                    </div>

                    <div className="flex h-6 w-6 overflow-hidden items-center justify-center">
                      <div className="h-6 w-6 transition duration-500 ease-out group-hover:-translate-y-full flex flex-col items-center text-primary">
                        <div className="min-w-6 flex justify-center items-center min-h-6">
                          <DynamicIcon
                            icon="FaArrowRightLong"
                            className="text-2xl -rotate-45 text-primary/40"
                          />
                        </div>
                        <div
                          className="min-w-6 flex justify-center items-center min-h-6"
                          aria-hidden="true"
                        >
                          <DynamicIcon
                            icon="FaArrowRightLong"
                            className="text-2xl -rotate-45"
                          />
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CallToAction isNoSectionTop isNoSectionBottom />
    </>
  );
}
