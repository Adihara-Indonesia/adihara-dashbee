import { NextResponse } from "next/server";
import { syncSheetToSupabase } from "@/lib/sheets/sync";

// Manually triggered from the dashboard's "Refresh data" button. Could later
// be put on a cron schedule (e.g. a Vercel Cron job hitting this route) —
// nothing here assumes a browser caller.
//
// Already gated by proxy.ts (session + whitelist re-checked on every
// request, same as every other non-public route).
export async function POST() {
  try {
    const summary = await syncSheetToSupabase();
    return NextResponse.json({ ok: true, summary });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 },
    );
  }
}
