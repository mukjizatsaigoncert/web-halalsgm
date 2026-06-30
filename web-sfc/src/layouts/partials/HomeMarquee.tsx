interface HomeMarqueeProps {
  text?: string;
  repeat?: number;
}

export default function HomeMarquee({
  text = "Future-Focused Construction Solutions.",
  repeat = 3,
}: HomeMarqueeProps) {
  return (
    <section className="py-10 bg-[#0d3d1f] overflow-hidden">
      <div className="overflow-hidden whitespace-nowrap w-full">
        <div className="inline-flex gap-8 animate-marquee-uc">
          {Array.from({ length: repeat * 2 }).map((_, i) => (
            <span
              key={i}
              className="inline-block text-[#c8a850] text-[60px] md:text-[100px] lg:text-[160px] font-bold uppercase leading-none flex-shrink-0"
            >
              {text}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-uc {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee-uc {
          animation: marquee-uc 50s linear infinite;
          width: max-content;
        }
      `}</style>
    </section>
  );
}
