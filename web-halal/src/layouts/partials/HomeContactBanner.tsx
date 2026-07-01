import Link from "next/link";

interface HomeContactBannerProps {
  heading?: string;
  ctaLabel?: string;
  ctaLink?: string;
  bgImage?: string;
  bgImageMobile?: string;
}

export default function HomeContactBanner({
  heading = "Khởi đầu cho không gian sống chất lượng cao",
  ctaLabel = "Liên hệ ngay",
  ctaLink = "/lien-he",
  bgImage = "/images/custom/anh3.jpg",
  bgImageMobile,
}: HomeContactBannerProps) {
  return (
    <section className="relative py-0 overflow-hidden">
      {/* Responsive image */}
      <picture>
        {bgImageMobile && (
          <source media="(max-width: 767px)" srcSet={bgImageMobile} />
        )}
        <source media="(min-width: 768px)" srcSet={bgImage} />
        {/* ponytail: img as fallback for picture */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgImage}
          alt={heading}
          className="w-full rounded-2xl object-cover max-h-[600px]"
        />
      </picture>

      {/* Centered overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-10 leading-tight">
            {heading}
          </h2>
          <Link
            href={ctaLink}
            className="inline-block px-8 py-5 bg-secondary text-white font-semibold text-base rounded-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
