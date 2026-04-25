import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import { GalleryImage } from "@/types";

export default function GalleryCard({
  item,
  index,
}: {
  item: GalleryImage;
  index: number;
}) {
  return (
    <div
      data-aos="fade-up-sm"
      data-aos-delay={index * 100 + 100}
      className="relative mb-[7rem] lg:mb-[12rem] last:mb-0 group max-md:w-[80%] mx-auto pb-16"
    >
      <div className="overflow-hidden">
        <ImageFallback
          src={item.image}
          width={800}
          height={600}
          priority={index < 2} // Load first two images with priority
          loading={index < 2 ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL={item.image}
          alt={item.designer}
          className="group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>

      <div className="absolute bottom-0 left-0 w-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex flex-wrap items-center justify-between gap-2 pt-8">
        <h3
          className="h5 font-medium"
          dangerouslySetInnerHTML={markdownify(item.design)}
        />
        <p dangerouslySetInnerHTML={markdownify(item.designer)} />
      </div>
    </div>
  );
}
