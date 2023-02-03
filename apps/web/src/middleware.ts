import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;

  console.log("pre hay");

  if (path.startsWith("/app")) {
    const sessionToken = req.cookies.get("next-auth.session-token");

    console.log("hey", sessionToken);

    const redirectLoginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign-in${
      path !== "/" ? `?callbackUrl=${encodeURIComponent(path)}` : ""
    }`;

    if (typeof sessionToken?.value !== "string")
      return NextResponse.redirect(redirectLoginUrl);

    console.log("made it past first redirect");

    const r = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/proxy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "session",
        sessionToken,
      }),
    });

    try {
      if (r.status !== 200) return NextResponse.redirect(redirectLoginUrl);
      console.log("made it past second redirect");
      return NextResponse.next();
    } catch (error) {
      console.log("error");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/sign-in?error=checkauth`,
      );
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export default middleware;
