import Layout from "../components/Layout";
import { EnvelopeIcon, SparklesIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Img from "../components/Img";
import Button from "../components/Button";

const Home = () => {
  return (
    <Layout>
      <div className="relative -mx-6 overflow-hidden bg-transparent pt-16 pb-32">
        <div className="relative">
          <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
              <div>
                <div className="mt-6">
                  <h2 className="text-4xl font-extrabold text-gray-900">
                    Explore postcards as art
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Get any postcard for $1! You can also send postcards to your
                    friends.
                  </p>
                  <div className="mt-6">
                    <Button href="/explore">Explore</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="-mr-48 pl-4 sm:pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                <Img
                  className="rounded-xl w-full shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="https://images.unsplash.com/photo-1557717398-f6a5f68cd158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1625&q=80"
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
                <div className="mt-6">
                  <h2 className="text-4xl font-extrabold text-gray-900">
                    Automagically send postcards
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Are you a creator? Create and share your creativity to
                    mailboxes without the hassle of printing and mailing.
                  </p>
                  <div className="mt-6">
                    <Button href="/publications/new">Create</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:col-start-1 lg:mt-0">
              <div className="-ml-48 pr-4 sm:pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                <Img
                  className="rounded-xl w-full shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="https://images.unsplash.com/photo-1636971828014-0f3493cba88a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
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
