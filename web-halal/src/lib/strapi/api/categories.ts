import { fetchFromStrapi, StrapiResponse, StrapiMedia } from "./articles";

// Interface cho category từ Strapi V5
export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  cover?: StrapiMedia | null;
}

export interface StrapiCategoryResponse {
  data: StrapiCategory[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Fetch tất cả categories
export async function fetchAllCategories(): Promise<StrapiCategory[]> {
  console.log(`\n📂 [fetchAllCategories] Fetching all categories...`);

  try {
    const data = await fetchFromStrapi<StrapiCategoryResponse>(
      `categories?populate=cover&pagination[pageSize]=10`
    );
    console.log(
      `✅ [fetchAllCategories] Tìm thấy ${data.data.length} categories`
    );
    return data.data;
  } catch (error) {
    console.error(`❌ [fetchAllCategories] Error:`, error);
    return [];
  }
}

// Fetch category theo slug
export async function fetchCategoryBySlug(
  slug: string
): Promise<StrapiCategory | null> {
  console.log(`\n📂 [fetchCategoryBySlug] Slug: "${slug}"`);

  try {
    const data = await fetchFromStrapi<StrapiCategoryResponse>(
      `categories?filters[slug][$eq]=${slug}`
    );

    if (data.data.length > 0) {
      console.log(`✅ [fetchCategoryBySlug] Tìm thấy: "${data.data[0].name}"`);
      return data.data[0];
    } else {
      console.warn(
        `⚠️  [fetchCategoryBySlug] Không tìm thấy category với slug: "${slug}"`
      );
      return null;
    }
  } catch (error) {
    console.error(`❌ [fetchCategoryBySlug] Error:`, error);
    return null;
  }
}

// Fetch articles theo category slug với pagination
export async function fetchArticlesByCategorySlug(
  categorySlug: string,
  page: number = 1,
  pageSize: number = 6
): Promise<StrapiResponse> {
  console.log(
    `\n📄 [fetchArticlesByCategorySlug] Category: "${categorySlug}", Page: ${page}`
  );

  try {
    const data = await fetchFromStrapi<StrapiResponse>(
      `articles?populate=*&filters[category][slug][$eq]=${categorySlug}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=publishedAt:desc`
    );
    console.log(
      `✅ [fetchArticlesByCategorySlug] Trả về ${data.data.length} bài viết`
    );
    return data;
  } catch (error) {
    console.error(`❌ [fetchArticlesByCategorySlug] Error:`, error);
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

// Fetch tất cả category slugs (cho static generation)
export async function fetchAllCategorySlugs(): Promise<string[]> {
  console.log(`\n🔗 [fetchAllCategorySlugs] Fetching all category slugs...`);

  try {
    const data = await fetchFromStrapi<StrapiCategoryResponse>(
      `categories?fields[0]=slug&pagination[pageSize]=100`
    );
    console.log(
      `✅ [fetchAllCategorySlugs] Tìm thấy ${data.data.length} slugs`
    );
    return data.data.map((category) => category.slug);
  } catch (error) {
    console.error(`❌ [fetchAllCategorySlugs] Error:`, error);
    return [];
  }
}
