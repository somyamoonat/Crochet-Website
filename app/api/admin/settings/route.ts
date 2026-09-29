import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isSessionAdmin } from "@/lib/auth.config";
import { getStoreSettings, updateStoreSettings } from "@/lib/admin-store";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json({ success: false, error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!isSessionAdmin(session)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updated = await updateStoreSettings({
      cityName: body.cityName?.trim() || "Ratlam",
      deliveryFee: Number(body.deliveryFee) || 0,
      freeDeliveryThreshold: Number(body.freeDeliveryThreshold) || 0,
      whatsappNumber: body.whatsappNumber?.trim() || "+91 97701 24355",
      founderName: body.founderName?.trim() || "Nitika Tanted",
      studioAddressNote: body.studioAddressNote?.trim() || "",
    });

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
