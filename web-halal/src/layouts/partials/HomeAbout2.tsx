"use client";

import Link from "next/link";
import { useState } from "react";

interface ProjectItem {
  image: string;
  title: string;
  description: string;
  href?: string;
}

interface HomeAbout2Props {
  heading: string;
  headingHighlight?: string;
  description: string;
  ctaLabel?: string;
  ctaLink?: string;
  projects: ProjectItem[];
}

export default function HomeAbout2({
  heading = "Xây dựng một tương lai tốt đẹp hơn thông qua",
  headingHighlight = "sự chính trực và đổi mới",
  description = "Chúng tôi cung cấp các giải pháp bền vững, chất lượng cao. Xây dựng những công trình sáng tạo, góp phần nâng cao chất lượng cộng đồng và cải thiện cuộc sống.",
  ctaLabel = "Liên hệ tư vấn",
  ctaLink = "/lien-he",
  projects = [],
}: Partial<HomeAbout2Props>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = projects.length;

  return (
    <section className="py-20 md:py-28 bg-primary text-white overflow-hidden">
      <div className="container mx-auto px-4 xl:max-w-[1290px]">
        {/* Heading — max 65% width on desktop */}
        <div data-aos="fade-up-sm" data-aos-delay="0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight lg:max-w-[65%] text-white">
            {heading}{" "}
            <span className="opacity-60">{headingHighlight}</span>
            {", tận tâm vì sự xuất sắc"}
          </h2>
        </div>

        {/* Description + CTA — offset right half on desktop */}
        <div className="flex justify-end mt-8 mb-14" data-aos="fade-up-sm" data-aos-delay="150">
          <div className="lg:w-1/2 flex flex-col gap-6">
            <p className="text-white/60 leading-relaxed">{description}</p>
            <div>
              <Link
                href={ctaLink ?? "/lien-he"}
                className="inline-block px-7 py-3.5 bg-secondary text-white font-semibold text-sm rounded-lg hover:opacity-90 transition-opacity"
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Project cards — full bleed, accordion on desktop */}
      {projects.length > 0 && (
        <div
          data-aos="fade-up-sm"
          data-aos-delay="200"
          className="px-[50px]"
        >
          {/* Desktop accordion */}
          <div className="hidden lg:flex gap-[10px]">
            {projects.map((project, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  style={{
                    flex: isActive
                      ? `0 0 calc(${count === 3 ? "70%" : "80%"} - 20px)`
                      : `0 0 ${count === 3 ? "15%" : "20%"}`,
                    transition: "flex 0.5s ease-in-out",
                  }}
                  className="relative overflow-hidden rounded-2xl cursor-pointer"
                >
                  <Link href={project.href ?? "#"}>
                    {/* BG image via inline style */}
                    <div
                      style={{
                        height: 730,
                        backgroundImage: `url(${project.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: 16,
                        overflow: "hidden",
                      }}
                    />
                    {/* Detail — fade in when active */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-8 transition-opacity duration-500"
                      style={{ opacity: isActive ? 1 : 0 }}
                    >
                      <h3 className="text-white font-bold text-xl mb-1">{project.title}</h3>
                      <p className="text-white/60 text-sm">{project.description}</p>
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl pointer-events-none" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Mobile — simple stack */}
          <div className="lg:hidden grid grid-cols-1 gap-4">
            {projects.map((project, i) => (
              <Link
                key={i}
                href={project.href ?? "#"}
                className="group relative overflow-hidden rounded-2xl block"
              >
                <div
                  style={{
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: 300,
                    borderRadius: 16,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-2xl" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-lg mb-1">{project.title}</h3>
                  <p className="text-white/60 text-sm">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
