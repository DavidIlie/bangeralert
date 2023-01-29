import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      description?: string;
      username?: string;
      website?: string;
      followers?: number;
      following?: number;
      tags?: string[];
    } & DefaultSession["user"];
  }
}
