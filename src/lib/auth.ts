import NextAuth, { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";
import bcrypt from "bcryptjs";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [CredentialsProvider({
    name: "credentials",
    async authorize(credentials) {
      const { email, password } = credentials;

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
      if (isTryingToAccessApp && isAuthenticated) {
        return true;
      }
      if (!isTryingToAccessApp && isAuthenticated) {
        return Response.redirect(new URL("app/dashboard", request.nextUrl));
      }
      if (!isTryingToAccessApp && !isAuthenticated) {
        return true;
      }

      return false;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);