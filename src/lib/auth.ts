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
    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id;
      }

      return token;
    },
    session: ({ token, session }) => {
      if (session.user) {
        session.user.id = token.userId;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers: { GET, POST } } = NextAuth(config);