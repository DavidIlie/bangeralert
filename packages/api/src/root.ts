import { createTRPCRouter } from "./trpc";

import { authRouter } from "./router/auth";
import { spotifyRouter } from "./router/spotify";
import { feedRouter } from "./router/feed";
import { songRouter } from "./router/song";
import { baseRouter } from "./router/base";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  spotify: spotifyRouter,
  feed: feedRouter,
  song: songRouter,
  base: baseRouter,
});

export type AppRouter = typeof appRouter;
