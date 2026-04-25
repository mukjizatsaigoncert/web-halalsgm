import { NextResponse } from "next/server";

// Liveness probe. Returns 200 if the Next.js server is responsive.
// Does not block on upstream Strapi — that's covered by Strapi's own probe.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const startedAt = Date.now();

export async function GET() {
  return NextResponse.json({
    status: "ok",
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  });
}
