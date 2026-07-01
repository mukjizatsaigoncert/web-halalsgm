import { getListPage } from "@/lib/contentParser";
import FAQs from "@/partials/FAQs";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { Faqs } from "@/types";

export default function FaqsPage() {
  const faqsData = getListPage<Faqs["frontmatter"]>("faqs/_index.md");
  return (
    <>
      <SeoMeta {...faqsData.frontmatter} />
      <PageHeader title={faqsData.frontmatter.title} />
      <FAQs faqsData={faqsData} />
    </>
  );
}
