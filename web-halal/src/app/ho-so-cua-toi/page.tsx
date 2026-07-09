"use client";

import ApplicationStatusStepper from "@/components/ApplicationStatusStepper";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchMyApplications, MyApplication } from "@/lib/strapi/api/certification";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFileText, FiLogOut } from "react-icons/fi";

function formatDate(value: string) {
  try {
    return format(new Date(value), "dd/MM/yyyy", { locale: vi });
  } catch {
    return value;
  }
}

function ApplicationCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border p-6 animate-pulse">
      <div className="h-5 w-2/5 rounded bg-light" />
      <div className="mt-3 h-3.5 w-3/5 rounded bg-light" />
      <div className="mt-6 h-6 w-full rounded bg-light" />
    </div>
  );
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

  if (!jwt && !loading) return null;

  return (
    <>
      <SeoMeta title="Hồ sơ của tôi" noindex />
      <PageHeader title="Hồ sơ của tôi" />
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center justify-between mb-8">
            <p className="text-text/70 text-sm">
              {user ? (
                <>
                  Xin chào, <span className="font-semibold text-dark">{user.email}</span>
                </>
              ) : (
                " "
              )}
            </p>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
            >
              <FiLogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>

          {(loading || applications === null) && (
            <div className="space-y-4">
              <ApplicationCardSkeleton />
              <ApplicationCardSkeleton />
            </div>
          )}

          {applications && applications.length === 0 && (
            <div className="bg-white rounded-2xl border border-border p-12 text-center">
              <FiFileText className="mx-auto h-10 w-10 text-secondary/40" />
              <p className="mt-4 font-bold text-dark text-lg">Bạn chưa nộp hồ sơ nào</p>
              <p className="mt-1 text-text/60 text-sm">
                Nộp hồ sơ chứng nhận Halal để bắt đầu theo dõi tiến độ tại đây.
              </p>
              <Link
                href="/nop-ho-so-chung-nhan"
                className="mt-6 inline-block bg-secondary text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Nộp hồ sơ ngay
              </Link>
            </div>
          )}

          {applications && applications.length > 0 && (
            <ul className="space-y-4">
              {applications.map((app) => (
                <li
                  key={app.documentId}
                  className="bg-white rounded-2xl border border-border p-6"
                >
                  <p className="font-bold text-dark text-lg">{app.companyName}</p>
                  <p className="text-text/60 text-sm mt-1">{app.category}</p>
                  <p className="text-text/60 text-sm">
                    Nộp ngày {formatDate(app.createdAt)} —{" "}
                    {app.applicationType === "domestic" ? "Doanh nghiệp trong nước" : "Doanh nghiệp quốc tế"}
                  </p>
                  {app.siteVisitDate && (
                    <p className="text-text/60 text-sm">
                      Lịch khảo sát: {formatDate(app.siteVisitDate)}
                    </p>
                  )}

                  <div className="mt-6">
                    <ApplicationStatusStepper
                      status={app.applicationStatus}
                      siteVisitDate={app.siteVisitDate}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
