"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { LABEL_CLASS, INPUT_CLASS } from "@/lib/formStyles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DangNhapPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await login(
      formData.get("identifier") as string,
      formData.get("password") as string
    );
    setIsSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    router.push("/ho-so-cua-toi");
  };

  return (
    <section className="py-24 md:py-28">
      <div className="container mx-auto px-4 max-w-md">
        <h1 className="font-bold text-dark text-3xl mb-8 text-center">Đăng nhập</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-border p-8"
        >
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 text-red-700 border border-red-400/30 text-sm">
              ❌ {error}
            </div>
          )}
          <div className="mb-6">
            <label htmlFor="identifier" className={LABEL_CLASS}>
              Email
            </label>
            <input
              id="identifier"
              name="identifier"
              type="email"
              className={INPUT_CLASS}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-8">
            <label htmlFor="password" className={LABEL_CLASS}>
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={INPUT_CLASS}
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-secondary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
          <p className="text-text/60 text-sm text-center mt-6">
            Chưa có tài khoản?{" "}
            <Link href="/dang-ky" className="text-secondary font-medium hover:underline">
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
