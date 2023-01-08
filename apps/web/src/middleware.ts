import { NextMiddleware, NextResponse } from "next/server";

const handler: NextMiddleware = async (req) => {
   const sessionToken = req.cookies.get("next-auth.session-token");

   const path = req.nextUrl.pathname;
   const redirectLoginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign-in${
      path !== "/" ? `?callbackUrl=${encodeURIComponent(path)}` : ""
   }`;

   if (typeof sessionToken !== "string")
      return NextResponse.redirect(redirectLoginUrl);

   const r = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/proxy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         action: "session",
         sessionToken,
      }),
   });

   const response = await r.json();

   if (r.status !== 200 || Object.keys(response).length === 0)
      return NextResponse.redirect(redirectLoginUrl);

   if (!path.startsWith("/app") && !path.includes("/sign-in"))
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app`);

   return NextResponse.next();
};

export const config = { matcher: ["/app", "/", "/app/:path*"] };

export default handler;
