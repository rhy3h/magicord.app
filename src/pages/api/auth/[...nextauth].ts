import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

// https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
const scopes = ["identify"].join(" ");

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.MAGICORD_CLIENT_ID as string,
      clientSecret: process.env.MAGICORD_CLIENT_SECRET as string,
      authorization: { params: { scope: scopes } },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.accessToken = token.accessToken as string;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token as string;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
