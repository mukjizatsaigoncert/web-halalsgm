"use client";

import DynamicIcon from "@/helpers/DynamicIcon";
import { markdownify } from "@/lib/utils/textConverter";
import { ReviewPage } from "@/types";
import { useEffect } from "react";
import { Swiper } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

const Testimonial = ({
  isNoSectionTop = false,
  isNoSectionBottom = false,
  testimonial,
}: {
  isNoSectionTop?: boolean;
  isNoSectionBottom?: boolean;
  testimonial: ReviewPage;
}) => {
  const { title, subtitle, testimonials } = testimonial.frontmatter;

  useEffect(() => {
    new Swiper(".review-slider", {
      modules: [Autoplay, Navigation],
      spaceBetween: 24,
      loop: true,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      allowTouchMove: false,
      navigation: {
        prevEl: ".custom-swiper-button-prev",
        nextEl: ".custom-swiper-button-next",
      },
      slidesPerView: 1,
    });
  }, []);

  return (
    <section
      className={`section ${isNoSectionTop ? "pt-0" : ""} ${isNoSectionBottom && "pb-0"}`}
    >
      <div className="bg-primary">
        <div className="flex flex-col lg:flex-row max-lg:items-center justify-center">
          <div className="w-[80%] lg:w-[58%] section">
            <div className="row justify-center h-full">
              <div className="lg:col-7 flex flex-col">
                {/* section title */}
                <div>
                  <p
                    data-aos="fade-up-sm"
                    data-aos-delay="150"
                    className="font-medium text-white uppercase"
                    dangerouslySetInnerHTML={markdownify(subtitle)}
                  />
                  <h2
                    data-aos="fade-up-sm"
                    data-aos-delay="250"
                    className="mt-3 font-medium text-white"
                    dangerouslySetInnerHTML={markdownify(title)}
                  />
                </div>

                {/* swiper at the bottom */}
                <div className="mt-14 lg:mt-auto">
                  <div className="swiper review-slider relative">
                    <div className="swiper-wrapper">
                      {testimonials?.map((item, index) => (
                        <div key={index} className="swiper-slide">
                          <div className="flex items-center">
                            <p
                              dangerouslySetInnerHTML={markdownify(
                                item.content
                              )}
                              className="text-white md:text-h5 lg:text-h4 before:content-['“'] after:content-['”']"
                            />
                          </div>

                          <h6
                            className="text-white mt-10 mb-2 font-medium text-2xl"
                            dangerouslySetInnerHTML={markdownify(item.name)}
                          />
                          <p
                            className="text-white/50"
                            dangerouslySetInnerHTML={markdownify(
                              item.designation
                            )}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Custom arrow buttons */}
                    <div className="flex gap-6 absolute bottom-0 right-0 z-10">
                      <div className="custom-swiper-button-prev text-white/50 duration-200 ease-in-out cursor-pointer -rotate-45 active:scale-80">
                        <DynamicIcon
                          icon="FaArrowLeftLong"
                          className="text-2xl"
                        />
                      </div>
                      <div className="custom-swiper-button-next text-white duration-200 ease-in-out cursor-pointer -rotate-45 active:scale-80">
                        <DynamicIcon
                          icon="FaArrowRightLong"
                          className="text-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[90%] lg:w-[42%] bg-[url(/images/banner-testimonial.png)] lg:h-[913px] bg-cover aspect-square" />
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
