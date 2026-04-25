"use client";

import { useEffect } from "react";

// global-error.tsx replaces the root layout when an error occurs, so it must
// render its own <html> and <body>. Keep the markup minimal — layout, fonts
// and providers may themselves be the source of the error.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="vi">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#111",
          color: "#fff",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            Có lỗi nghiêm trọng
          </h1>
          <p style={{ opacity: 0.8, marginBottom: "2rem" }}>
            Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút.
          </p>
          {error.digest && (
            <p style={{ opacity: 0.5, fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Mã lỗi: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.75rem 1.75rem",
              border: "1px solid #fff",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
