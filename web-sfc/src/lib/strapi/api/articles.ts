import { StrapiBlock } from "../model/block.model";

// Strapi API utilities
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Interface cho media/image từ Strapi V5
export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
  url: string;
  previewUrl?: string | null;
}

// Interface cho author từ Strapi V5
export interface StrapiAuthor {
  id: number;
  documentId: string;
  name: string;
  email: string;
}

// Interface cho category từ Strapi V5
export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
}

// Interface cho dữ liệu bài viết từ Strapi V5
export interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  description: string;
  slug: string;
  cover?: StrapiMedia | null;
  author?: StrapiAuthor | null;
  category?: StrapiCategory | null;
  blocks?: StrapiBlock[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiResponse {
  data: StrapiArticle[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Chuyển đổi dữ liệu Strapi V5 sang format BlogPost
export function transformStrapiArticle(article: StrapiArticle) {
  let imageUrl = "/images/image-placeholder.png";

  if (article.cover?.url) {
    const coverUrl = article.cover.url;
    imageUrl = coverUrl.startsWith("http")
      ? coverUrl
      : `${STRAPI_URL}${coverUrl}`;
  }

  return {
    frontmatter: {
      title: article.title,
      description: article.description,
      image: imageUrl,
      date: article.publishedAt || article.createdAt,
      categories: article.category?.name ? [article.category.name] : [],
    },
    slug: article.slug,
    content: "",
  };
}

// Fetch dữ liệu từ Strapi với options tùy chỉnh
export async function fetchFromStrapi<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const fullUrl = `${STRAPI_URL}/api/${endpoint}`;
  console.log("\n🔍 [Strapi Fetch] URL:", fullUrl);

  try {
    const startTime = Date.now();
    const response = await fetch(fullUrl, {
      next: { revalidate: 60 }, // Revalidate mỗi 60 giây
      ...options,
    });

    const duration = Date.now() - startTime;

    if (!response.ok) {
      console.error(
        `❌ [Strapi Error] ${response.status} ${response.statusText}`
      );
      console.error(`   URL: ${fullUrl}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();

    console.log(`✅ [Strapi Success] ${response.status} (${duration}ms)`);
    console.log(`📦 [Data]`, {
      hasData: !!res.data,
      itemCount: Array.isArray(res.data) ? res.data.length : "single",
      pagination: res.meta?.pagination || null,
      firstItem:
        Array.isArray(res.data) && res.data[0]
          ? { id: res.data[0].id, title: res.data[0].title }
          : null,
    });

    return res;
  } catch (error) {
    console.error(`\n❌ [Strapi Fetch Error]`);
    console.error(`   Endpoint: ${endpoint}`);
    console.error(`   Error:`, error);
    throw error;
  }
}

// Fetch articles với pagination
export async function fetchArticles(
  page: number = 1,
  pageSize: number = 6
): Promise<StrapiResponse> {
  console.log(`\n📄 [fetchArticles] Page: ${page}, PageSize: ${pageSize}`);

  try {
    const data = await fetchFromStrapi<StrapiResponse>(
      `articles?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=publishedAt:desc`
    );
    console.log(`✅ [fetchArticles] Trả về ${data.data.length} bài viết`);
    return data;
  } catch (error) {
    console.error(`❌ [fetchArticles] Error:`, error);
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

// Build query params cho article detail (populate nested blocks)
function buildArticleDetailQuery(slug: string): string {
  const params = new URLSearchParams();

  // Filter by slug
  params.append("filters[slug][$eq]", slug);

  // Populate relations
  params.append("populate[cover]", "true");
  params.append("populate[author]", "true");
  params.append("populate[category]", "true");

  // Populate blocks với nested media (Strapi V5)
  params.append("populate[blocks][populate]", "*");

  return params.toString();
}

// Fetch một article theo slug
export async function fetchArticleBySlug(
  slug: string
): Promise<StrapiArticle | null> {
  console.log(`\n📰 [fetchArticleBySlug] Slug: "${slug}"`);

  try {
    const query = buildArticleDetailQuery(slug);
    const data = await fetchFromStrapi<StrapiResponse>(`articles?${query}`);

    if (data.data.length > 0) {
      console.log(`✅ [fetchArticleBySlug] Tìm thấy: "${data.data[0].title}"`);
      return data.data[0];
    } else {
      console.warn(
        `⚠️  [fetchArticleBySlug] Không tìm thấy bài viết với slug: "${slug}"`
      );
      return null;
    }
  } catch (error) {
    console.error(`❌ [fetchArticleBySlug] Error:`, error);
    return null;
  }
}

// Fetch tất cả articles (cho static generation)
export async function fetchAllArticleSlugs(): Promise<string[]> {
  console.log(`\n🔗 [fetchAllArticleSlugs] Fetching all article slugs...`);

  try {
    const data = await fetchFromStrapi<StrapiResponse>(
      `articles?fields[0]=slug&pagination[pageSize]=100`
    );
    console.log(`✅ [fetchAllArticleSlugs] Tìm thấy ${data.data.length} slugs`);
    return data.data.map((article) => article.slug);
  } catch (error) {
    console.error(`❌ [fetchAllArticleSlugs] Error:`, error);
    return [];
  }
}

// Fetch articles liên quan (cùng category)
export async function fetchRelatedArticles(
  currentSlug: string,
  categoryId?: number,
  limit: number = 2
): Promise<StrapiResponse> {
  console.log(
    `\n🔄 [fetchRelatedArticles] Slug: "${currentSlug}", Category: ${categoryId || "all"}`
  );

  try {
    let endpoint = `articles?populate=*&pagination[pageSize]=${limit}&sort[0]=publishedAt:desc&filters[slug][$ne]=${currentSlug}`;

    if (categoryId) {
      endpoint += `&filters[category][id][$eq]=${categoryId}`;
    }

    const data = await fetchFromStrapi<StrapiResponse>(endpoint);
    console.log(
      `✅ [fetchRelatedArticles] Tìm thấy ${data.data.length} bài viết liên quan`
    );
    return data;
  } catch (error) {
    console.error(`❌ [fetchRelatedArticles] Error:`, error);
    return {
      data: [],
      meta: {
        pagination: {
          page: 1,
          pageSize: limit,
          pageCount: 0,
          total: 0,
        },
      },
    };
  }
}

// Fetch tổng số pages
export async function fetchTotalPages(): Promise<number> {
  console.log(`\n📊 [fetchTotalPages] Fetching total page count...`);

  try {
    const data = await fetchFromStrapi<StrapiResponse>(
      `articles?pagination[pageSize]=1`
    );
    console.log(
      `✅ [fetchTotalPages] Total pages: ${data.meta.pagination.pageCount}`
    );
    return data.meta.pagination.pageCount;
  } catch (error) {
    console.error(`❌ [fetchTotalPages] Error:`, error);
    return 1;
  }
}
