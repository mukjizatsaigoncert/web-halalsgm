import config from "@/config/config.json";
import {
  fetchCareerById,
  fetchAllCareerIds,
  getWorkingTimeLabel,
} from "@/lib/strapi/api/careers";
import { markdownify } from "@/lib/utils/textConverter";
import CallToAction from "@/partials/CallToAction";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import Link from "next/link";
import { notFound } from "next/navigation";

// Revalidate route mỗi 60 giây
export const revalidate = 60;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const TuyenDungDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;

  // Fetch career từ Strapi
  const career = await fetchCareerById(id);

  if (!career) {
    notFound();
  }

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
        title={`${career.name} | Tuyển Dụng`}
        meta_title={`${career.name} | Tuyển Dụng - SaigonCert`}
        description={career.description || `Ứng tuyển vị trí ${career.name}`}
      />
      <PageHeader title={career.name} />

      <section className="section">
        <div className="container">
          <div className="row justify-between g-8">
            {/* Cột trái - Chi tiết công việc */}
            <div className="lg:col-8">
              {/* Badges */}
              <div
                data-aos="fade-up-sm"
                data-aos-delay="100"
                className="flex items-center gap-3 flex-wrap mb-6"
              >
                <span className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                  ⏰ {getWorkingTimeLabel(career.workingTime)}
                </span>
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  📅 Đăng ngày:{" "}
                  {new Date(career.publishedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>

              {/* Mô tả ngắn */}
              {career.description && (
                <div
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8"
                >
                  <p className="text-lg text-body-color leading-relaxed">
                    {career.description}
                  </p>
                </div>
              )}

              {/* Chi tiết công việc (Markdown) */}
              {career.detailInfo && (
                <div
                  data-aos="fade-up-sm"
                  data-aos-delay="200"
                  className="bg-white rounded-xl border border-border p-8"
                >
                  <h3 className="h4 mb-6 text-primary border-b border-border pb-4">
                    📋 Chi Tiết Công Việc
                  </h3>
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-primary prose-strong:text-gray-800"
                    dangerouslySetInnerHTML={
                      markdownify(career.detailInfo, true) as { __html: string }
                    }
                  />
                </div>
              )}

              {/* Nút quay lại */}
              <div data-aos="fade-up-sm" data-aos-delay="250" className="mt-8">
                <Link
                  href="/tuyen-dung"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                >
                  ← Quay lại danh sách tuyển dụng
                </Link>
              </div>
            </div>

            {/* Cột phải - Thông tin ứng tuyển */}
            <div className="lg:col-4">
              <div className="sticky top-32 space-y-6">
                {/* Card ứng tuyển */}
                <div
                  data-aos="fade-left"
                  data-aos-delay="150"
                  className="bg-primary text-white rounded-2xl p-6"
                >
                  <h4 className="h5 mb-4">🚀 Ứng Tuyển Ngay</h4>
                  <p className="text-white/80 mb-4">
                    Gửi CV đến email tuyển dụng của chúng tôi:
                  </p>

                  {/* Email hiển thị rõ ràng */}
                  <div className="bg-white/20 rounded-lg p-3 mb-4">
                    <p className="text-sm text-white/70 mb-1">Email nhận CV:</p>
                    <p className="font-bold text-lg break-all">
                      {contactInfo.email}
                    </p>
                  </div>

                  {/* Các nút hành động */}
                  <div className="space-y-2">
                    {/* Mở Gmail trực tiếp */}
                    <Link
                      href={`https://mail.google.com/mail/?view=cm&to=${contactInfo.email}&su=${encodeURIComponent(`[Ứng tuyển] ${career.name}`)}&body=${encodeURIComponent(`Kính gửi Phòng Nhân Sự,\n\nTôi xin gửi CV ứng tuyển vị trí: ${career.name}\n\nThông tin cá nhân:\n- Họ và tên: \n- Số điện thoại: \n- Email: \n\nTôi xin đính kèm CV trong email này.\n\nTrân trọng,`)}`}
                      target="_blank"
                      className="btn bg-white text-primary hover:bg-white/90 w-full justify-center"
                    >
                      📧 Gửi qua Gmail
                    </Link>
                  </div>
                </div>

                {/* Thông tin liên hệ */}
                <div
                  data-aos="fade-left"
                  data-aos-delay="200"
                  className="bg-light rounded-2xl p-6"
                >
                  <h4 className="h5 mb-4 text-primary">
                    📞 Liên Hệ Phòng Nhân Sự
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-sm text-gray-600 mb-2">
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

                    <div>
                      <p className="font-semibold text-sm text-gray-600 mb-2">
                        Email
                      </p>
                      <Link
                        href={`mailto:${contactInfo.email}`}
                        className="text-primary hover:text-primary/80 font-medium break-all"
                      >
                        {contactInfo.email}
                      </Link>
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-gray-600 mb-2">
                        Địa chỉ phỏng vấn
                      </p>
                      <p className="text-body-color text-sm">
                        {contactInfo.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chia sẻ */}
                <div
                  data-aos="fade-left"
                  data-aos-delay="250"
                  className="bg-white border border-border rounded-2xl p-6"
                >
                  <h4 className="font-semibold mb-3">
                    📤 Chia sẻ tin tuyển dụng
                  </h4>
                  <p className="text-sm text-body-color mb-4">
                    Giới thiệu cơ hội này cho bạn bè của bạn
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        `${config.site.base_url}/tuyen-dung/${id}`
                      )}`}
                      target="_blank"
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                      Facebook
                    </Link>
                    <Link
                      href={`https://zalo.me/share?url=${encodeURIComponent(
                        `${config.site.base_url}/tuyen-dung/${id}`
                      )}`}
                      target="_blank"
                      className="flex-1 bg-blue-500 text-white text-center py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      Zalo
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToAction isNoSectionTop isNoSectionBottom />
    </>
  );
};

export default TuyenDungDetailPage;

// Generate static params cho tất cả careers
export async function generateStaticParams() {
  const ids = await fetchAllCareerIds();
  return ids.map((id) => ({ id }));
}
