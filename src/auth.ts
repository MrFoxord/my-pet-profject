import "server-only";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Facebook from "next-auth/providers/facebook";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const sessionStrategy =
  process.env.AUTH_SESSION_STRATEGY === "database" ? "database" : "jwt";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    })
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  );
}

export const authProviderStates = [
  {
    id: "google",
    name: "Google",
    enabled: Boolean(
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ),
  },
  {
    id: "github",
    name: "GitHub",
    enabled: Boolean(
      process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    enabled: Boolean(
      process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET
    ),
  },
] as const;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as never),
  session: {
    strategy: sessionStrategy,
  },
  secret: process.env.AUTH_SECRET ?? "dev-auth-secret",
  trustHost: true,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.userEmail = user.email ?? null;
        token.userName = user.name ?? null;
        token.userImage = user.image ?? null;
        token.monetizationRole = user.monetizationRole ?? "FREE";
        token.workRole = user.workRole ?? "CLIENT";
      }

      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        if (sessionStrategy === "database" && user) {
          session.user.id = user.id;
          session.user.email = user.email ?? null;
          session.user.name = user.name ?? null;
          session.user.image = user.image ?? null;
          session.user.monetizationRole = user.monetizationRole ?? "FREE";
          session.user.workRole = user.workRole ?? "CLIENT";
        } else {
          session.user.id = (token.userId as string) ?? session.user.id;
          session.user.email = (token.userEmail as string | null) ?? session.user.email ?? null;
          session.user.name = (token.userName as string | null) ?? session.user.name ?? null;
          session.user.image = (token.userImage as string | null) ?? session.user.image ?? null;
          session.user.monetizationRole =
            (token.monetizationRole as "FREE" | "SUBMITTED" | "PREMIUM") ??
            "FREE";
          session.user.workRole =
            (token.workRole as "CLIENT" | "EXECUTOR" | "ORGANIZER" | "CEO") ??
            "CLIENT";
        }
      }

      return session;
    },
  },
});
