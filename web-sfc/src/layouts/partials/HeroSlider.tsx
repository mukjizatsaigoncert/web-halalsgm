"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { Swiper } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import Counter from "@/components/Counter";

interface Slide {
  image: string;
  tag?: string;
  heading: string;
  subheading?: string;
}

interface Stat {
  end: number;
  suffix?: string;
  label: string;
}

interface HeroSliderProps {
  slides: Slide[];
  stats?: Stat[];
  ctaLabel?: string;
  ctaLink?: string;
}

export default function HeroSlider({
  slides,
  stats = [],
  ctaLabel = "Liên hệ ngay",
  ctaLink = "/lien-he",
}: HeroSliderProps) {
  const swiperRef = useRef<Swiper | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, "");

  useEffect(() => {
    if (!containerRef.current || slides.length === 0) return;

    swiperRef.current = new Swiper(containerRef.current, {
      modules: [Autoplay, EffectFade, Pagination],
      effect: "fade",
      fadeEffect: { crossFade: true },
      loop: slides.length > 1,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: {
        el: `#hero-pagination-${uniqueId}`,
        clickable: true,
        bulletClass: "hero-bullet",
        bulletActiveClass: "hero-bullet-active",
      },
    });

    return () => {
      swiperRef.current?.destroy();
    };
  }, [slides, uniqueId]);

  return (
    <section className="relative w-full mt-16 lg:mt-20 h-[calc(100vh-64px)] lg:h-[calc(100vh-80px)] min-h-[500px] max-h-[900px] overflow-hidden">
      {/* Swiper */}
      <div className="swiper absolute inset-0" ref={containerRef}>
        <div className="swiper-wrapper h-full">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="swiper-slide relative h-full"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/55" />

              {/* Slide content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-4 xl:max-w-[1225px]">
                  <div className="max-w-2xl">
                    {slide.tag && (
                      <span className="inline-block bg-secondary/20 border border-secondary/40 text-secondary text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
                        {slide.tag}
                      </span>
                    )}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
                      {slide.heading}
                    </h1>
                    {slide.subheading && (
                      <p className="text-white/80 text-base md:text-lg mb-8 max-w-xl">
                        {slide.subheading}
                      </p>
                    )}
                    <Link
                      href={ctaLink}
                      className="inline-block px-7 py-3.5 bg-secondary text-white font-semibold text-sm rounded-lg hover:bg-secondary/90 transition-colors shadow-lg"
                    >
                      {ctaLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div
          id={`hero-pagination-${uniqueId}`}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2"
        />
      </div>

      {/* Stats bar — nằm ở đáy, trên nền tối trong suốt */}
      {stats.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/60 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4 xl:max-w-[1225px]">
            <div className="flex divide-x divide-white/20">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center justify-center py-5 px-4"
                >
                  <span className="text-3xl md:text-4xl font-bold text-white">
                    <Counter end={stat.end} suffix={stat.suffix ?? "+"} start={0} />
                  </span>
                  <span className="text-white/70 text-xs md:text-sm mt-1 text-center">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagination bullet styles */}
      <style>{`
        .hero-bullet {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.5);
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .hero-bullet-active {
          background: #E85C0D;
          width: 24px;
        }
      `}</style>
    </section>
  );
}
