import { createTRPCRouter } from "./trpc";

import { authRouter } from "./router/auth";
import { spotifyRouter } from "./router/spotify";
import { feedRouter } from "./router/feed";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  spotify: spotifyRouter,
  feed: feedRouter,
});

export type AppRouter = typeof appRouter;
