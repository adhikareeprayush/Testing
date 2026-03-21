import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { isFarmerRole, isSuperAdminRole } from "@/lib/roles";

// Edge-compatible auth config (no Prisma/Node.js APIs)
export const authConfig: NextAuthConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async () => null,
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      const loggedIn = !!auth?.user;
      const role = auth?.user?.role;

      const redirectLogin = () => {
        const url = new URL("/login", nextUrl);
        url.searchParams.set("callbackUrl", path);
        return Response.redirect(url);
      };

      // Farmers cannot shop (no spending in-app)
      if (path.startsWith("/cart") || path.startsWith("/checkout")) {
        if (loggedIn && isFarmerRole(role)) {
          return Response.redirect(new URL("/farmer/dashboard", nextUrl));
        }
      }

      if (path.startsWith("/farmer")) {
        if (!loggedIn) return redirectLogin();
        if (!isFarmerRole(role)) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (path.startsWith("/super-admin")) {
        if (!loggedIn) return redirectLogin();
        if (!isSuperAdminRole(role)) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      if (path.startsWith("/admin")) {
        if (!loggedIn) return redirectLogin();
        if (!isSuperAdminRole(role) && !isFarmerRole(role)) {
          return Response.redirect(new URL("/", nextUrl));
        }
        return true;
      }

      const userProtected = ["/user/dashboard", "/user/orders"].some((p) =>
        path.startsWith(p)
      );
      const checkoutProtected = path.startsWith("/checkout");

      if ((userProtected || checkoutProtected) && !loggedIn) {
        return redirectLogin();
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const u = user as {
          id?: string;
          role?: string;
          farmerVerified?: boolean;
        };
        token.role = u.role;
        token.id = u.id;
        token.farmerVerified = u.farmerVerified ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.farmerVerified = Boolean(token.farmerVerified);
      }
      return session;
    },
  },
};
