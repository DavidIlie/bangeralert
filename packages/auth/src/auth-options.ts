import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import SpotifyProvider from "next-auth/providers/spotify";

import { prisma } from "@acme/db";
import { checkCounterpart, getData, nativeProviders } from "./providers";

const adapter = PrismaAdapter(prisma);

export const authOptions: NextAuthOptions = {
  adapter,
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        url: getData("spotify").discovery?.authorizationEndpoint,
        params: { scope: getData("spotify").scopes.join(" ") },
      },
    }),
    {
      ...SpotifyProvider({
        name: "Spotify Expo",
        checks: ["state"],
        clientId: process.env.SPOTIFY_CLIENT_ID as string,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
        token: {
          async request(context) {
            const tokens = await context.client.oauthCallback(
              process.env.NEXTAUTH_EXPO_URL,
              context.params,
              context.checks,
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
    async session({ session, user }) {
      if (session?.user) {
        if ((user as any).username === null)
          await prisma.user.update({
            where: { id: user.id },
            data: {
              username: user.name?.split(" ").join("-").toLocaleLowerCase(),
            },
          });

        session.user.id = user.id;
        session.user.description = user.description as string;
        session.user.username = user.username as string;
        session.user.website = user.website as string;

        const followData = await prisma.user.findUnique({
          where: { id: session?.user?.id },
          include: {
            FollowRecieved: true,
            FollowSent: true,
            _count: {
              select: {
                FollowRecieved: true,
                FollowSent: true,
              },
            },
          },
        });

        session.user.followers = followData?._count.FollowRecieved as number;
        session.user.following = followData?._count.FollowSent as number;
      }

      return session;
    },
  },
  // pages: {
  //   signIn: "/signin",
  // },
};

export default NextAuth(authOptions);
