"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { useState } from "react";

interface ServiceTab {
  label: string;
  image: string;
}

interface HomeServicesProps {
  tag?: string;
  heading: string;
  tabs: ServiceTab[];
  bgImage?: string;
}

export default function HomeServices({
  tag = "Chúng tôi cung cấp",
  heading = "Dịch vụ chất lượng cao để đáp ứng nhu cầu dự án của bạn",
  tabs,
  bgImage,
}: HomeServicesProps) {
  const [active, setActive] = useState(0);

  return (
    <section
      className="py-20 md:py-28 bg-white text-[#1A1A1A]"
      style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
    >
      <div className="container mx-auto px-4 xl:max-w-[1290px]">
        {/* Service heading — 65% + 35% */}
        <div
          className="flex flex-col lg:flex-row lg:items-end gap-5 lg:gap-10 mb-10"
          data-aos="fade-up-sm"
        >
          <div className="lg:flex-[0_0_65%]">
            <p className="text-[#1A1A1A]/60 text-sm font-semibold uppercase tracking-widest mb-3">
              {tag}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight m-0">
              {heading}
            </h2>
          </div>
        </div>

        {/* Service tab — 30% nav + 70% image */}
        <div
          className="flex flex-col lg:flex-row lg:items-start gap-7 lg:gap-8"
          data-aos="fade-up-sm"
          data-aos-delay="150"
        >
          {/* Tabs nav */}
          <nav className="lg:flex-[0_0_30%] lg:max-w-[30%]">
            {tabs.map((tab, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-full text-left text-xl font-semibold py-[18px] px-0 border-b transition-colors duration-200 ${
                  i === 0 ? "border-t border-[#1A1A1A]/20" : ""
                } ${
                  active === i
                    ? "text-[#1A1A1A] border-b-[#1A1A1A]"
                    : "text-[#1A1A1A]/60 border-b-[#1A1A1A]/20 hover:text-[#1A1A1A]"
                }`}
                style={{ borderTopColor: i === 0 ? "rgba(33,32,30,0.2)" : undefined }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Image area */}
          <div className="lg:flex-[0_0_calc(70%-2rem)] relative overflow-hidden rounded-2xl aspect-[16/9] lg:aspect-auto lg:min-h-[400px]">
            {tabs.map((tab, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  active === i ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <ImageFallback
                  src={tab.image}
                  fill
                  alt={tab.label}
                  className="object-cover rounded-2xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
