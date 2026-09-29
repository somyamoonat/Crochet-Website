import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isSessionAdmin } from "@/lib/auth.config";
import { getDashboardMetrics } from "@/lib/admin-store";

export async function GET() {
  try {
    const session = await auth();
    if (!isSessionAdmin(session)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const metrics = await getDashboardMetrics();
    return NextResponse.json({ success: true, ...metrics });
  } catch (error) {
    console.error("GET /api/admin/metrics error:", error);
    return NextResponse.json({ success: false, error: "Failed to load metrics" }, { status: 500 });
  }
}
