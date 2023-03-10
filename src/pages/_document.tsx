import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-full bg-gray-100">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Sen:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Send unusually large custom postcards to your friends, family & business connections using PostPostcard. All from your computer or smartphone."
        />
        <meta
          name="keywords"
          content="postcard, custom, online, photo, design, delivery"
        />
        <meta name="author" content="PostPostcard" />
        <meta
          property="og:title"
          content="PostPostcard - Create and send custom postcards online"
        />
        <meta
          property="og:description"
          content="Send unusually large custom postcards to your friends, family & business connections using PostPostcard. All from your computer or smartphone."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/c_fill,w_1200,h_630/mail/postcards_2_ywp9uz"
        />
        <meta property="og:url" content="https://postpostcard.com/" />
      </Head>
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
