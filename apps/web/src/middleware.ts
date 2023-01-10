import { NextMiddleware, NextResponse } from "next/server";

const handler: NextMiddleware = async (req) => {
   const path = req.nextUrl.pathname;
   const sessionToken = req.cookies.get("next-auth.session-token");

   const redirectLoginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign-in${
      path !== "/" ? `?callbackUrl=${encodeURIComponent(path)}` : ""
   }`;

   if (path.startsWith("/app") || path.startsWith("/sign-in")) {
      const r = await fetch(
         `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/proxy`,
         {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               action: "session",
               sessionToken: sessionToken?.value,
            }),
            credentials: "include",
         }
      );

      try {
         const response = await r.json();
         if (r.status !== 200 || Object.keys(response).length === 0)
            return NextResponse.redirect(redirectLoginUrl);
      } catch (error) {
         return NextResponse.redirect(redirectLoginUrl);
      }

      if (path.startsWith("/sign-in"))
         return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app`);

      return NextResponse.next();
   }

   if (typeof sessionToken !== "object")
      return NextResponse.redirect(redirectLoginUrl);

   if (typeof sessionToken.value !== "string")
      return NextResponse.redirect(redirectLoginUrl);

   return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app`);
};

export const config = {
   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default handler;
