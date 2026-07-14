"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Swiper } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

interface Slide {
  tag?: string;
  heading: string;
  subheading?: string;
  image?: string | null;
}

interface HeroSliderProps {
  slides: Slide[] | null;
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const swiperRef = useRef<Swiper | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, "");
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !slides?.length) return;

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
      on: {
        afterInit(sw) { setActiveIdx(sw.realIndex); },
        slideChange(sw) { setActiveIdx(sw.realIndex); },
      },
    });

    return () => {
      swiperRef.current?.destroy();
    };
  }, [slides, uniqueId]);

  if (!slides?.length) {
    return (
      <section className="pt-16 relative overflow-hidden h-[440px] lg:h-[560px] flex flex-col bg-linear-to-br from-secondary to-[#0a3018]" />
    );
  }

  const active = slides[activeIdx] ?? slides[0];

  return (
    <section className="pt-16 relative overflow-hidden h-[440px] lg:h-[560px] flex flex-col">
      {/* Background image or gradient */}
      {active.image ? (
        <div className="absolute inset-0 z-0">
          <Image
            src={active.image}
            alt={active.heading}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-linear-to-br from-secondary to-[#0a3018]" />
      )}

      {/* Swiper — autoplay/pagination only, not visible */}
      <div
        className="swiper inset-0 w-full h-full opacity-0 pointer-events-none"
        style={{ position: "absolute" }}
        ref={containerRef}
        aria-hidden="true"
      >
        <div className="swiper-wrapper h-full">
          {slides.map((_, i) => (
            <div key={i} className="swiper-slide h-full" />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col items-center justify-center w-full text-center px-6 py-6 max-w-[900px] mx-auto">
        <h1
          className="text-white font-semibold uppercase leading-tight mb-5 text-[clamp(28px,7vw,64px)] lg:text-[clamp(36px,5vw,72px)]"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.35)" }}
        >
          {active.heading}
        </h1>
        {active.subheading && (
          <p
            className="text-white/90 text-sm md:text-base"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
          >
            {active.subheading}
          </p>
        )}
      </div>

      {/* Pagination dots */}
      <div
        id={`hero-pagination-${uniqueId}`}
        className="relative z-20 flex justify-center gap-2 pb-6"
      />

      <style>{`
        .hero-bullet {
          display: inline-block;
          width: 8px; height: 8px;
          background: rgba(255,255,255,0.4);
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .hero-bullet-active { background: var(--color-gold); width: 24px; }
      `}</style>
    </section>
  );
}