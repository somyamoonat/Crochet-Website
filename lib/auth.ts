import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { findFallbackUserByEmail } from "./customer-store";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(1, "Password is required"),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const normalizedEmail = email.toLowerCase().trim();

        const adminEmail = (process.env.ADMIN_EMAIL || "admin@thecrochetdiaryy.com").toLowerCase().trim();
        const adminPassword = process.env.ADMIN_PASSWORD || "supersecretadminpassword";

        // Fast-path: Instant verification for Admin without waiting for database
        if (normalizedEmail === adminEmail && password === adminPassword) {
          return {
            id: "user_admin_nitika",
            name: "Nitika Tanted (Founder & Admin)",
            email: adminEmail,
            role: "ADMIN",
            phone: "+919770124355",
          };
        }

        // 1. Try querying PostgreSQL database with timeout safeguard
        try {
          const dbPromise = prisma.user.findUnique({
            where: { email: normalizedEmail },
          });
          const user = await Promise.race([
            dbPromise.catch(() => null),
            new Promise<null>((res) => setTimeout(() => res(null), 1200)),
          ]);

          if (user && user.passwordHash) {
            const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
            if (passwordsMatch) {
              return {
                id: user.id,
                name: user.name || "Customer",
                email: user.email,
                role: user.role,
                phone: user.phone || undefined,
              };
            }
          }
        } catch (dbError) {
          console.warn("Database unavailable during authentication check:", dbError);
        }

        // 2. Fallback store check (handles seeded admin and registered customers during local dev)
        try {
          const fallbackUser = await findFallbackUserByEmail(normalizedEmail);
          if (fallbackUser) {
            const passwordsMatch = await bcrypt.compare(password, fallbackUser.passwordHash);
            if (passwordsMatch) {
              return {
                id: fallbackUser.id,
                name: fallbackUser.name,
                email: fallbackUser.email,
                role: fallbackUser.role,
                phone: fallbackUser.phone,
              };
            }
          }
        } catch (fallbackError) {
          console.error("Error checking fallback store:", fallbackError);
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "your-super-secret-random-key",
});
