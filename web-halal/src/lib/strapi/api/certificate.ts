import { getStrapiInternalUrl } from "./articles";

export interface Certificate {
  id: number;
  documentId: string;
  certificateNumber: string;
  companyName: string;
  category: string;
  issuedDate: string;
  expiryDate: string;
  status: "active" | "expired" | "revoked";
}

// Live lookup — never cached, this is a verification tool and must always
// reflect the current DB state.
export async function searchCertificates(
  query: string,
  category?: string
): Promise<Certificate[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams();
  params.set("filters[$or][0][certificateNumber][$containsi]", query);
  params.set("filters[$or][1][companyName][$containsi]", query);
  if (category) params.set("filters[category][$eq]", category);
  params.set("pagination[pageSize]", "20");
  params.set("sort[0]", "issuedDate:desc");

  const url = `${getStrapiInternalUrl()}/api/certificates?${params.toString()}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []) as Certificate[];
  } catch {
    return [];
  }
}
