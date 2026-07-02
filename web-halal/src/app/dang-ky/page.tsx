"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { LABEL_CLASS, INPUT_CLASS } from "@/lib/formStyles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DangKyPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await register(
      formData.get("username") as string,
      formData.get("email") as string,
      password
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
        <h1 className="font-bold text-dark text-3xl mb-8 text-center">Đăng ký tài khoản</h1>
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
            <label htmlFor="username" className={LABEL_CLASS}>
              Tên hiển thị
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={INPUT_CLASS}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className={LABEL_CLASS}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={INPUT_CLASS}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className={LABEL_CLASS}>
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              className={INPUT_CLASS}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-8">
            <label htmlFor="confirmPassword" className={LABEL_CLASS}>
              Nhập lại mật khẩu
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={6}
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
            {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>
          <p className="text-text/60 text-sm text-center mt-6">
            Đã có tài khoản?{" "}
            <Link href="/dang-nhap" className="text-secondary font-medium hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
