// src/pages/_app.tsx
import type { AppType } from "next/app";
import "../styles/globals.css";
import ChatwootWidget from "../components/Chatwoot";
import { Router, useRouter } from "next/router";
import * as Fathom from "fathom-client";
import { useEffect } from "react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import Layout from "../components/Layout";
import NextAdapterPages from "next-query-params/pages";
import { QueryParamProvider } from "use-query-params";
import { useReportWebVitals } from "next-axiom";
import QueryErrorBoundary from "../components/QueryErrorBoundary";

// Record a pageview when route changes
Router.events.on("routeChangeComplete", (as, routeProps) => {
  if (!routeProps.shallow) {
    Fathom.trackPageview();
  }
});

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  const router = useRouter();
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
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ChatwootWidget />
        <Layout>
          <QueryParamProvider adapter={NextAdapterPages}>
            <QueryErrorBoundary resetKey={router.pathname}>
              <Component {...pageProps} />
            </QueryErrorBoundary>
          </QueryParamProvider>
        </Layout>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};

export default MyApp;
