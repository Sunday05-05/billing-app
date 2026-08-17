import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyUserCredentials } from "@/lib/verify-user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.userId = user.id;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user && typeof token.userId === "string") {
        session.user.id = token.userId;
      }

      return session;
    },
  },

  providers: [
    Credentials({
      name: "邮箱密码",

      credentials: {
        email: {
          label: "邮箱",
          type: "email",
        },
        password: {
          label: "密码",
          type: "password",
        },
      },

      async authorize(credentials) {
        return verifyUserCredentials(credentials);
      },
    }),
  ],
});
