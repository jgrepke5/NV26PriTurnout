import { NextResponse } from "next/server";
import { refreshSnapshot } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await refreshSnapshot();
    return NextResponse.json({
      ok: true,
      fetchedAt: snapshot.fetchedAt,
      sheets: snapshot.sheets.map((s) => ({
        title: s.title,
        rows: s.rows.length,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Sync failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
