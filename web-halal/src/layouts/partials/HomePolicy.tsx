import ImageFallback from "@/helpers/ImageFallback";

interface PolicyItem {
  image: string;
  title: string;
  description: string;
}

interface HomePolicyProps {
  items: PolicyItem[];
}

export default function HomePolicy({ items }: HomePolicyProps) {
  return (
    <section className="py-20 md:py-28 bg-white border-t border-border">
      <div className="container mx-auto px-4 xl:max-w-[1290px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex gap-5 items-start"
              data-aos="fade-up-sm"
              data-aos-delay={i * 200}
            >
              {/* Icon box — 90×90, bg color + 10% overlay */}
              <div className="relative flex-shrink-0 w-[90px] h-[90px] rounded-xl overflow-hidden flex items-center justify-center text-secondary">
                <span className="absolute inset-0 bg-current opacity-10" />
                {/* ponytail: source icons are pre-colored forest-green raster assets;
                    hue-rotate shifts them onto the current cyan theme without new art.
                    Re-export the icons in cyan (or as currentColor SVGs) to remove this. */}
                <ImageFallback
                  src={item.image}
                  width={40}
                  height={40}
                  alt={item.title}
                  className="relative z-10 max-w-[40px] max-h-[40px] w-auto h-auto object-contain"
                  style={{ filter: "hue-rotate(40deg) saturate(1.4)" }}
                />
              </div>
              <div>
                <h3 className="font-bold text-dark text-xl mb-2">{item.title}</h3>
                <p className="text-text/60 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
