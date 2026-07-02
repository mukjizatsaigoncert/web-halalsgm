import { searchCertificates } from "@/lib/strapi/api/certificate";
import { HALAL_SERVICE_CATEGORIES } from "@/config/halalCategories";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const STATUS_LABELS: Record<string, string> = {
  active: "Còn hiệu lực",
  expired: "Đã hết hạn",
  revoked: "Đã thu hồi",
};

const STATUS_CLASSES: Record<string, string> = {
  active: "bg-green-500/10 text-green-700 border border-green-400/30",
  expired: "bg-gray-500/10 text-gray-700 border border-gray-400/30",
  revoked: "bg-red-500/10 text-red-700 border border-red-400/30",
};

function formatDate(value: string) {
  try {
    return format(new Date(value), "dd/MM/yyyy", { locale: vi });
  } catch {
    return value;
  }
}

export default async function TraCuuChungNhanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "" } = await searchParams;
  const results = q.trim() ? await searchCertificates(q, category || undefined) : [];

  return (
    <>
      <SeoMeta
        title="Tra cứu chứng nhận Halal"
        meta_title="Tra cứu chứng nhận Halal - SaigonCert"
        description="Tra cứu trạng thái chứng nhận Halal theo số chứng nhận hoặc tên doanh nghiệp."
      />
      <PageHeader title="Tra cứu chứng nhận Halal" />
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <form className="flex flex-col sm:flex-row gap-3 mb-10" action="/tra-cuu-chung-nhan">
            <select
              name="category"
              defaultValue={category}
              className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-text sm:w-64 focus:outline-none focus:ring-2 focus:ring-secondary/40"
            >
              <option value="">Tất cả lĩnh vực</option>
              {HALAL_SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Nhập số chứng nhận hoặc tên doanh nghiệp..."
              className="flex-1 rounded-lg border border-border bg-white px-4 py-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-secondary/40"
            />
            <button
              type="submit"
              className="bg-secondary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Tra cứu
            </button>
          </form>

          {q.trim() && results.length === 0 && (
            <p className="text-text/60 text-sm">
              Không tìm thấy chứng nhận nào khớp với &quot;{q}&quot;.
            </p>
          )}

          {results.length > 0 && (
            <ul className="space-y-4">
              {results.map((cert) => (
                <li
                  key={cert.documentId}
                  className="bg-white rounded-2xl border border-border p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-dark text-lg">{cert.companyName}</p>
                    <p className="text-text/60 text-sm mt-1">
                      Số chứng nhận: <span className="font-medium text-dark">{cert.certificateNumber}</span>
                    </p>
                    <p className="text-text/60 text-sm">{cert.category}</p>
                    <p className="text-text/60 text-sm">
                      Hiệu lực: {formatDate(cert.issuedDate)} — {formatDate(cert.expiryDate)}
                    </p>
                  </div>
                  <span
                    className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${STATUS_CLASSES[cert.status]}`}
                  >
                    {STATUS_LABELS[cert.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
