import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isSessionAdmin } from "@/lib/auth.config";
import { getAdminProducts, createAdminProduct, AdminProductInput } from "@/lib/admin-store";

export async function GET() {
  try {
    const session = await auth();
    if (!isSessionAdmin(session)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const products = await getAdminProducts();
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!isSessionAdmin(session)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body: AdminProductInput = await req.json();

    if (!body.name || !body.categorySlug) {
      return NextResponse.json(
        { success: false, error: "Product name and category are required" },
        { status: 400 }
      );
    }

    const product = await createAdminProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 });
  }
}
