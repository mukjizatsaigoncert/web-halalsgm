"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { useEffect, useId, useRef } from "react";
import { Swiper } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Counter from "@/components/Counter";

interface ReviewItem {
  projectTitle: string;
  description: string;
  personImage: string;
  personName: string;
  personRole: string;
  satisfactionPercent: number;
  satisfactionLabel: string;
  satisfactionDesc: string;
  logoImage?: string;
}

interface HomeReviewProps {
  tag?: string;
  heading: string;
  items: ReviewItem[];
}

export default function HomeReview({
  tag = "Khách hàng nói về chúng tôi",
  heading = "Xây dựng và kiến tạo\ntương lai bền vững",
  items,
}: HomeReviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<Swiper | null>(null);
  const uniqueId = useId().replace(/:/g, "");

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;
    swiperRef.current = new Swiper(containerRef.current, {
      modules: [Autoplay, Pagination],
      loop: items.length > 1,
      autoplay: { delay: 6000, disableOnInteraction: false },
      pagination: { el: `#review-pagination-${uniqueId}`, clickable: true },
    });
    return () => { swiperRef.current?.destroy(); };
  }, [items, uniqueId]);

  return (
    <section className="relative py-20 md:py-28 bg-primary text-white overflow-hidden">
      {/* Radial gradient decoration left side */}
      <div
        className="absolute left-0 top-0 w-2/5 h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,255,255,0.1) 0, rgba(255,255,255,0) 55%) no-repeat",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 xl:max-w-[1290px]">
        {/* Heading */}
        <div className="text-center mb-14" data-aos="fade-up-sm">
          <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-3">
            {tag}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {heading.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>

        {/* Swiper */}
        <div className="swiper" ref={containerRef} data-aos="fade-up-sm" data-aos-delay="150">
          <div className="swiper-wrapper">
            {items.map((item, i) => (
              <div key={i} className="swiper-slide">
                <div className="bg-[#0a3018] rounded-2xl p-8 md:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left — 2/3 */}
                    <div className="lg:col-span-2 flex flex-col gap-5 lg:border-r lg:border-white/10 lg:pr-10">
                      {/* Logo */}
                      {item.logoImage && (
                        <div>
                          <ImageFallback
                            src={item.logoImage}
                            width={120}
                            height={60}
                            alt="logo"
                            className="max-h-[60px] w-auto opacity-60 hover:opacity-100 transition-opacity"
                          />
                        </div>
                      )}

                      {/* Project title */}
                      <h3 className="text-lg font-semibold text-white">{item.projectTitle}</h3>

                      {/* Description */}
                      <p className="text-white/60 leading-relaxed">{item.description}</p>

                      {/* Person info */}
                      <div className="flex items-center gap-3 mt-auto pt-5 border-t border-white/10">
                        <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex-shrink-0">
                          <ImageFallback
                            src={item.personImage}
                            width={70}
                            height={70}
                            alt={item.personName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-white text-lg">{item.personName}</p>
                          <p className="text-white/60 text-sm">{item.personRole}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right — 1/3 satisfaction */}
                    <div className="flex flex-wrap items-center content-center gap-3 lg:pl-8">
                      <div className="w-full">
                        <p className="text-white text-2xl font-semibold mb-2">{item.satisfactionLabel}</p>
                        <div className="text-gold text-[50px] font-bold leading-none">
                          <Counter end={item.satisfactionPercent} suffix="%" start={0} />
                        </div>
                        <p className="text-gold text-lg font-semibold mt-2 inline-block">
                          {item.satisfactionDesc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div
            id={`review-pagination-${uniqueId}`}
            className="flex justify-center gap-2 mt-8"
          />
        </div>
      </div>

      <style>{`
        #review-pagination-${uniqueId} .swiper-pagination-bullet {
          background: rgba(255,255,255,0.5);
          opacity: 1;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          display: inline-block;
          cursor: pointer;
          transition: all 0.3s;
        }
        #review-pagination-${uniqueId} .swiper-pagination-bullet-active {
          background: #ffffff;
          width: 24px;
        }
      `}</style>
    </section>
  );
}
