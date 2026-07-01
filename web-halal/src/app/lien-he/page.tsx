import ContactForm from "@/components/ContactForm";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import Link from "next/link";

const LienHePage = () => {
  // Nội dung cho Trung tâm Điện ảnh và Truyền hình Sài Gòn
  const pageContent = {
    title: "Liên Hệ Hợp Tác",
    meta_title: "Liên Hệ | Trung Tâm Điện Ảnh và Truyền Hình Sài Gòn",
    description:
      "Hãy liên hệ với chúng tôi để được tư vấn về các giải pháp truyền thông, sản xuất phim, quảng cáo và marketing online hiệu quả cho doanh nghiệp của bạn.",
  };

  // Thông tin liên hệ
  const contactInfo = {
    hotline: ["0918545332", "0968972331", "0793827777"],
    email: "knknpb9999@gmail.com",
    offices: [
      {
        name: "Trụ sở chính",
        address:
          "Số 139 Man Thiện, Phường Hiệp Phú, Thành phố Thủ Đức, TP Hồ Chí Minh",
      },
      {
        name: "VPGD phía Nam",
        address:
          "Tòa Nhà Linco 61A-63A Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh",
      },
      {
        name: "VPGD phía Bắc",
        address:
          "Số 6 ngõ 95 Chùa Bộc, Phường Trung Liệt, Quận Đống Đa, Tp.Hà Nội",
      },
      {
        name: "VPGD Cần Thơ",
        address: "05 Tổ 1- KV1, P. Hưng Phú, Q. Cái Răng, TP. Cần Thơ",
      },
    ],
  };

  return (
    <>
      <SeoMeta
        title={pageContent.title}
        meta_title={pageContent.meta_title}
        description={pageContent.description}
      />
      <PageHeader title={pageContent.title} isContactPage />
      <section className="-mt-[45%] sm:-mt-[30%] md:-mt-[25%] lg:-mt-[40%] xl:-mt-[30%] 2xl:-mt-[23%]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 justify-center lg:justify-between">
            {/* Form liên hệ */}
            <div className="lg:w-[52%]">
              <ContactForm
                title={pageContent.title}
                description={pageContent.description}
              />
            </div>

            {/* Thông tin liên hệ */}
            <div className="lg:w-[44%] lg:mt-auto lg:pb-14 z-30">
              {/* Card chính */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  className="h4 mb-6 text-primary"
                >
                  Bạn cần gặp trực tiếp chúng tôi
                </h3>

                {/* Danh sách văn phòng */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.offices.map((office, index) => (
                    <div
                      key={index}
                      data-aos="fade-up-sm"
                      data-aos-delay={200 + index * 50}
                      className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-xl border-l-4 border-primary hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-bold text-primary mb-2 text-sm">
                        📍 {office.name}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {office.address}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Hotline & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div
                    data-aos="fade-up-sm"
                    data-aos-delay="400"
                    className="bg-primary/10 p-5 rounded-xl border border-primary/20"
                  >
                    <h4 className="font-bold text-primary mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                      <span className="text-lg">📞</span> Hotline
                    </h4>
                    <div className="space-y-2">
                      {contactInfo.hotline.map((phone, index) => (
                        <Link
                          key={index}
                          href={`tel:${phone}`}
                          className="block text-gray-700 hover:text-primary transition-colors text-base font-medium"
                        >
                          {phone}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div
                    data-aos="fade-up-sm"
                    data-aos-delay="450"
                    className="bg-amber-50 p-5 rounded-xl border border-amber-200"
                  >
                    <h4 className="font-bold text-amber-700 mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                      <span className="text-lg">✉️</span> Email
                    </h4>
                    <Link
                      href={`mailto:${contactInfo.email}`}
                      className="text-gray-700 hover:text-amber-600 transition-colors text-base font-medium break-all"
                    >
                      {contactInfo.email}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="section">
        <div className="container">
          <div
            data-aos="fade-up-sm"
            data-aos-delay="100"
            className="w-full h-[350px] md:h-[450px] rounded-lg overflow-hidden shadow-lg"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4481375371165!2d106.78420038470365!3d10.853479730195358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175276b8d8877db%3A0x5b1621914f4028fd!2zMTM5IMSQLiBNYW4gVGhp4buHbiwgUGjGsOG7nW5nIFTDom4gUGjDuiwgUXXhuq1uIDksIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1685505883227!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Trung tâm Điện ảnh và Truyền hình Sài Gòn - Bản đồ"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default LienHePage;
