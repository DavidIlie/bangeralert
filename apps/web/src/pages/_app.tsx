import type { AppType } from "next/app";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { DefaultSeo } from "next-seo";

import "../styles/globals.css";
import { api } from "../lib/api";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [hasLoaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <>
      <DefaultSeo
        defaultTitle="BangerAlert"
        titleTemplate="%s | BangerAlert"
        openGraph={{
          title: `BangerAlert`,
          type: `website`,
          site_name: `BangerAlert`,
          images: [
            {
              url: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
              alt: `Logo`,
            },
          ],
        }}
        description="Yet another app to share music with your friends"
      />
      <SessionProvider session={session}>
        <div className="flex flex-col min-h-screen text-white bg-dark-bg">
          {hasLoaded && <Component {...pageProps} />}
        </div>
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
