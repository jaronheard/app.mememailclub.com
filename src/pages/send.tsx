import DefaultQueryCell from "../components/DefaultQueryCell";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import Head from "next/head";
import { PostcardPreviewSimple } from "../components/PostcardPreviewSimple";
import Slideover from "../components/Slideover";
import { useState } from "react";
import { trackGoal } from "fathom-client";
import { useUser } from "@clerk/nextjs";

const Send = () => {
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(0);
  const [itemLink, setItemLink] = useState("");
  const [itemFront, setItemFront] = useState("");
  const itemsQuery = trpc.useQuery(["items.getPublished"]);

  return (
    <>
      <Slideover
        open={open}
        setOpen={setOpen}
        itemId={itemId}
        itemLink={itemLink}
        itemFront={itemFront}
      ></Slideover>
      <div className="mx-auto my-8 max-w-7xl px-4 sm:my-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-indigo-600">Postcards</h2>
          <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            All designs
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
        loading={() => (
          <div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Products</h2>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
              {[0, 1, 2, , 3, 4, 5, 6, 7].map((item) => (
                <PostcardPreviewSimple
                  key={item}
                  loadingState={true}
                  front=""
                  name=""
                  description=""
                  onClick={() => null}
                />
              ))}
            </div>
          </div>
        )}
        success={({ data: items }) => (
          <div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Products</h2>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
              {items.map((item) => (
                <PostcardPreviewSimple
                  key={item.id}
                  front={item.front}
                  name={item.name}
                  description={item.description}
                  onClick={() => {
                    setItemId(item.id);
                    setItemLink(item.stripePaymentLink);
                    setItemFront(item.front);
                    setOpen(true);
                    trackGoal("1WFW5D7J", 0);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      />
    </>
  );
};

const Page = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <Layout
      user={
        !isLoaded || !isSignedIn
          ? undefined
          : {
              name: `${user.firstName} ${user.lastName}`,
              email: user.primaryEmailAddress?.emailAddress,
              imageUrl: user.imageUrl,
            }
      }
    >
      <Head>
        <title>Create unique postcards - PostPostcard</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Send />
    </Layout>
  );
};

export default Page;
