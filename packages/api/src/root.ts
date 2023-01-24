import { createTRPCRouter } from "./trpc";

import { authRouter } from "./router/auth";
import { spotifyRouter } from "./router/spotify";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  spotify: spotifyRouter,
});

export type AppRouter = typeof appRouter;
