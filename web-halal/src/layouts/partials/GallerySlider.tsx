"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import type { Homepage } from "@/types";
import { useEffect } from "react";
import { Swiper } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";

const GallerySlider = ({
  gallery,
}: {
  gallery: Homepage["frontmatter"]["gallery"];
}) => {
  const { enable, title, subtitle, description, images } = gallery;

  useEffect(() => {
    if (enable) {
      const swiper = new Swiper(".gallery-slider", {
        modules: [Autoplay],
        spaceBetween: 24,
        loop: true,
        centeredSlides: false,
        speed: 10000,
        autoplay: {
          delay: 0,
        },
        breakpoints: {
          0: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 4,
          },
          992: {
            slidesPerView: 5,
          },
          2000: {
            slidesPerView: 6,
          },
        },
      });

      return () => {
        swiper.destroy();
      };
    }
  }, [enable]);

  return (
    <>
      {enable && (
        <section className="section">
          <div className="container">
            {/* section title */}
            <div className="row g-5 justify-between items-center max-lg:text-center">
              <div className="lg:col-4">
                <p
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  className="font-medium text-primary uppercase"
                  dangerouslySetInnerHTML={markdownify(subtitle)}
                />
                <h2
                  data-aos="fade-up-sm"
                  data-aos-delay="200"
                  className="mt-3 font-medium text-primary"
                  dangerouslySetInnerHTML={markdownify(title)}
                />
              </div>
              <p
                data-aos="fade-up-sm"
                data-aos-delay="300"
                className="lg:col-8 h4 text-primary lg:indent-20 text-center lg:text-left"
                dangerouslySetInnerHTML={markdownify(description)}
              />
            </div>
          </div>

          <div className="swiper gallery-slider mt-17.5">
            <div className="swiper-wrapper">
              {images?.map((img, i) => (
                <div className="swiper-slide" key={i}>
                  <ImageFallback
                    height={512}
                    width={392}
                    src={img}
                    alt={`gallery-slider-${i}`}
                    className="gallery-image"
                  />
                </div>
              ))}
            </div>
            <div className="mt-9 flex items-center justify-center text-center" />
          </div>
        </section>
      )}

      <style jsx>{`
        .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </>
  );
};

export default GallerySlider;
