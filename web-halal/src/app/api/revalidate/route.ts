/**
 * POST /api/revalidate
 *
 * Strapi webhook endpoint: invalidates Next.js cache tags so pages
 * reflect new content immediately instead of waiting for the 60s TTL.
 *
 * Strapi → Settings → Webhooks → create webhook:
 *   URL:  https://halalsgm.vn/api/revalidate
 *   Headers: { Authorization: Bearer <REVALIDATE_SECRET> }
 *   Events: Entry (create, update, delete, publish, unpublish)
 *
 * Env var required:
 *   REVALIDATE_SECRET – shared secret (generate with: openssl rand -hex 32)
 */

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Map of Strapi model UIDs → cache tags to invalidate.
// Add new UIDs here when you add new content types.
const UID_TO_TAGS: Record<string, string[]> = {
  "api::article.article": ["strapi-content", "articles"],
  "api::author.author": ["strapi-content", "authors"],
  "api::category.category": ["strapi-content", "categories"],
  "api::about.about": ["strapi-content", "about"],
  "api::global.global": ["strapi-content", "global"],
  "api::career.career": ["strapi-content", "careers"],
  "api::hero-slider.hero-slider": ["strapi-content", "hero-sliders"],
};

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  // --- Auth ---
  if (!secret) {
    console.warn("[revalidate] REVALIDATE_SECRET not set — webhook disabled");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (token !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // --- Parse body ---
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  // Strapi v5 webhook payload: { event, model, uid, entry }
  const uid: string | undefined = body?.model ?? body?.uid;
  const event: string = body?.event ?? "unknown";

  const tags = uid ? (UID_TO_TAGS[uid] ?? ["strapi-content"]) : ["strapi-content"];

  console.log(`[revalidate] event=${event} uid=${uid} tags=${tags.join(",")}`);

  for (const tag of tags) {
    revalidateTag(tag);
  }

  return NextResponse.json({
    revalidated: true,
    tags,
    event,
    uid: uid ?? null,
    timestamp: new Date().toISOString(),
  });
}

