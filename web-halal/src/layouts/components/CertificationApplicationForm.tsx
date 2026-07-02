"use client";

import {
  submitCertificationApplication,
  CertificationApplicationData,
} from "@/lib/strapi/api/certification";
import { HALAL_SERVICE_CATEGORIES } from "@/config/halalCategories";
import { LABEL_CLASS, INPUT_CLASS } from "@/lib/formStyles";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Button from "./Button";

interface CertificationApplicationFormProps {
  defaultApplicationType?: "domestic" | "international";
}

const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 10;

export default function CertificationApplicationForm({
  defaultApplicationType = "domestic",
}: CertificationApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [fileError, setFileError] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { jwt, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFileError("");
    setSubmitStatus({ type: null, message: "" });

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    const files = (formData.getAll("documents") as File[]).filter(
      (f) => f.size > 0
    );
    if (files.length > MAX_FILES) {
      setFileError(`Chỉ được tải lên tối đa ${MAX_FILES} tệp.`);
      return;
    }
    const oversized = files.find((f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (oversized) {
      setFileError(`Tệp "${oversized.name}" vượt quá ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setIsSubmitting(true);

    const applicationData: CertificationApplicationData = {
      companyName: formData.get("companyName") as string,
      taxCode: formData.get("taxCode") as string,
      address: formData.get("address") as string,
      contactName: formData.get("contactName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      category: formData.get("category") as string,
      applicationType: formData.get("applicationType") as "domestic" | "international",
      notes: (formData.get("notes") as string) || undefined,
    };

    try {
      let recaptchaToken: string | undefined;
      if (executeRecaptcha) {
        try {
          recaptchaToken = await executeRecaptcha("certification_application");
        } catch {
          // Swallow — backend will reject in production when verification fails.
        }
      }
      const result = await submitCertificationApplication(
        applicationData,
        files,
        recaptchaToken,
        jwt ?? undefined
      );

      if (result.error) {
        setSubmitStatus({
          type: "error",
          message: result.error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.",
        });
      } else {
        setSubmitStatus({
          type: "success",
          message:
            "Đã nhận hồ sơ đăng ký chứng nhận Halal của bạn. Chúng tôi sẽ liên hệ trong thời gian sớm nhất.",
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
      className="bg-white rounded-2xl shadow-sm border border-border p-8 md:p-10"
      onSubmit={handleSubmit}
    >
      {submitStatus.type && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            submitStatus.type === "success"
              ? "bg-green-500/10 text-green-700 border border-green-400/30"
              : "bg-red-500/10 text-red-700 border border-red-400/30"
          }`}
        >
          {submitStatus.type === "success" ? "✅ " : "❌ "}
          {submitStatus.message}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="applicationType" className={LABEL_CLASS}>
          Loại doanh nghiệp <span className="text-red-500">*</span>
        </label>
        <select
          id="applicationType"
          name="applicationType"
          className={INPUT_CLASS}
          defaultValue={defaultApplicationType}
          required
          disabled={isSubmitting}
        >
          <option value="domestic">Doanh nghiệp trong nước</option>
          <option value="international">Doanh nghiệp quốc tế</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="companyName" className={LABEL_CLASS}>
            Tên doanh nghiệp <span className="text-red-500">*</span>
          </label>
          <input
            id="companyName"
            name="companyName"
            className={INPUT_CLASS}
            placeholder="Công ty TNHH..."
            type="text"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="taxCode" className={LABEL_CLASS}>
            Mã số thuế <span className="text-red-500">*</span>
          </label>
          <input
            id="taxCode"
            name="taxCode"
            className={INPUT_CLASS}
            placeholder="0312345678"
            type="text"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="address" className={LABEL_CLASS}>
          Địa chỉ <span className="text-red-500">*</span>
        </label>
        <input
          id="address"
          name="address"
          className={INPUT_CLASS}
          placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố"
          type="text"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="contactName" className={LABEL_CLASS}>
            Người liên hệ <span className="text-red-500">*</span>
          </label>
          <input
            id="contactName"
            name="contactName"
            className={INPUT_CLASS}
            placeholder="Nguyễn Văn A"
            type="text"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber" className={LABEL_CLASS}>
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            className={INPUT_CLASS}
            placeholder="0912 345 678"
            type="tel"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="email" className={LABEL_CLASS}>
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          className={INPUT_CLASS}
          placeholder="email@example.com"
          type="email"
          defaultValue={user?.email}
          required
          disabled={isSubmitting}
        />
        {user && (
          <p className="text-text/50 text-xs mt-2">
            Đang đăng nhập với {user.email} — hồ sơ này sẽ được liên kết vào tài khoản của bạn.
          </p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="category" className={LABEL_CLASS}>
          Lĩnh vực đăng ký chứng nhận <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          name="category"
          className={INPUT_CLASS}
          defaultValue=""
          required
          disabled={isSubmitting}
        >
          <option value="" disabled>
            Chọn lĩnh vực
          </option>
          {HALAL_SERVICE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="documents" className={LABEL_CLASS}>
          Hồ sơ đính kèm
        </label>
        <input
          id="documents"
          name="documents"
          className={INPUT_CLASS}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          disabled={isSubmitting}
        />
        <p className="text-text/50 text-xs mt-2">
          Giấy phép kinh doanh, danh sách sản phẩm/nguyên liệu, bản khai chuỗi
          cung ứng, hình ảnh cơ sở sản xuất. Tối đa {MAX_FILES} tệp, mỗi tệp
          không quá {MAX_FILE_SIZE_MB}MB.
        </p>
        {fileError && (
          <p className="text-red-500 text-xs mt-2">{fileError}</p>
        )}
      </div>

      <div className="mb-8">
        <label htmlFor="notes" className={LABEL_CLASS}>
          Ghi chú
        </label>
        <textarea
          id="notes"
          name="notes"
          className={INPUT_CLASS}
          placeholder="Thông tin bổ sung về sản phẩm/dây chuyền cần chứng nhận..."
          rows={4}
          disabled={isSubmitting}
        ></textarea>
      </div>

      <Button
        enable={!isSubmitting}
        label={isSubmitting ? "Đang gửi hồ sơ..." : "Gửi hồ sơ đăng ký"}
        type="submit"
        style="btn-primary"
        showIcon={!isSubmitting}
      />
    </form>
  );
}
