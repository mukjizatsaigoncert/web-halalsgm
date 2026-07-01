"use client";

import Button from "@/components/Button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hook point for Sentry — replaced by withSentryErrorBoundary once wired.
    // eslint-disable-next-line no-console
    console.error("[app/error]", error);
  }, [error]);

  return (
    <section className="relative pt-[260px] pb-[160px] text-center overflow-hidden">
      <div
        className="absolute inset-0 bg-[url(/images/page-header.png)] bg-cover bg-center grayscale-[100%] z-0"
        aria-hidden="true"
      />
      <div className="relative z-10 container">
        <div className="row justify-center">
          <div className="sm:col-10 md:col-8 lg:col-6">
            <span className="text-h1 lg:text-[6rem] block font-medium text-white">
              Đã có lỗi xảy ra
            </span>
            <div className="content mb-14">
              <p className="text-white">
                Chúng tôi đang kiểm tra sự cố. Vui lòng thử lại hoặc quay về trang chủ.
              </p>
              {error.digest && (
                <p className="text-white/60 text-sm mt-2">Mã lỗi: {error.digest}</p>
              )}
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                type="button"
                onClick={reset}
                className="btn btn-primary"
              >
                Thử lại
              </button>
              <Button enable label="Về trang chủ" link="/" style="btn-outline" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
