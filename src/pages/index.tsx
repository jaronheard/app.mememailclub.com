import Layout from "../components/Layout";
import Img from "../components/Img";
import Button from "../components/Button";
import { useSession } from "next-auth/react";
import ComingSoon from "../components/ComingSoon";
import Link from "next/link";

const Index = () => {
  return (
    <div className="relative -mx-6 overflow-hidden bg-transparent pt-16 pb-32">
      <div className="relative">
        <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
          <div className="mx-auto max-w-xl px-4 sm:px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0">
            <div>
              <div className="mt-6">
                <h2 className="text-4xl font-extrabold text-gray-900">
                  Send weird postcards
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  Send a huge 6&quot; x 9&quot; postcard to your friends and
                  family, and add a custom message. All without touching pen or
                  paper!
                </p>
                <div className="mt-6 text-right sm:text-left">
                  <Button href="/send">Send</Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-0">
            <div className="-mr-48 pl-4 sm:pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
              <Link href="/send">
                <Img
                  className="rounded-xl w-full shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="https://res.cloudinary.com/jaronheard/image/upload/v1672891693/mail/postcards_2_ywp9uz.png"
                  alt="Postcard sample"
                  width="900"
                  height="600"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ComingSoon>
        <div className="mt-24">
          <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8">
            <div className="mx-auto max-w-xl px-4 sm:px-6 lg:col-start-2 lg:mx-0 lg:max-w-none lg:py-32 lg:px-0">
              <div>
                <div className="mt-6">
                  <h2 className="text-4xl font-extrabold text-gray-900">
                    Create your own postcards
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    Create postcard designs that anyone can use. Share your
                    creativity with the world!
                  </p>
                  <div className="mt-6 text-right sm:text-left">
                    <Button href="/publications/new">Create</Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:col-start-1 lg:mt-0">
              <div className="-ml-48 pr-4 sm:pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                <Img
                  className="rounded-xl w-full shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="https://res.cloudinary.com/jaronheard/image/upload/v1672891829/mail/photo-1572044162444-ad60f128bdea_f7qimm.avif"
                  alt="Postcard sample"
                  width="900"
                  height="600"
                />
              </div>
            </div>
          </div>
        </div>
      </ComingSoon>
    </div>
  );
};

const IndexPage = () => {
  const { data: session, status } = useSession();

  return status === "authenticated" && session.user ? (
    <Layout
      user={{
        name: session.user.name,
        email: session.user.email,
        imageUrl: session.user.image,
      }}
    >
      <Index />
    </Layout>
  ) : (
    <Layout>
      <Index />
    </Layout>
  );
};

export default IndexPage;
