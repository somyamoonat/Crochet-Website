import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { findFallbackUserByEmail, saveFallbackUser } from "@/lib/customer-store";
import { Role } from "@prisma/client";

const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, password, phone } = result.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists in DB
    try {
      const dbPromise = prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      const existingUser = await Promise.race([
        dbPromise.catch(() => null),
        new Promise<null>((res) => setTimeout(() => res(null), 1200)),
      ]);

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists" },
          { status: 409 }
        );
      }
    } catch {
      // DB might be offline, continue to fallback check
    }

    // Check fallback user store
    const existingFallback = await findFallbackUserByEmail(normalizedEmail);
    if (existingFallback) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = "user_" + Math.random().toString(36).substring(2, 11);

    // Save to PostgreSQL if available
    try {
      const dbPromise = prisma.user.create({
        data: {
          name,
          email: normalizedEmail,
          passwordHash,
          phone: phone || null,
          role: Role.CUSTOMER,
        },
      });
      await Promise.race([
        dbPromise.catch(() => null),
        new Promise<null>((res) => setTimeout(() => res(null), 1200)),
      ]);
    } catch (dbErr) {
      console.warn("DB offline during registration, saving to fallback store:", dbErr);
    }

    // Save to fallback store
    saveFallbackUser({
      id: userId,
      name,
      email: normalizedEmail,
      passwordHash,
      role: "CUSTOMER",
      phone,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully! You can now log in.",
      user: {
        name,
        email: normalizedEmail,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong creating your account." },
      { status: 500 }
    );
  }
}
