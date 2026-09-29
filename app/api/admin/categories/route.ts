import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isSessionAdmin } from "@/lib/auth.config";
import { getAdminCategories, createAdminCategory, AdminCategoryInput } from "@/lib/admin-store";

export async function GET() {
  try {
    const session = await auth();
    if (!isSessionAdmin(session)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const categories = await getAdminCategories();
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!isSessionAdmin(session)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body: AdminCategoryInput = await req.json();

    if (!body.name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    const category = await createAdminCategory(body);
    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 });
  }
}
