/* eslint-disable react/no-unescaped-entities */
import { Disclosure } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/20/solid";
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

const FAQ = () => {
  return (
    <div>
      <div className="">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40 lg:px-8">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
              Frequently asked questions
            </h2>
            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              {faqs.map((faq) => (
                <Disclosure as="div" key={faq.question} className="pt-6">
                  {({ open }) => (
                    <>
                      <dt>
                        <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                          <span className="text-base font-semibold leading-7">
                            {faq.question}
                          </span>
                          <span className="ml-6 flex h-7 items-center">
                            {open ? (
                              <MinusSmallIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusSmallIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        <p className="text-base leading-7 text-gray-600">
                          {faq.answer}
                        </p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
