"use client";

import { submitContact, ContactFormData } from "@/lib/strapi/api/contact";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Button from "./Button";

interface ContactFormProps {
  title: string;
  description: string;
}

export default function ContactForm({ title, description }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const contactData: ContactFormData = {
      name: formData.get("name") as string,
      phoneNumber: formData.get("phone") as string,
      title: formData.get("subject") as string,
      description: formData.get("message") as string,
      email: formData.get("email") as string,
    };

    try {
      let recaptchaToken: string | undefined;
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha("contact");
        } catch {
          // Swallow — backend will reject in production when verification fails.
        }
      }
      const result = await submitContact(contactData, recaptchaToken);

      if (result.error) {
        setSubmitStatus({
          type: "error",
          message:
            result.error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.",
        });
      } else {
        setSubmitStatus({
          type: "success",
          message:
            "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
        });
        formElement.reset();
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      data-aos="fade-right-sm"
      data-aos-delay="150"
      className="bg-primary px-8 md:px-12 py-10 md:py-14"
      onSubmit={handleSubmit}
    >
      <h2 className="text-white mb-4">{title}</h2>
      <p className="text-text-light/80 mb-10 md:mb-16">{description}</p>

      {/* Status message */}
      {submitStatus.type && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === "success"
              ? "bg-green-500/20 text-green-100 border border-green-400/30"
              : "bg-red-500/20 text-red-100 border border-red-400/30"
          }`}
        >
          {submitStatus.type === "success" ? "✅ " : "❌ "}
          {submitStatus.message}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="name" className="form-label">
          Họ và Tên <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          className="form-input"
          placeholder="Nguyễn Văn A"
          type="text"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="email" className="form-label">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            className="form-input"
            placeholder="email@example.com"
            type="email"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="phone" className="form-label">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            className="form-input"
            placeholder="0912 345 678"
            type="tel"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="subject" className="form-label">
          Chủ đề <span className="text-red-500">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          className="form-input"
          placeholder="Tư vấn chứng nhận Halal cho sản phẩm của bạn"
          type="text"
          required
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="form-label">
          Nội dung <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          className="form-input"
          placeholder="Nhập nội dung tin nhắn của bạn..."
          rows={4}
          required
          disabled={isSubmitting}
        ></textarea>
      </div>

      <Button
        enable={!isSubmitting}
        label={isSubmitting ? "Đang gửi..." : "Gửi Tin Nhắn"}
        type="submit"
        style="btn-outline"
        showIcon={!isSubmitting}
      />
    </form>
  );
}
