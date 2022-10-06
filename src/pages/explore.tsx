import { useSession } from "next-auth/react";
import DefaultQueryCell from "../components/DefaultQueryCell";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import { PostcardPreview } from "../components/PostcardPreview";

const PostcardGallery = () => {
  const itemsQuery = trpc.useQuery(["items.getAll"]);

  return (
    <DefaultQueryCell
      query={itemsQuery}
      empty={() => <div>No postcards</div>}
      success={({ data: items }) => (
        <div className="bg-white">
          <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Products</h2>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
              {items.map((item) => (
                <PostcardPreview
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  front={item.front}
                  back={item.back}
                  stripePaymentLink={item.stripePaymentLink}
                  author={item.publication.author.name || "Anonymous"}
                  optimizeImages={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    />
  );
};

const Address = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
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
          title="Explore postcards"
        >
          <PostcardGallery />
        </Layout>
      ) : (
        <Layout title="Explore postcards">
          <PostcardGallery />
        </Layout>
      )}
    </>
  );
};

export default Address;
