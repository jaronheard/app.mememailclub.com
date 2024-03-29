import { withAxiom } from "next-axiom";
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

export default withAxiom(
  defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    images: {
      domains: ["res.cloudinary.com", "lob-assets.com", "images.unsplash.com"],
    },
    // Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
    // i18n: {
    //   locales: ["en"],
    //   defaultLocale: "en",
    // },
    async redirects() {
      return [
        {
          source: "/qr",
          destination:
            "/?utm_campaign=qr+stamp&utm_source=postcard&utm_medium=qr",
          permanent: true,
        },
        {
          source: "/login",
          destination: "/sign-in",
          permanent: true,
        },
      ];
    },
  })
);
