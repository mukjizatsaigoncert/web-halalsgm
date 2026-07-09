import SeoMeta from "@/partials/SeoMeta";
import PageHeader from "@/partials/PageHeader";
import HomeAbout1 from "@/partials/HomeAbout1";
import HomePolicy from "@/partials/HomePolicy";
import HomeTeam from "@/partials/HomeTeam";
import HomeContactBanner from "@/partials/HomeContactBanner";

const VALUES = [
  {
    image: "/images/halal/svc-1.webp",
    title: "Uy tín",
    description: "Được công nhận bởi các tổ chức quốc tế: GAC, World Halal Council, JAKIM, EIACI.",
  },
  {
    image: "/images/halal/svc-4.webp",
    title: "Chính xác",
    description: "Quy trình đánh giá, thử nghiệm khách quan, tuân thủ nghiêm ngặt tiêu chuẩn quốc tế.",
  },
  {
    image: "/images/halal/svc-7.webp",
    title: "Trách nhiệm",
    description: "Cam kết đúng tiến độ, đồng hành cùng khách hàng đến khi hoàn tất chứng nhận.",
  },
];

const TEAM = [
  { name: "Nguyễn Văn Long", role: "Giám đốc điều hành", image: "/images/custom/anh1.jpg" },
  { name: "Trần Thị Hoa", role: "Trưởng phòng Chứng nhận Halal", image: "/images/custom/anh2.jpg" },
  { name: "Lê Minh Tuấn", role: "Trưởng phòng Chứng nhận ISO", image: "/images/custom/anh3.jpg" },
  { name: "Phạm Quỳnh Anh", role: "Trưởng phòng Giám định", image: "/images/custom/anh4.jpg" },
];

export default function GioiThieuPage() {
  return (
    <>
      <SeoMeta
        title="Giới Thiệu - SaigonCert"
        meta_title="Giới Thiệu - Công ty Cổ phần Chứng nhận và Giám định SaigonCert"
        description="Uy tín, Chính xác, Trách nhiệm – SaigonCert cung cấp dịch vụ chứng nhận Halal, ISO và giám định hàng hóa cho doanh nghiệp Việt Nam."
      />
      <PageHeader title="Giới thiệu" />

      <HomeAbout1
        tag="Về chúng tôi"
        heading="Công ty Cổ phần Chứng nhận và Giám định SaigonCert"
        description="SaigonCert được cấp phép hoạt động trong lĩnh vực chứng nhận, thử nghiệm, giám định, khử trùng và kiểm soát côn trùng. Chúng tôi là tổ chức chứng nhận hợp quy thức ăn chăn nuôi, đồng thời cung cấp dịch vụ chứng nhận Halal được công nhận bởi các tổ chức quốc tế như GAC, World Halal Council, JAKIM và EIACI, giúp doanh nghiệp Việt Nam đáp ứng tiêu chuẩn chất lượng và mở rộng thị trường xuất khẩu."
        image1="/images/halal/about-1.png"
        image2="/images/halal/about-2.jpeg"
      />

      <HomePolicy items={VALUES} />

      <HomeTeam
        tag="Đội ngũ của chúng tôi"
        heading="Về chúng tôi"
        description="Đội ngũ chuyên gia giàu kinh nghiệm trong chứng nhận Halal, ISO và giám định chất lượng."
        members={TEAM}
      />

      <HomeContactBanner
        heading="Sẵn sàng chứng nhận sản phẩm của bạn?"
        ctaLabel="Liên hệ ngay"
        ctaLink="/lien-he"
        bgImage="/images/halal/contact.png"
      />
    </>
  );
}
