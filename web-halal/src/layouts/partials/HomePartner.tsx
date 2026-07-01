import ImageFallback from "@/helpers/ImageFallback";

interface Partner {
  name: string;
  logo: string;
}

interface HomePartnerProps {
  partners: Partner[];
}

export default function HomePartner({ partners }: HomePartnerProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 xl:max-w-[1290px]">
        <div className="flex flex-wrap items-center justify-center gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex-[0_0_calc(100%/3-2rem)] md:flex-[0_0_calc(100%/6-2rem)] flex items-center justify-center"
            >
              <ImageFallback
                src={partner.logo}
                width={140}
                height={80}
                alt={partner.name}
                className="max-h-[80px] w-auto object-contain opacity-30 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
