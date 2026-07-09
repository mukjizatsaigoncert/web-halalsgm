"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { STATUS_CLASSES, STATUS_LABELS } from "@/lib/constants/applicationStatus";
import { Certificate, fetchHalalCertificates } from "@/lib/strapi/api/certificate";
import { fetchPartnerHalalApplications, MyApplication } from "@/lib/strapi/api/certification";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CERT_STATUS_LABELS: Record<string, string> = {
  active: "Còn hiệu lực",
  expired: "Hết hạn",
  revoked: "Đã thu hồi",
};

const CERT_STATUS_CLASSES: Record<string, string> = {
  active: "bg-green-500/10 text-green-700 border border-green-400/30",
  expired: "bg-gray-500/10 text-gray-600 border border-gray-400/30",
  revoked: "bg-red-500/10 text-red-700 border border-red-400/30",
};

function formatDate(value: string) {
  try {
    return format(new Date(value), "dd/MM/yyyy", { locale: vi });
  } catch {
    return value;
  }
}

export default function DoiTacMalaysiaPage() {
  const { user, jwt, loading, logout } = useAuth();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [certificates, setCertificates] = useState<Certificate[] | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!jwt) {
      router.replace("/dang-nhap");
      return;
    }
    Promise.all([fetchPartnerHalalApplications(jwt), fetchHalalCertificates()]).then(
      ([appsResult, certs]) => {
        setAuthorized(appsResult.ok);
        setApplications(appsResult.data);
        setCertificates(certs);
      }
    );
  }, [loading, jwt, router]);

  if (loading || (jwt && authorized === null)) {
    return (
      <section className="py-24 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl text-center text-text/60">
          Đang tải...
        </div>
      </section>
    );
  }

  if (!jwt) return null;

  return (
    <section className="py-24 md:py-28">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-dark text-3xl">Theo dõi chứng nhận Halal</h1>
            <p className="text-text/60 text-sm mt-1">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm font-semibold text-secondary hover:underline"
          >
            Đăng xuất
          </button>
        </div>

        {authorized === false && (
          <p className="text-red-600 text-sm">Bạn không có quyền truy cập trang này.</p>
        )}

        {authorized && (
          <>
            <div className="mb-12">
              <h2 className="font-bold text-dark text-xl mb-4">Hồ sơ Halal đã nộp</h2>
              {applications.length === 0 && (
                <p className="text-text/60 text-sm">Chưa có hồ sơ nào.</p>
              )}
              {applications.length > 0 && (
                <ul className="space-y-4">
                  {applications.map((app) => (
                    <li
                      key={app.documentId}
                      className="bg-white rounded-2xl border border-border p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div>
                        <p className="font-bold text-dark text-lg">{app.companyName}</p>
                        <p className="text-text/60 text-sm mt-1">
                          Nộp ngày {formatDate(app.createdAt)} —{" "}
                          {app.applicationType === "domestic" ? "Doanh nghiệp trong nước" : "Doanh nghiệp quốc tế"}
                        </p>
                        {app.siteVisitDate && (
                          <p className="text-text/60 text-sm">
                            Lịch khảo sát: {formatDate(app.siteVisitDate)}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${STATUS_CLASSES[app.applicationStatus]}`}
                      >
                        {STATUS_LABELS[app.applicationStatus] ?? app.applicationStatus}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h2 className="font-bold text-dark text-xl mb-4">Chứng chỉ Halal đã cấp</h2>
              {certificates && certificates.length === 0 && (
                <p className="text-text/60 text-sm">Chưa có chứng chỉ nào.</p>
              )}
              {certificates && certificates.length > 0 && (
                <ul className="space-y-4">
                  {certificates.map((cert) => (
                    <li
                      key={cert.documentId}
                      className="bg-white rounded-2xl border border-border p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                    >
                      <div>
                        <p className="font-bold text-dark text-lg">{cert.companyName}</p>
                        <p className="text-text/60 text-sm mt-1">
                          {cert.certificateNumber} — Cấp {formatDate(cert.issuedDate)}, hết hạn{" "}
                          {formatDate(cert.expiryDate)}
                        </p>
                      </div>
                      <span
                        className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${CERT_STATUS_CLASSES[cert.status]}`}
                      >
                        {CERT_STATUS_LABELS[cert.status] ?? cert.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
