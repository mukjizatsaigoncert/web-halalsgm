"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
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
  cta2Label?: string;
  cta2Link?: string;
}

export default function HeroSlider({
  slides,
  stats = [],
  ctaLabel = "Xem thêm",
  ctaLink = "/lien-he",
  cta2Label,
  cta2Link,
}: HeroSliderProps) {
  const swiperRef = useRef<Swiper | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, "");
  const [activeIdx, setActiveIdx] = useState(0);

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
      on: {
        afterInit(sw) { setActiveIdx(sw.realIndex); },
        slideChange(sw) { setActiveIdx(sw.realIndex); },
      },
    });

    return () => {
      swiperRef.current?.destroy();
    };
  }, [slides, uniqueId]);

  const active = slides[activeIdx] ?? slides[0];

  return (
    /* Full-width edge-to-edge, no container, no border-radius — giống urban-construct */
    <section className="mt-16 relative overflow-hidden h-[calc(100vh-4rem)] min-h-[500px] max-h-[900px]">
      {/* Swiper — background images, fills entire section */}
      <div className="swiper absolute inset-0 w-full h-full" ref={containerRef}>
        <div className="swiper-wrapper h-full">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="swiper-slide h-full"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))}
        </div>
      </div>

      {/* Forest green gradient overlay — hides baked-in image text, keeps palette coherent */}
      <div className="absolute inset-0 z-[5] pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(13,61,31,0.82) 0%, rgba(13,61,31,0.55) 50%, rgba(0,0,0,0.35) 100%)" }} />

      {/* Content overlay: left=heading+CTAs, right=stats 2×2 bottom-right */}
      <div
        className="absolute inset-0 z-10 flex justify-between items-start"
        style={{ padding: "clamp(24px, 3.5vw, 50px)" }}
      >
        {/* Left: heading + description + 2 CTA buttons */}
        <div className="flex-[0_0_50%] max-w-[50%] pr-5">
          <h1
            className="text-white font-semibold uppercase leading-tight mb-5"
            style={{
              fontSize: "clamp(30px, 5.5vw, 90px)",
              textShadow: "0 2px 8px rgba(0,0,0,0.35)",
            }}
          >
            {active.heading}
          </h1>
          {active.subheading && (
            <p
              className="text-white mb-[30px]"
              style={{
                fontSize: "clamp(14px, 1.2vw, 18px)",
                textShadow: "0 1px 4px rgba(0,0,0,0.4)",
              }}
            >
              {active.subheading}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Link
              href={ctaLink}
              className="inline-block bg-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              style={{ padding: "clamp(10px, 1vw, 14px) clamp(20px, 2vw, 28px)", fontSize: "clamp(13px, 1vw, 16px)" }}
            >
              {ctaLabel}
            </Link>
            {cta2Label && cta2Link && (
              <Link
                href={cta2Link}
                className="inline-block bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                style={{ padding: "clamp(10px, 1vw, 14px) clamp(20px, 2vw, 28px)", fontSize: "clamp(13px, 1vw, 16px)" }}
              >
                {cta2Label}
              </Link>
            )}
          </div>
        </div>

        {/* Right: 4 white stats cards 2×2, aligned to bottom-right */}
        {stats.length > 0 && (
          <div className="flex-[0_0_50%] max-w-[50%] h-full flex items-end justify-end">
            <div
              className="grid grid-cols-2 w-full"
              style={{ gap: 10, maxWidth: "clamp(280px, 35vw, 530px)" }}
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl"
                  style={{ padding: "clamp(12px, 1.8vw, 25px)" }}
                >
                  <div
                    className="font-semibold leading-none overflow-hidden flex items-center"
                    style={{
                      color: "#147b3b",
                      fontSize: "clamp(1.5rem, 3vw, 3.125rem)",
                      height: "clamp(1.5rem, 3vw, 3.125rem)",
                    }}
                  >
                    <Counter end={stat.end} suffix={stat.suffix ?? ""} start={0} />
                  </div>
                  <div
                    className="font-semibold mt-2"
                    style={{ color: "#21201e", fontSize: "clamp(12px, 1.1vw, 18px)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination dots */}
      <div
        id={`hero-pagination-${uniqueId}`}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2"
      />

      <style>{`
        .hero-bullet {
          display: inline-block;
          width: 8px; height: 8px;
          background: rgba(255,255,255,0.5);
          border-radius: 9999px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .hero-bullet-active { background: #147b3b; width: 24px; }
      `}</style>
    </section>
  );
}
