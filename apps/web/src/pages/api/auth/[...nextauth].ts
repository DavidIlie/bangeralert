import NextAuth from "next-auth";

import { authOptions } from "@acme/auth/backend";

export default NextAuth(authOptions as any);
