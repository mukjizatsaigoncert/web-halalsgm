"use client";

import Button from "@/components/Button";
import { useEffect } from "react";

export default function TuyenDungError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[tuyen-dung/error]", error);
  }, [error]);

  return (
    <section className="pt-[200px] pb-[120px] text-center container">
      <h1 className="h2 mb-4">Không tải được danh sách tuyển dụng</h1>
      <p className="mb-8 text-text/70">
        Dữ liệu tuyển dụng tạm thời không khả dụng. Vui lòng thử lại sau.
      </p>
      <div className="flex gap-4 justify-center">
        <button type="button" onClick={reset} className="btn btn-primary">
          Thử lại
        </button>
        <Button enable label="Về trang chủ" link="/" style="btn-outline" />
      </div>
    </section>
  );
}
