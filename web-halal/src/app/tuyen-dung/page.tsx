import { fetchAllCareers, getWorkingTimeLabel } from "@/lib/strapi/api/careers";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import Link from "next/link";

// Revalidate route mỗi 60 giây
export const revalidate = 60;

const TuyenDungPage = async () => {
  // Fetch careers từ Strapi
  const careersData = await fetchAllCareers();
  const careers = careersData.data;

  // Nội dung trang
  const pageContent = {
    title: "Tuyển Dụng",
    meta_title: "Tuyển Dụng | SaigonCert",
    description:
      "Gia nhập đội ngũ của chúng tôi - Nơi bạn có thể phát triển sự nghiệp trong lĩnh vực chứng nhận Halal, ISO và giám định hàng hóa.",
  };

  // Thông tin liên hệ tuyển dụng
  const contactInfo = {
    hotline: ["0918545332", "0968972331"],
    email: "knknpb9999@gmail.com",
    address:
      "Số 139 Man Thiện, Phường Hiệp Phú, Thành phố Thủ Đức, TP Hồ Chí Minh",
  };

  return (
    <>
      <SeoMeta
        title={pageContent.title}
        meta_title={pageContent.meta_title}
        description={pageContent.description}
      />
      <PageHeader title={pageContent.title} />

      <section className="section">
        <div className="container">
          <div className="row justify-between g-8">
            {/* Cột trái - Thông tin công ty */}
            <div
              data-aos="fade-right"
              data-aos-delay="150"
              className="lg:col-5"
            >
              <div className="sticky top-32">
                <h2 className="h3 mb-4 text-primary">
                  Cơ Hội Nghề Nghiệp Tại Chúng Tôi
                </h2>
                <p className="text-lg text-body-color mb-8 leading-relaxed">
                  SaigonCert luôn tìm kiếm những nhân tài có đam mê trong lĩnh
                  vực chứng nhận Halal, ISO và giám định hàng hóa. Hãy gia
                  nhập đội ngũ của chúng tôi để cùng nhau phát triển!
                </p>

                {/* Thông tin liên hệ HR */}
                <div className="bg-light rounded-2xl p-6 mb-6">
                  <h4 className="h5 mb-4 text-primary">
                    📋 Liên Hệ Phòng Nhân Sự
                  </h4>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">📞</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-600 mb-1">
                          Hotline tuyển dụng
                        </p>
                        {contactInfo.hotline.map((phone, index) => (
                          <Link
                            key={index}
                            href={`tel:${phone}`}
                            className="block text-primary hover:text-primary/80 font-medium"
                          >
                            {phone}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-xl">✉️</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-600 mb-1">
                          Email ứng tuyển
                        </p>
                        <Link
                          href={`mailto:${contactInfo.email}`}
                          className="text-primary hover:text-primary/80 font-medium break-all"
                        >
                          {contactInfo.email}
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-xl">📍</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-600 mb-1">
                          Địa chỉ văn phòng
                        </p>
                        <p className="text-body-color">{contactInfo.address}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lý do gia nhập */}
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20">
                  <h4 className="h5 mb-4 text-primary">
                    ✨ Tại Sao Chọn Chúng Tôi?
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Môi trường làm việc năng động, sáng tạo",
                      "Cơ hội phát triển nghề nghiệp rõ ràng",
                      "Chế độ đãi ngộ cạnh tranh",
                      "Được làm việc với các dự án lớn",
                      "Đào tạo và nâng cao kỹ năng liên tục",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        <span className="text-body-color">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Cột phải - Danh sách vị trí */}
            <div className="lg:col-7">
              <div className="flex items-center justify-between mb-6">
                <h3 className="h4">Vị Trí Đang Tuyển</h3>
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  {careers.length} vị trí
                </span>
              </div>

              {careers.length > 0 ? (
                <div className="space-y-4">
                  {careers.map((career, index) => (
                    <Link
                      key={career.documentId}
                      href={`/tuyen-dung/${career.documentId}`}
                      data-aos="fade-up-sm"
                      data-aos-delay={index * 50 + 150}
                      className="block bg-white border border-border rounded-xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h4 className="h5 mb-2 group-hover:text-primary transition-colors">
                            {career.name}
                          </h4>
                          {career.description && (
                            <p className="text-body-color line-clamp-2 mb-3">
                              {career.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                              ⏰ {getWorkingTimeLabel(career.workingTime)}
                            </span>
                            <span className="text-sm text-gray-500">
                              Đăng ngày:{" "}
                              {new Date(career.publishedAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                          <span className="text-primary group-hover:text-white">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-light rounded-2xl p-12 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h4 className="h5 mb-2">Chưa có vị trí tuyển dụng</h4>
                  <p className="text-body-color">
                    Hiện tại chúng tôi chưa có vị trí nào đang tuyển. Vui lòng
                    quay lại sau hoặc gửi CV để chúng tôi liên hệ khi có vị trí
                    phù hợp.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TuyenDungPage;
