import { useSession } from "next-auth/react";
import DefaultQueryCell from "../components/DefaultQueryCell";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import { PostcardPreview } from "../components/PostcardPreview";
import LoadingLayout from "../components/LoadingLayout";
import { itemSizeToClient } from "../utils/itemSize";
import Head from "next/head";

const PostcardGallery = () => {
  const itemsQuery = trpc.useQuery(["items.getAll"]);

  return (
    <>
      <Head>
        <title>Send unique postcards - PostPostcard</title>
      </Head>
      <div className="mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-indigo-600">Postcards</h2>
          <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Let&apos;s get physical (mail)
          </p>
          <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
            Huge 6&quot;x9&quot; postcards are{" "}
            <span className="font-semibold text-indigo-600">only $1</span>{" "}
            printed and mailed to anywhere in the US!
          </p>
        </div>
      </div>
      <DefaultQueryCell
        query={itemsQuery}
        empty={() => <div>No postcards</div>}
        success={({ data: items }) => (
          <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Products</h2>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
              {items.map((item) => (
                <PostcardPreview
                  key={item.id}
                  itemId={item.id}
                  name={item.name}
                  description={item.description}
                  front={item.front}
                  back={item.back}
                  stripePaymentLink={item.stripePaymentLink}
                  author={item.publication.author.name || "Anonymous"}
                  optimizeImages={true}
                  messages={item.Messages}
                  size={itemSizeToClient(item.size)}
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
          <PostcardGallery />
        </Layout>
      ) : (
        <Layout>
          <PostcardGallery />
        </Layout>
      )}
    </>
  );
};

export default Send;
