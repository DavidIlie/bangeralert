import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import SpotifyProvider from "next-auth/providers/spotify";

import prisma from "../prisma";
import { checkCounterpart, nativeProviders } from "./providers";

const adapter = PrismaAdapter(prisma);

export const authOptions: NextAuthOptions = {
   adapter,
   providers: [
      SpotifyProvider({
         clientId: process.env.AUTH_SPOTIFY_CLIENT_ID,
         clientSecret: process.env.AUTH_SPOTIFY_CLIENT_SECRET,
      }),
      {
         ...SpotifyProvider({
            name: "Spotify Expo",
            checks: ["state"],
            clientId: process.env.AUTH_SPOTIFY_CLIENT_ID,
            clientSecret: process.env.AUTH_SPOTIFY_CLIENT_SECRET,
            token: {
               async request(context) {
                  const tokens = await context.client.oauthCallback(
                     process.env.NEXTAUTH_EXPO_URL,
                     context.params,
                     context.checks
                  );
                  return { tokens };
               },
            },
            id: nativeProviders.spotify,
         }),
      },
   ],
   callbacks: {
      async signIn({ account }) {
         const userByAccount = await adapter.getUserByAccount({
            providerAccountId: account.providerAccountId,
            provider: account.provider,
         });
         if (!userByAccount) {
            const provider = account.provider;
            const { valid, counterpart } = checkCounterpart(provider);
            if (valid) {
               const userByAccount = await adapter.getUserByAccount({
                  providerAccountId: account.providerAccountId,
                  provider: counterpart,
               });
               if (userByAccount) {
                  await adapter.linkAccount({
                     ...account,
                     userId: userByAccount.id,
                  });
               }
            }
         }
         return true;
      },
   },
};

export default NextAuth(authOptions);
