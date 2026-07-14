import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  if (
    !process.env.PREVIEW_SECRET ||
    searchParams.get("secret") !== process.env.PREVIEW_SECRET
  ) {
    return new NextResponse("Invalid preview token", { status: 401 });
  }

  const draft = await draftMode();
  if (searchParams.get("status") === "published") draft.disable();
  else draft.enable();

  return NextResponse.redirect(new URL("/", request.url));
}
