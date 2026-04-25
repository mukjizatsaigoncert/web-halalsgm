import Button from "@/components/Button";
import config from "@/config/config.json";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToAction from "@/partials/CallToAction";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import type { ContactPage } from "@/types";
import Link from "next/link";

const ContactPage = () => {
  const contact = getListPage<ContactPage["frontmatter"]>("contact/_index.md");
  const { title, description, meta_title, image, address_section } =
    contact.frontmatter;
  const { contact_form_action } = config.params;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <PageHeader title={title} isContactPage />
      <section className="-mt-[45%] sm:-mt-[30%] md:-mt-[25%] lg:-mt-[40%] xl:-mt-[30%] 2xl:-mt-[23%]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-20 justify-center lg:justify-between">
            <div className="lg:w-[52%]">
              <form
                data-aos="fade-right-sm"
                data-aos-delay="150"
                className="bg-primary px-12 py-14"
                action={contact_form_action}
                method="POST"
              >
                <h2
                  className="text-white mb-4"
                  dangerouslySetInnerHTML={markdownify(title)}
                />
                {description && (
                  <p
                    className="text-text-light/80 mb-16"
                    dangerouslySetInnerHTML={markdownify(description)}
                  />
                )}

                <div className="mb-6">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="John Doe"
                    type="text"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    className="form-input"
                    placeholder="john.doe@email.com"
                    type="email"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="name" className="form-label">
                    Inquire Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="form-input"
                    placeholder="Want to decor my house"
                    type="text"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="form-label">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-input"
                    placeholder="Write your messages..."
                    rows={3}
                    required
                  ></textarea>
                </div>
                <Button
                  enable
                  label="Send a message"
                  type="submit"
                  style="btn-outline"
                />
              </form>
            </div>

            <div className="lg:w-[40%] self-center lg:self-end pb-14">
              <h3
                data-aos="fade-up-sm"
                data-aos-delay="150"
                className="h4 mb-4"
                dangerouslySetInnerHTML={markdownify(address_section.title)}
              />
              <p
                data-aos="fade-up-sm"
                data-aos-delay="200"
                className="text-balance"
                dangerouslySetInnerHTML={markdownify(
                  address_section.description
                )}
              />

              <ul className="grid grid-cols-2 gap-8 mt-12">
                <li data-aos="fade-up-sm" data-aos-delay="250">
                  <h4 className="h6 mb-3">Working Mail</h4>
                  <Link href={`mailto:${config.params.email}`}>
                    {config.params.email}
                  </Link>
                </li>
                <li data-aos="fade-up-sm" data-aos-delay="300">
                  <h4 className="h6 mb-3">Office Phone</h4>
                  <Link href={`tel:${config.params.phone}`}>
                    {config.params.phone}
                  </Link>
                </li>
                <li data-aos="fade-up-sm" data-aos-delay="350">
                  <h4 className="h6 mb-3">Office Address</h4>
                  <Link
                    target="_blank"
                    href={`https://www.google.com/maps?q=${encodeURIComponent(
                      config.params.address
                    )}`}
                    dangerouslySetInnerHTML={markdownify(config.params.address)}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <CallToAction isNoSectionTop isNoSectionBottom />
    </>
  );
};

export default ContactPage;
