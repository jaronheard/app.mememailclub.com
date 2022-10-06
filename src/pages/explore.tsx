import { useSession } from "next-auth/react";
import DefaultQueryCell from "../components/DefaultQueryCell";
import Img from "../components/Img";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";

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
                <div
                  key={item.id}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  <div className="aspect-w-9 aspect-h-6 sm:aspect-none bg-gray-200 group-hover:opacity-75 sm:h-96">
                    <Img
                      src={item.front}
                      alt=""
                      className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
                      width={450}
                      height={300}
                    />
                  </div>
                  <div className="aspect-w-9 aspect-h-6 sm:aspect-none bg-gray-200 group-hover:opacity-75 sm:h-96">
                    <Img
                      src={item.back}
                      alt=""
                      className="h-full w-full border-b border-gray-100 object-cover object-center sm:h-full sm:w-full"
                      width={450}
                      height={300}
                    />
                  </div>
                  <div className="flex flex-1 flex-col space-y-2 p-4">
                    <h3 className="text-sm font-medium text-gray-900">
                      <a href={item.stripePaymentLink}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {item.name}
                      </a>
                    </h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                    <div className="flex flex-1 flex-col justify-end">
                      <p className="text-sm italic text-gray-500">
                        {item.publication.author.name}
                      </p>
                      <p className="text-base font-medium text-gray-900">$2</p>
                    </div>
                  </div>
                </div>
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
