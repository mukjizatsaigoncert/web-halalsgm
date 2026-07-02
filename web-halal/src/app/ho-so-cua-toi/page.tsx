"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { fetchMyApplications, MyApplication } from "@/lib/strapi/api/certification";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Đã tiếp nhận",
  under_review: "Đang xem xét",
  site_visit_scheduled: "Đã lên lịch khảo sát",
  approved: "Đã phê duyệt",
  rejected: "Không chấp thuận",
};

const STATUS_CLASSES: Record<string, string> = {
  submitted: "bg-secondary/10 text-secondary border border-secondary/30",
  under_review: "bg-gold/10 text-gold border border-gold/30",
  site_visit_scheduled: "bg-gold/10 text-gold border border-gold/30",
  approved: "bg-green-500/10 text-green-700 border border-green-400/30",
  rejected: "bg-red-500/10 text-red-700 border border-red-400/30",
};

function formatDate(value: string) {
  try {
    return format(new Date(value), "dd/MM/yyyy", { locale: vi });
  } catch {
    return value;
  }
}

export default function HoSoCuaToiPage() {
  const { user, jwt, loading, logout } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<MyApplication[] | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!jwt) {
      router.replace("/dang-nhap");
      return;
    }
    fetchMyApplications(jwt).then(setApplications);
  }, [loading, jwt, router]);

  if (loading || (jwt && applications === null)) {
    return (
      <section className="py-24 md:py-28">
        <div className="container mx-auto px-4 max-w-3xl text-center text-text/60">
          Đang tải...
        </div>
      </section>
    );
  }

  if (!jwt) return null;

  return (
    <section className="py-24 md:py-28">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-dark text-3xl">Hồ sơ của tôi</h1>
            <p className="text-text/60 text-sm mt-1">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm font-semibold text-secondary hover:underline"
          >
            Đăng xuất
          </button>
        </div>

        {applications && applications.length === 0 && (
          <p className="text-text/60 text-sm">Bạn chưa nộp hồ sơ nào.</p>
        )}

        {applications && applications.length > 0 && (
          <ul className="space-y-4">
            {applications.map((app) => (
              <li
                key={app.documentId}
                className="bg-white rounded-2xl border border-border p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <p className="font-bold text-dark text-lg">{app.companyName}</p>
                  <p className="text-text/60 text-sm mt-1">{app.category}</p>
                  <p className="text-text/60 text-sm">
                    Nộp ngày {formatDate(app.createdAt)} —{" "}
                    {app.applicationType === "domestic" ? "Doanh nghiệp trong nước" : "Doanh nghiệp quốc tế"}
                  </p>
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
    </section>
  );
}
