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