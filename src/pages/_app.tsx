// src/pages/_app.tsx
import type { AppType } from "next/app";
import "../styles/globals.css";
import ChatwootWidget from "../components/Chatwoot";
import { Router } from "next/router";
import * as Fathom from "fathom-client";
import { useEffect } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "../components/Layout";
import NextAdapterPages from "next-query-params/pages";
import { QueryParamProvider } from "use-query-params";
import { useReportWebVitals } from "next-axiom";
import { trpc } from "../utils/trpc";

// Record a pageview when route changes
Router.events.on("routeChangeComplete", (as, routeProps) => {
  if (!routeProps.shallow) {
    Fathom.trackPageview();
  }
});

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  useReportWebVitals();

  // Initialize Fathom when the app loads
  useEffect(() => {
    Fathom.load("NIXBEPED", {
      includedDomains: ["postpostcard.com", "www.postpostcard.com"],
    });
  }, []);

  return (
    <ClerkProvider
      appearance={{
        variables: {
          borderRadius: "0",
          colorBackground: "#FFFAF5",
        },
      }}
      {...pageProps}
    >
      <ChatwootWidget />
      <Layout>
        <QueryParamProvider adapter={NextAdapterPages}>
          <Component {...pageProps} />
        </QueryParamProvider>
      </Layout>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
