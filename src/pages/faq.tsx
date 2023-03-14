/* eslint-disable react/no-unescaped-entities */
import { NextPage } from "next";
import Head from "next/head";
import FAQ from "../components/FAQ";
import Layout from "../components/Layout";

const FAQPage: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Frequently asked questions - PostPostcard</title>
      </Head>
      <FAQ />
    </Layout>
  );
};

export default FAQPage;
