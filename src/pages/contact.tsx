/* eslint-disable react/no-unescaped-entities */
import { NextPage } from "next";
import Head from "next/head";

const FAQ: NextPage = () => {
  return (
    <>
      <Head>
        <title>Contact us - PostPostcard</title>
      </Head>
      <div className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-y-10 gap-x-8 lg:grid-cols-3">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Contact us
                </h2>
                <p className="mt-4 leading-7 text-gray-600">
                  Live chat is the best way to contact us, but you can also
                  reach us by email.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
                <div className="rounded-2xl bg-gray-50 p-10">
                  <h3 className="text-base font-semibold leading-7 text-gray-900">
                    PostPostcard
                  </h3>
                  <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                    <div>
                      <dt className="sr-only">Email</dt>
                      <dd>
                        <a
                          className="font-semibold text-indigo-600"
                          href="mailto:hi@postpostcard.com"
                        >
                          hi@postpostcard.com
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ;
