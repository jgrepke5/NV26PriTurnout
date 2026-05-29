import { NextResponse } from "next/server";
import { refreshSnapshot } from "@/lib/cache";

export const dynamic = "force-dynamic";

/** Manual refresh — optional ?secret= matches CRON_SECRET */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const url = new URL(request.url);
    const provided =
      url.searchParams.get("secret") ??
      request.headers.get("authorization")?.replace("Bearer ", "");
    if (provided !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const snapshot = await refreshSnapshot();
    return NextResponse.json({ ok: true, fetchedAt: snapshot.fetchedAt });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
