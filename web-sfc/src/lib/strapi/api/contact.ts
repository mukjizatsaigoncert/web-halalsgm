// Contact API utilities for Strapi V5

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Interface cho Contact data
export interface ContactFormData {
  name: string;
  phoneNumber: string;
  title: string;
  description: string;
  email: string;
}

export interface ContactResponse {
  data: {
    id: number;
    documentId: string;
    name: string;
    phoneNumber: string;
    title: string;
    description: string;
    email: string;
    contactStatus: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  } | null;
  error?: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
}

export async function submitContact(
  formData: ContactFormData,
  recaptchaToken?: string
): Promise<ContactResponse> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (recaptchaToken) headers["x-recaptcha-token"] = recaptchaToken;

    const response = await fetch(`${STRAPI_URL}/api/contacts`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          title: formData.title,
          description: formData.description,
          email: formData.email,
          contactStatus: false,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { data: null, error: result.error };
    }
    return { data: result.data };
  } catch {
    return {
      data: null,
      error: {
        status: 500,
        name: "NetworkError",
        message: "Không thể kết nối đến server. Vui lòng thử lại sau.",
      },
    };
  }
}
