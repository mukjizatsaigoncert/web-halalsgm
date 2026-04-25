import GalleryCard from "@/components/GalleryCard";
import { getListPage } from "@/lib/contentParser";
import SeoMeta from "@/partials/SeoMeta";
import type { GalleryPage } from "@/types";

export default function GalleryPage() {
  const galleryIndex =
    getListPage<GalleryPage["frontmatter"]>("gallery/_index.md");

  return (
    <>
      <SeoMeta {...galleryIndex.frontmatter} />
      <section className="section">
        <div className="container">
          <div className="md:columns-2 gap-x-[150px]">
            {galleryIndex.frontmatter.gallery_images?.map((item, i) => (
              <GalleryCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
