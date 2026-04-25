import SeoMeta from "@/partials/SeoMeta";
import PageHeader from "@/partials/PageHeader";
import SocialShare from "@/components/SocialShare";
import config from "@/config/config.json";

export default function GioiThieuPage() {
  const title = "Giới Thiệu";
  const pageUrl = `${config.site.base_url}/gioi-thieu`;

  return (
    <>
      <SeoMeta
        title="Giới Thiệu - Trung Tâm Điện Ảnh và Truyền Hình Sài Gòn"
        meta_title="Giới Thiệu - Trung Tâm Điện Ảnh và Truyền Hình Sài Gòn"
        description="Chuyên nghiệp, Sáng tạo, Trách nhiệm – Đó là những gì chúng tôi sẽ mang lại cho khách hàng."
      />
      <PageHeader title={title} />

      <section className="section">
        <div className="container">
          <div className="row justify-center">
            <div className="col-11 lg:col-10">
              {/* Article Header */}
              <div data-aos="fade-up-sm" data-aos-delay="100" className="mb-12">
                <h2 className="h2 text-primary font-bold leading-tight mb-6 text-center lg:text-left">
                  TRUNG TÂM ĐIỆN ẢNH VÀ TRUYỀN HÌNH SÀI GÒN HỢP TÁC CÙNG PHÁT
                  TRIỂN
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-body-color text-sm border-b border-border pb-6">
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    09:49 - 15/07/2022
                  </span>
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    Giới thiệu
                  </span>
                </div>
              </div>

              {/* Content Section 1 */}
              <div data-aos="fade-up-sm" data-aos-delay="150" className="mb-10">
                <p className="text-lg font-semibold text-primary mb-4 italic border-l-4 border-primary pl-4">
                  Chuyên nghiệp, Sáng tạo, Trách nhiệm – Đó là những gì chúng
                  tôi sẽ mang lại cho khách hàng.
                </p>
                <p className="text-body-color leading-relaxed text-justify">
                  Chúng tôi cung cấp đa dạng các giải pháp online – offline
                  marketing uy tín dựa trên ngân sách phù hợp cho từng dự án quy
                  mô lớn nhỏ khác nhau. Cùng đội ngũ lãnh đạo kinh nghiệm và
                  nhân sự &ldquo;đa-zi-năng&rdquo;, ngoài giải pháp về online
                  marketing, chúng tôi còn cung cấp các dịch vụ tiếp thị trọn
                  gói thuộc &ldquo;Below The Line Marketing Activities&rdquo;
                  bao gồm: Tổ chức sự kiện – hội nghị, chiến dịch kích hoạt
                  thương hiệu, kích hoạt bán hàng, tiếp thị trực tiếp và các
                  dịch vụ quảng cáo khác.
                </p>
              </div>

              {/* Divider */}
              <div data-aos="fade-up-sm" data-aos-delay="200" className="my-12">
                <hr className="border-border" />
              </div>

              {/* Content Section 2 */}
              <div data-aos="fade-up-sm" data-aos-delay="250" className="mb-10">
                <p className="text-lg font-semibold text-primary mb-4 italic border-l-4 border-primary pl-4">
                  Chuyên nghiệp, Sáng tạo, Trách nhiệm – Đó là những gì chúng
                  tôi sẽ mang lại cho khách hàng.
                </p>
                <p className="text-body-color leading-relaxed text-justify">
                  Chúng tôi cung cấp đa dạng các giải pháp online – offline
                  marketing uy tín dựa trên ngân sách phù hợp cho từng dự án quy
                  mô lớn nhỏ khác nhau. Cùng đội ngũ lãnh đạo kinh nghiệm và
                  nhân sự &ldquo;đa-zi-năng&rdquo;, ngoài giải pháp về online
                  marketing, chúng tôi còn cung cấp các dịch vụ tiếp thị trọn
                  gói thuộc &ldquo;Below The Line Marketing Activities&rdquo;
                  bao gồm: Tổ chức sự kiện – hội nghị, chiến dịch kích hoạt
                  thương hiệu, kích hoạt bán hàng, tiếp thị trực tiếp và các
                  dịch vụ quảng cáo khác.
                </p>
              </div>

              {/* Social Share Section */}
              <div
                data-aos="fade-up-sm"
                data-aos-delay="300"
                className="mt-16 pt-10 border-t border-border"
              >
                <SocialShare
                  url={pageUrl}
                  title="Giới Thiệu - Trung Tâm Điện Ảnh và Truyền Hình Sài Gòn"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
