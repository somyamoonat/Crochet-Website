import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getFallbackAddressesByUserId,
  saveFallbackAddress,
  deleteFallbackAddress,
  FallbackAddress,
} from "@/lib/fallback-addresses";
import { z } from "zod";

const addressSchema = z.object({
  id: z.string().optional(),
  recipientName: z.string().trim().min(2, "Recipient name is required"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits"),
  label: z.string().trim().default("Default Delivery"),
  line1: z.string().trim().min(5, "Street address must be at least 5 characters"),
  line2: z.string().trim().optional().nullable(),
  city: z.string().trim().default("Ratlam"),
  state: z.string().trim().default("Madhya Pradesh"),
  pincode: z.string().trim().regex(/^\d{6}$/, "Must be a valid 6-digit pincode"),
  isDefault: z.boolean().default(true),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id || session.user.email || "customer";
    const userEmail = session.user.email;
    const userName = session.user.name;

    // 1. Try reading from PostgreSQL
    try {
      const dbAddresses = await prisma.address.findMany({
        where: { userId },
        orderBy: { isDefault: "desc" },
      });

      if (dbAddresses && dbAddresses.length > 0) {
        const formatted: FallbackAddress[] = dbAddresses.map((a) => ({
          id: a.id,
          userId: a.userId,
          recipientName: userName || "Somya Moonat",
          phone: a.phone,
          label: a.label || "Delivery Address",
          line1: a.line1,
          line2: a.line2,
          city: a.city,
          state: "Madhya Pradesh",
          pincode: a.pincode,
          isDefault: a.isDefault,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        return NextResponse.json({ success: true, addresses: formatted, source: "database" });
      }
    } catch (dbErr) {
      console.warn("Database unavailable during GET /api/addresses, using fallback store:", dbErr);
    }

    // 2. Fallback in-memory/file store
    const addresses = getFallbackAddressesByUserId(userId, userEmail, userName);
    return NextResponse.json({ success: true, addresses, source: "fallback" });
  } catch (error) {
    console.error("GET /api/addresses error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch addresses" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id || session.user.email || "customer";
    const body = await req.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const addressId = data.id || `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // 1. Save to fallback store
    const saved = saveFallbackAddress({
      id: addressId,
      userId,
      recipientName: data.recipientName,
      phone: data.phone,
      label: data.label || "Default Delivery",
      line1: data.line1,
      line2: data.line2 || "",
      city: data.city || "Ratlam",
      state: data.state || "Madhya Pradesh",
      pincode: data.pincode,
      isDefault: data.isDefault,
    });

    // 2. Try persisting to PostgreSQL
    try {
      await prisma.address.upsert({
        where: { id: addressId },
        create: {
          id: addressId,
          userId,
          label: data.label,
          line1: data.line1,
          line2: data.line2 || null,
          city: data.city,
          pincode: data.pincode,
          phone: data.phone,
          isDefault: data.isDefault,
        },
        update: {
          label: data.label,
          line1: data.line1,
          line2: data.line2 || null,
          city: data.city,
          pincode: data.pincode,
          phone: data.phone,
          isDefault: data.isDefault,
        },
      });
    } catch (dbErr) {
      console.warn("Database unavailable during POST /api/addresses, fallback saved:", dbErr);
    }

    return NextResponse.json({ success: true, address: saved });
  } catch (error) {
    console.error("POST /api/addresses error:", error);
    return NextResponse.json({ success: false, error: "Failed to save address" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing address ID" }, { status: 400 });
    }

    const userId = session.user.id || session.user.email || "customer";

    // 1. Try PostgreSQL
    try {
      await prisma.address.delete({
        where: { id },
      });
    } catch (dbErr) {
      console.warn("Database unavailable during DELETE /api/addresses:", dbErr);
    }

    // 2. Delete from fallback store
    deleteFallbackAddress(id, userId);

    return NextResponse.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/addresses error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete address" }, { status: 500 });
  }
}
