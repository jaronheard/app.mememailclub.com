import Layout from "../components/Layout";
import { EnvelopeIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Img from "../components/Img";

const Home = () => {
  return (
    <Layout>
      <div className="relative -mx-6 overflow-hidden bg-transparent pt-16 pb-32">
        <div className="relative">
          <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
              <div>
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600">
                    <EnvelopeIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="mt-6">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Explore postcards as art
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Memes by mail? Yes, please! We'll send you a postcard with a
                    meme on it every week. You can also send postcards to your
                    friends.
                  </p>
                  <div className="mt-6">
                    <Link href="/publications">
                      <a className="inline-flex rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                        Explore
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="-mr-48 pl-4 sm:pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                <Img
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="https://res.cloudinary.com/jaronheard/image/upload/v1664946088/mail/meme_mail_1_front_vhxrff.pdf"
                  alt="Postcard sample"
                  width="900"
                  height="600"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-24">
          <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:py-32 lg:px-0">
              <div>
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-600">
                    <SparklesIcon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="mt-6">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Automagically send postcards
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Are you a creator? Create a postcard publication and share
                    your creativity to mailboxes without the hassle of printing
                    and mailing. Make money while you sleep!
                  </p>
                  <div className="mt-6">
                    <Link href="/publications/new">
                      <a className="inline-flex rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                        Create
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:col-start-1 lg:mt-0">
              <div className="-ml-48 pr-4 sm:pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                <Img
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="https://res.cloudinary.com/jaronheard/image/upload/v1664946094/mail/meme_mail_1_back_gcxuuo.pdf"
                  alt="Postcard sample"
                  width="900"
                  height="600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
