import { StrapiBlock } from "../model/block.model";
import { draftMode } from "next/headers";

// Strapi API utilities
// NEXT_PUBLIC_STRAPI_URL: public-facing URL (browser + CDN), e.g. https://api.halalsgm.vn
export const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// STRAPI_INTERNAL_URL: Docker-internal URL for server-side fetch, e.g. http://backend:1337
// Must be a function (not a const) so process.env is read at request time,
// not at module-init / build time when the env var is not yet injected.
export function getStrapiInternalUrl(): string {
  if (typeof window === "undefined" && process.env.STRAPI_INTERNAL_URL) {
    return process.env.STRAPI_INTERNAL_URL;
  }
  return STRAPI_URL;
}

/**
 * Build image URL from a Strapi media url field.
 *
 * - Absolute URL (CDN, Strapi Cloud): used as-is
 * - Relative path (/uploads/...): keep it relative so Next.js routes the image
 *   through its /uploads rewrite to the Strapi Docker service.
 */
export function buildStrapiImageUrl(url: string | undefined | null): string {
  if (!url) return "/images/image-placeholder.png";
  if (url.startsWith("http")) return url;
  return url;
}

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
  return {
    frontmatter: {
      title: article.title,
      description: article.description,
      image: buildStrapiImageUrl(article.cover?.url),
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
  const fullUrl = `${getStrapiInternalUrl()}/api/${endpoint}`;
  console.log("\n🔍 [Strapi Fetch] URL:", fullUrl);

  try {
    const startTime = Date.now();
    const response = await fetch(fullUrl, {
      // Default: cache tag-based revalidation + time-based fallback (60s).
      // Pass `options` last so callers can override tags/revalidate per call.
      ...(options?.cache === 'no-store'
        ? {}
        : { next: { revalidate: 60, tags: ['strapi-content'] } }),
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

// Interface cho hero-slider từ Strapi
export interface StrapiHeroSlider {
  id: number;
  documentId: string;
  tag: string;
  heading: string;
  subheading: string;
  image: StrapiMedia | null;
  order: number;
}

export interface StrapiHeroSliderResponse {
  data: StrapiHeroSlider[];
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function fetchHeroSliders(): Promise<StrapiHeroSlider[]> {
  try {
    const { isEnabled: isPreview } = await draftMode();
    const data = await fetchFromStrapi<StrapiHeroSliderResponse>(
      `hero-sliders?populate=image&sort=order:asc&pagination[pageSize]=10${isPreview ? '&status=draft' : ''}`,
      isPreview ? { cache: 'no-store' } : undefined,
    );
    return data.data;
  } catch (error) {
    console.error(`❌ [fetchHeroSliders] Error:`, error);
    return [];
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
