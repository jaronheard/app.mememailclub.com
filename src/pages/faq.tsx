/* eslint-disable react/no-unescaped-entities */
import { NextPage } from "next";
import Head from "next/head";
import FAQ from "../components/FAQ";

const FAQPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Frequently asked questions - PostPostcard</title>
      </Head>
      <FAQ />
    </>
  );
};

export default FAQPage;
