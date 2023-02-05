import type { AppType } from "next/app";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { DefaultSeo } from "next-seo";
import NextNprogress from "nextjs-progressbar";
import { MantineProvider, LoadingOverlay } from "@mantine/core";

import "../styles/globals.css";
import { api } from "../lib/api";
import { useLoadingStore } from "../stores/useLoadingStore";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { loading } = useLoadingStore();

  return (
    <>
      <NextNprogress
        color="#156896"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
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
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",
        }}
      >
        <SessionProvider session={session}>
          <div className="flex min-h-screen flex-col bg-dark-bg text-white">
            <LoadingOverlay visible={loading} className="fixed" />
            <Component {...pageProps} />
          </div>
        </SessionProvider>
      </MantineProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
