import type { NextAuthConfig } from "next-auth";

export function isSessionAdmin(sessionOrAuth: unknown): boolean {
  if (!sessionOrAuth || typeof sessionOrAuth !== "object") return false;
  const user = (sessionOrAuth as { user?: { email?: string | null; role?: string | null } }).user;
  if (!user) return false;
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@thecrochetdiaryy.com").toLowerCase().trim();
  const userEmail = (user.email || "").toLowerCase().trim();
  const role = user.role;
  return role === "ADMIN" || userEmail === adminEmail;
}

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "your-super-secret-random-key",
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname === "/admin" || nextUrl.pathname.startsWith("/admin/");
      const isAccountRoute = nextUrl.pathname === "/account" || nextUrl.pathname.startsWith("/account/");

      if (isAdminRoute) {
        if (!isLoggedIn) {
          const redirectUrl = new URL("/login", nextUrl.origin);
          redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
          return Response.redirect(redirectUrl);
        }

        if (!isSessionAdmin(auth)) {
          return Response.redirect(new URL("/", nextUrl.origin));
        }

        return true;
      }

      if (isAccountRoute) {
        if (!isLoggedIn) {
          const redirectUrl = new URL("/login", nextUrl.origin);
          redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
          return Response.redirect(redirectUrl);
        }
        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = user.id;
        token.phone = (user as { phone?: string }).phone;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) || (token.sub as string);
        (session.user as { role?: string }).role = (token.role as string) || "CUSTOMER";
        (session.user as { phone?: string }).phone = token.phone as string | undefined;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
