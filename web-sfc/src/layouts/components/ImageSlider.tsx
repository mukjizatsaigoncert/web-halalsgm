"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { useEffect, useId, useRef } from "react";
import { Swiper } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

interface ImageSliderProps {
  images: { url: string; alt?: string }[];
  className?: string;
  slidesPerView?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
}

const ImageSlider = ({
  images,
  className = "",
  slidesPerView = 2,
  autoplay = true,
  autoplayDelay = 4000,
}: ImageSliderProps) => {
  const swiperRef = useRef<Swiper | null>(null);
  const uniqueId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length === 0 || !containerRef.current) return;

    // Tính toán slidesPerView dựa trên số ảnh và config
    const maxSlides = Math.min(slidesPerView, images.length);

    swiperRef.current = new Swiper(containerRef.current, {
      modules: [Autoplay, Navigation, Pagination],
      spaceBetween: 16,
      loop: images.length > maxSlides,
      autoplay:
        autoplay && images.length > maxSlides
          ? {
              delay: autoplayDelay,
              disableOnInteraction: false,
            }
          : false,
      pagination: {
        el: `#pagination-${uniqueId}`,
        clickable: true,
      },
      navigation: {
        prevEl: `#prev-${uniqueId}`,
        nextEl: `#next-${uniqueId}`,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        640: {
          slidesPerView: Math.min(2, maxSlides),
        },
        1024: {
          slidesPerView: maxSlides,
        },
      },
    });

    return () => {
      swiperRef.current?.destroy();
    };
  }, [images, slidesPerView, autoplay, autoplayDelay, uniqueId]);

  if (!images || images.length === 0) {
    return null;
  }

  const showNavigation = images.length > slidesPerView;

  return (
    <div className={`image-slider-wrapper relative ${className}`}>
      <div className="swiper" ref={containerRef}>
        <div className="swiper-wrapper">
          {images.map((image, index) => (
            <div className="swiper-slide" key={index}>
              <ImageFallback
                src={image.url}
                alt={image.alt || `Slide ${index + 1}`}
                width={800}
                height={500}
                className="w-full h-auto object-cover rounded-lg aspect-video"
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div
          id={`pagination-${uniqueId}`}
          className="swiper-pagination !relative mt-4"
        />
      </div>

      {/* Navigation buttons - đặt ngoài swiper container */}
      {showNavigation && (
        <>
          <button
            id={`prev-${uniqueId}`}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md text-primary transition-all"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            id={`next-${uniqueId}`}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white rounded-full shadow-md text-primary transition-all"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
