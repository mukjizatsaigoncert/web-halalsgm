import CertificationApplicationForm from "@/components/CertificationApplicationForm";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";

export default async function NopHoSoChungNhanPage({
  searchParams,
}: {
  searchParams: Promise<{ loai?: string }>;
}) {
  const { loai } = await searchParams;
  const defaultApplicationType = loai === "quoc-te" ? "international" : "domestic";

  return (
    <>
      <SeoMeta
        title="Nộp hồ sơ đăng ký chứng nhận Halal"
        meta_title="Nộp hồ sơ đăng ký chứng nhận Halal - SaigonCert"
        description="Nộp hồ sơ đăng ký chứng nhận Halal trực tuyến cho doanh nghiệp trong nước và quốc tế."
      />
      <PageHeader title="Nộp hồ sơ đăng ký chứng nhận Halal" />
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <CertificationApplicationForm defaultApplicationType={defaultApplicationType} />
        </div>
      </section>
    </>
  );
}
