/* eslint-disable react/no-unescaped-entities */
import { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";

const faqs = [
  {
    question: "How do you print and send postcards?",
    answer:
      "We use a third-party printing service (Lob) to print and send your postcards. Lob is a trusted printing service that has been in business for over 5 years. They print and send postcards for many other companies, including Expedia and Gusto. We use Lob because they are reliable, affordable, and have a great reputation.",
  },
  {
    question: "Can I track my postcard? How long does it take to arrive?",
    answer:
      "To be true to the postcard experience, we do not provide tracking information. Just hit send and wait for your postcard to arrive. It usually takes 3-5 days to arrive in the US.",
  },
  {
    question: "Can I send a postcard to a PO Box?",
    answer: "Yes! We support sending postcards to PO Boxes.",
  },
  {
    question: "Can I send a postcard to an international address?",
    answer: "Not yet! We are working on it.",
  },
];

const FAQ: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Frequently asked questions - PostPostcard</title>
      </Head>
      <div>
        <div className="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:py-40 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Can’t find the answer you’re looking for? Send us a message on
                our live chat.
              </p>
            </div>
            <div className="mt-10 lg:col-span-7 lg:mt-0">
              <dl className="space-y-10">
                {faqs.map((faq) => (
                  <div key={faq.question}>
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      {faq.question}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;
