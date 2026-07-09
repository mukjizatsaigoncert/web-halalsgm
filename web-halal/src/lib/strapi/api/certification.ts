// Certification application API utilities for Strapi V5

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export interface CertificationApplicationData {
  companyName: string;
  taxCode: string;
  address: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  category: string;
  applicationType: "domestic" | "international";
  notes?: string;
}

export interface CertificationApplicationResponse {
  data: { id: number; documentId: string } | null;
  error?: {
    status: number;
    name: string;
    message: string;
    details?: unknown;
  };
}

export interface MyApplication {
  id: number;
  documentId: string;
  companyName: string;
  category: string;
  applicationType: "domestic" | "international";
  applicationStatus: string;
  createdAt: string;
  siteVisitDate?: string;
}

export async function fetchMyApplications(jwt: string): Promise<MyApplication[]> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/certification-applications/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export interface PartnerApplicationsResult {
  ok: boolean;
  data: MyApplication[];
}

// Read-only Halal-only feed for the Malaysia-partner account (role
// `partner_malaysia` — see backend-halal/src/index.ts). Distinguishes a 403
// (wrong role) from an empty result so the page can show "not authorized"
// instead of a misleading empty table.
export async function fetchPartnerHalalApplications(jwt: string): Promise<PartnerApplicationsResult> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/certification-applications/partner-list`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, data: [] };
    const json = await res.json();
    return { ok: true, data: json.data ?? [] };
  } catch {
    return { ok: false, data: [] };
  }
}

// Two-step submission: Strapi's create() requires `data` to already be a
// parsed object and never JSON-parses a multipart `data` field itself, so a
// single combined data+files POST to /api/certification-applications isn't
// viable. Step 1 creates the entry as plain JSON; step 2 (if there are
// files) attaches them via the standard ref/refId/field upload endpoint.
export async function submitCertificationApplication(
  formData: CertificationApplicationData,
  documents: File[],
  recaptchaToken?: string,
  jwt?: string
): Promise<CertificationApplicationResponse> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (recaptchaToken) headers["x-recaptcha-token"] = recaptchaToken;
    if (jwt) headers["Authorization"] = `Bearer ${jwt}`;

    const response = await fetch(`${STRAPI_URL}/api/certification-applications`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: { ...formData, applicationStatus: "submitted" },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { data: null, error: result.error };
    }

    if (documents.length > 0 && result.data?.id) {
      const uploadBody = new FormData();
      documents.forEach((file) => uploadBody.append("files", file));
      uploadBody.append("ref", "api::certification-application.certification-application");
      uploadBody.append("refId", String(result.data.id));
      uploadBody.append("field", "documents");
      // Proves we're the one who just created this entry (anonymous
      // submissions have no account to check ownership against otherwise) —
      // see restrict-upload.ts on the backend.
      const uploadToken = result.meta?.uploadToken;
      if (uploadToken) uploadBody.append("uploadToken", uploadToken);

      const uploadHeaders: Record<string, string> = {};
      if (jwt) uploadHeaders["Authorization"] = `Bearer ${jwt}`;

      await fetch(`${STRAPI_URL}/api/upload`, {
        method: "POST",
        headers: uploadHeaders,
        body: uploadBody,
      });
      // Best-effort: the application itself is already submitted even if a
      // document attachment fails — don't fail the whole submission for it.
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
