import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";
import { authSchema } from "@/lib/validations";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [CredentialsProvider({
    name: "credentials",
    async authorize(credentials) {

      const validatedCredentials = authSchema.safeParse(credentials);

      if (!validatedCredentials.success) {
        return null;
      }
      const { email, password } = validatedCredentials.data;


      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        console.log("User not found");
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

      if (!isValidPassword) {
        console.log("Invalid password");
        return null;
      }

      return user;
    },
  })],
  callbacks: {
    authorized: ({ request, auth }) => {
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");
      const isAuthenticated = Boolean(auth?.user);

      if (isTryingToAccessApp && !isAuthenticated) {
        return false;
      }

      if (isAuthenticated && isTryingToAccessApp && !auth?.user.hasAccess) {
        return Response.redirect(new URL("/payment", request.nextUrl));
      }

      if (isTryingToAccessApp && isAuthenticated && auth?.user.hasAccess) {
        return true;
      }

      if (
        isAuthenticated &&
        (request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")) &&
        auth?.user.hasAccess
      ) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      if (isAuthenticated && !isTryingToAccessApp && !auth?.user.hasAccess) {
        if (
          request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")
        ) {
          return Response.redirect(new URL("/payment", request.nextUrl));
        }

        return true;
      }

      if (!isTryingToAccessApp && !isAuthenticated) {
        return true;
      }

      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        // on sign in
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }

      if (trigger === "update") {
        // on every request
        const userFromDb = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });
        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess;
        }
      }

      return token;
    },
    session: ({ token, session }) => {
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config);