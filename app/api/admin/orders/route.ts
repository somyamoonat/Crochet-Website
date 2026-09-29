import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isSessionAdmin } from "@/lib/auth.config";
import { getAdminOrdersList } from "@/lib/admin-store";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!isSessionAdmin(session)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status") || "ALL";
    const paymentStatus = searchParams.get("paymentStatus") || "ALL";

    const orders = await getAdminOrdersList({ status, paymentStatus });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 });
  }
}
