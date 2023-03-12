import { useSession } from "next-auth/react";
import DefaultQueryCell from "../components/DefaultQueryCell";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import LoadingLayout from "../components/LoadingLayout";
import Head from "next/head";
import { PostcardPreviewSimple } from "../components/PostcardPreviewSimple";

const PostcardGallery = () => {
  const itemsQuery = trpc.useQuery(["items.getAll"]);

  return (
    <>
      <div className="mx-auto my-8 max-w-7xl px-4 sm:my-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-indigo-600">Postcards</h2>
          <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Let&apos;s get physical (mail)
          </p>
          <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
            Send a 6&quot;x9&quot; postcard for{" "}
            <span className="font-semibold text-indigo-600">$1</span>*
          </p>
          <p className="mx-auto max-w-xl text-xs text-gray-500">
            <em>*U.S. addresses only</em>
          </p>
        </div>
      </div>
      <DefaultQueryCell
        query={itemsQuery}
        empty={() => <div>No postcards</div>}
        success={({ data: items }) => (
          <div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Products</h2>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
              {items.map((item) => (
                <PostcardPreviewSimple
                  key={item.id}
                  front={item.front}
                  stripePaymentLink={item.stripePaymentLink}
                />
              ))}
            </div>
          </div>
        )}
      />
    </>
  );
};

const Send = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingLayout />;
  }

  return (
    <>
      {session ? (
        <Layout
          user={{
            name: session.user?.name,
            email: session.user?.email,
            imageUrl: session.user?.image,
          }}
        >
          <Head>
            <title>Send unique postcards - PostPostcard</title>
          </Head>
          <PostcardGallery />
        </Layout>
      ) : (
        <Layout>
          <Head>
            <title>Send unique postcards - PostPostcard</title>
          </Head>
          <PostcardGallery />
        </Layout>
      )}
    </>
  );
};

export default Send;
