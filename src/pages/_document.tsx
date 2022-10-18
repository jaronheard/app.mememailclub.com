import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-full bg-gray-100">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Annie+Use+Your+Telescope&display=optional"
          rel="stylesheet"
        />
      </Head>
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
