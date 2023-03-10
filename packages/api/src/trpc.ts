import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import moment from "moment";

import { getServerSession } from "@acme/auth/backend";
import { prisma } from "@acme/db";

import { getAccessToken, makeRequest } from "./lib/spotify";

type CreateContextOptions = {
  session: Session | null;
  spotifyToken?: string | null;
};

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    spotifyToken: opts.spotifyToken,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  if (req.headers["isexpo"] === "true") {
    const sessionToken = req.headers.sessiontoken as string;
    const reqCookie = req.headers.cookie ?? "";
    const parsedCookies = reqCookie.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key as string] = value as string;
      return acc;
    }, {} as { [key: string]: string });
    parsedCookies[
      `${
        process.env.NODE_ENV === "production" ? "__Secure-" : ""
      }next-auth.session-token`
    ] = sessionToken;
    const newCookie = Object.entries(parsedCookies)
      .reduce((acc, [key, value]) => {
        acc.push(`${key}=${value}`);
        return acc;
      }, [] as string[])
      .join("; ");

    req.headers.cookie = newCookie;
  }

  let session = await getServerSession({ req, res });

  if (!session) {
    return createInnerTRPCContext({
      session,
    });
  }

  let user = await prisma.user.findFirst({
    where: { id: session?.user?.id },
    include: { accounts: true },
  });

  if (!user) throw new Error("there is no way this could happen");

  const seconds = user.accessTokenObtain
    ? moment(new Date()).diff(moment(user.accessTokenObtain), "seconds")
    : false;

  if (
    seconds > 3000 ||
    Number.isNaN(seconds) ||
    !seconds ||
    !user.accessToken
  ) {
    const data = await getAccessToken(user.accounts[0]?.refresh_token!);

    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        accessToken: data.access_token,
        accessTokenObtain: new Date(),
      },
      include: { accounts: true },
    });
  }
  if (!user.spotifyId) {
    const me = await (await makeRequest(`me`, user.accessToken!)).json();
    user = await prisma.user.update({
      where: { id: user.id },
      data: { spotifyId: me.id },
      include: { accounts: true },
    });
  }

  return createInnerTRPCContext({
    session,
    spotifyToken: user.accessToken,
  });
};

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user)
    throw new TRPCError({ code: "UNAUTHORIZED" });
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

const enforceSpotifyToken = t.middleware(({ ctx, next }) => {
  if (!ctx.spotifyToken) throw new TRPCError({ code: "BAD_REQUEST" });
  return next({
    ctx: {
      spotifyToken: ctx.spotifyToken!,
    },
  });
});

export const spotifyProcedure = t.procedure
  .use(enforceUserIsAuthed)
  .use(enforceSpotifyToken);
