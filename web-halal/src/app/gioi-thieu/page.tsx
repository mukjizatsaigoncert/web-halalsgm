import SeoMeta from "@/partials/SeoMeta";
import PageHeader from "@/partials/PageHeader";
import HomeAbout1 from "@/partials/HomeAbout1";
import HomeMarquee from "@/partials/HomeMarquee";
import HomePolicy from "@/partials/HomePolicy";
import HomeAbout2 from "@/partials/HomeAbout2";
import HomeReview from "@/partials/HomeReview";
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

const MILESTONES = [
  {
    image: "/images/halal/news-4.jpg",
    title: "Nghị định 127/2026/NĐ-CP",
    description: "Hành lang pháp lý toàn diện đầu tiên cho quản lý chất lượng, phát triển sản phẩm và dịch vụ Halal tại Việt Nam",
    href: "/projects",
  },
  {
    image: "/images/halal/news-5.jpg",
    title: "Hợp tác Việt Nam - Qatar - UAE",
    description: "Thúc đẩy tiềm năng chinh phục thị trường Halal Trung Đông của nông sản, thực phẩm Việt",
    href: "/projects",
  },
  {
    image: "/images/halal/news-6.jpg",
    title: "Kết nối cộng đồng Halal quốc tế",
    description: "Tham dự sự kiện giao lưu văn hóa, thúc đẩy hợp tác thương mại Halal với các đối tác Trung Đông",
    href: "/projects",
  },
];

const TESTIMONIALS = [
  {
    projectTitle: "Chứng nhận Halal cho lô hàng xuất khẩu",
    description:
      "Đội ngũ chuyên nghiệp, tận tâm. Chúng tôi rất hài lòng với quy trình đánh giá và cấp chứng nhận Halal của SaigonCert. Hồ sơ được hướng dẫn rõ ràng, đúng tiến độ.",
    personImage: "/images/custom/tru-so-chinh.jpg",
    personName: "Nguyễn Văn An",
    personRole: "Giám đốc Chất lượng, doanh nghiệp thực phẩm xuất khẩu",
    satisfactionPercent: 100,
    satisfactionLabel: "Hài lòng",
    satisfactionDesc: "Chất lượng dịch vụ vượt mong đợi, đội ngũ đánh giá khách quan và chuyên nghiệp.",
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

      <HomeMarquee text="Uy Tín - Chính Xác - Trách Nhiệm." />

      <HomePolicy items={VALUES} />

      <HomeAbout2
        heading="Đồng hành cùng doanh nghiệp Việt vươn ra thị trường"
        headingHighlight="Halal quốc tế"
        description="Từ hành lang pháp lý mới cho ngành Halal đến hợp tác thương mại với Qatar, UAE - SaigonCert luôn đồng hành cùng những bước tiến của ngành."
        ctaLabel="Liên hệ tư vấn"
        ctaLink="/lien-he"
        projects={MILESTONES}
      />

      <HomeReview heading={"Khách hàng nói về\nchúng tôi"} items={TESTIMONIALS} />

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
