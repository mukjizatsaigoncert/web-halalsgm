"use client";

import Button from "@/components/Button";
import { markdownify } from "@/lib/utils/textConverter";
import Accordion from "@/shortcodes/Accordion";
import type { Faqs } from "@/types";
import { usePathname } from "next/navigation";

interface Props {
  isNoSectionBottom?: boolean;
  isNoSectionTop?: boolean;
  faqsData: Faqs;
}

const FAQs = ({
  isNoSectionBottom = false,
  isNoSectionTop = false,
  faqsData,
}: Props) => {
  const { list } = faqsData.frontmatter;
  const pathname = usePathname();

  return (
    <>
      {list.length > 0 && (
        <section
          className={`section ${
            isNoSectionBottom && "pb-0"
          } ${isNoSectionTop && "pt-0"}`}
        >
          <div className="container">
            <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between">
              <div
                className={`lg:w-[25%] max-lg:text-center ${
                  pathname.includes("faqs") && "hidden"
                }`}
              >
                <p
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  className="font-medium text-primary uppercase"
                  dangerouslySetInnerHTML={markdownify("FAQS")}
                />
                <h2
                  data-aos="fade-up-sm"
                  data-aos-delay="200"
                  className="mt-3 font-medium text-primary pb-14"
                  dangerouslySetInnerHTML={markdownify(
                    "Still Have A Question?"
                  )}
                />
                <div data-aos="fade-up-sm" data-aos-delay="300">
                  <Button enable label="See All FAQs" link="/faqs" />
                </div>
              </div>
              <div className="max-lg:pt-10 lg:w-[70%] mx-auto">
                {list?.map((item, index) => (
                  <div
                    key={index}
                    data-aos="fade-left-sm"
                    data-aos-delay={index * 100 + 150}
                    className="mb-1"
                  >
                    <Accordion title={item.question} id={index}>
                      <div dangerouslySetInnerHTML={markdownify(item.answer)} />
                    </Accordion>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FAQs;
