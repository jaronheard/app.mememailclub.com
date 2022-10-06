import { withSentryConfig } from "@sentry/nextjs";
import { env } from "./src/env/server.mjs";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default withSentryConfig(
  defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ["res.cloudinary.com", "lob-assets.com"],
    },
    sentry: {
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/
      disableServerWebpackPlugin: true,
      disableClientWebpackPlugin: true,
    },
    api: {
      externalResolver: true,
    },
    // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
    // i18n: {
    //   locales: ["en"],
    //   defaultLocale: "en",
    // },
    async redirects() {
      return [];
    },
  })
);
