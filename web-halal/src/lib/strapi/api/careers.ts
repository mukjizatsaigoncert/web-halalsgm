import { fetchFromStrapi } from "./articles";

// Interface cho Career từ Strapi
export interface StrapiCareer {
  id: number;
  documentId: string;
  name: string;
  description?: string;
  workingTime: "full-time" | "part-time" | "contract" | "intern";
  detailInfo?: string; // Rich text (Markdown)
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  careerStatus: boolean;
}

export interface StrapiCareerResponse {
  data: StrapiCareer[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Map working time to Vietnamese
export function getWorkingTimeLabel(workingTime: string): string {
  const labels: Record<string, string> = {
    "full-time": "Toàn thời gian",
    "part-time": "Bán thời gian",
    contract: "Hợp đồng",
    intern: "Thực tập",
  };
  return labels[workingTime] || workingTime;
}

// Fetch tất cả careers
export async function fetchAllCareers(
  page: number = 1,
  pageSize: number = 20
): Promise<StrapiCareerResponse> {
  console.log(`\n💼 [fetchAllCareers] Fetching all careers...`);

  try {
    const data = await fetchFromStrapi<StrapiCareerResponse>(
      `careers?filters[careerStatus][$eq]=true&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=publishedAt:desc`
    );
    console.log(`✅ [fetchAllCareers] Tìm thấy ${data.data.length} careers`);
    return data;
  } catch (error) {
    console.error(`❌ [fetchAllCareers] Error:`, error);
    return {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize,
          pageCount: 0,
          total: 0,
        },
      },
    };
  }
}

// Fetch career theo documentId
export async function fetchCareerById(
  documentId: string
): Promise<StrapiCareer | null> {
  console.log(`\n💼 [fetchCareerById] ID: "${documentId}"`);

  try {
    const data = await fetchFromStrapi<{ data: StrapiCareer }>(
      `careers/${documentId}`
    );

    if (data.data) {
      console.log(`✅ [fetchCareerById] Tìm thấy: "${data.data.name}"`);
      return data.data;
    } else {
      console.warn(
        `⚠️  [fetchCareerById] Không tìm thấy career với id: "${documentId}"`
      );
      return null;
    }
  } catch (error) {
    console.error(`❌ [fetchCareerById] Error:`, error);
    return null;
  }
}

// Fetch tất cả career IDs (cho static generation)
export async function fetchAllCareerIds(): Promise<string[]> {
  console.log(`\n🔗 [fetchAllCareerIds] Fetching all career IDs...`);

  try {
    const data = await fetchFromStrapi<StrapiCareerResponse>(
      `careers?fields[0]=documentId&pagination[pageSize]=100`
    );
    console.log(`✅ [fetchAllCareerIds] Tìm thấy ${data.data.length} IDs`);
    return data.data.map((career) => career.documentId);
  } catch (error) {
    console.error(`❌ [fetchAllCareerIds] Error:`, error);
    return [];
  }
}
