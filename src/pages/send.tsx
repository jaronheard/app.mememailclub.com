import DefaultQueryCell from "../components/DefaultQueryCell";
import { trpc } from "../utils/trpc";
import Head from "next/head";
import { PostcardPreviewSimple } from "../components/PostcardPreviewSimple";
import Slideover from "../components/Slideover";
import { useEffect, useState } from "react";
import { trackGoal } from "fathom-client";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { PostcardCreateSimple } from "../components/PostcardCreateSimple";
import { useRouter } from "next/router";

const SendSignedIn = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(0);
  const [shouldSetItemId, setShouldSetItemId] = useState(true);
  const [shouldSetOpen, setShouldSetOpen] = useState(false);
  // TODO: get only items for the current user
  const itemsQuery = trpc.useQuery([
    "items.getAllPublished",
    { latestId: `${itemId}` },
  ]);
  const { data } = itemsQuery;
  const activeItem = data?.find((item) => item.id === itemId);

  useEffect(() => {
    // Make sure we have the query param available.
    if (router.query?.id && shouldSetItemId && !shouldSetOpen) {
      // check query param is a string, not a string[]
      if (typeof router.query.id === "string") {
        setItemId(parseInt(router.query.id));
        setShouldSetItemId(false);
        setShouldSetOpen(true);
        // clear the query param
        router.replace(router.route, undefined, { shallow: true });
      }
    }
    if (shouldSetOpen && activeItem) {
      setOpen(true);
      setShouldSetOpen(false);
    }
  }, [router, shouldSetItemId, shouldSetOpen, activeItem]);

  return (
    <>
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
              <PostcardCreateSimple onClick={() => router.push("/items/new")} />
              {[0, 1, 2, 3, 4, 5, 6].map((item) => (
                <PostcardPreviewSimple
                  id={`loading-${item}`}
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
        success={({ data: items }) => {
          return (
            <>
              <Slideover
                open={open}
                setOpen={setOpen}
                itemId={activeItem?.id || 0}
                itemLink={activeItem?.stripePaymentLink || ""}
                itemFront={activeItem?.front || ""}
              ></Slideover>
              <div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Products</h2>
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
                  <PostcardCreateSimple
                    onClick={() => router.push("/items/new")}
                  />
                  {items.map((item) => (
                    <PostcardPreviewSimple
                      key={item.id}
                      id={`postcard-${item.id}`}
                      front={item.front}
                      name={`${item.visibility === "PRIVATE" ? "🔒" : "🌐"} ${
                        item.name
                      }`}
                      description={item.description}
                      onClick={() => {
                        setItemId(item.id);
                        setOpen(true);
                        trackGoal("1WFW5D7J", 0);
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          );
        }}
      />
    </>
  );
};

const SendSignedOut = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [itemId, setItemId] = useState(0);
  const itemsQuery = trpc.useQuery([
    "items.getAllPublished",
    { latestId: `${itemId}` },
  ]);

  useEffect(() => {
    // Make sure we have the query param available.
    if (router.asPath !== router.route && router.query?.id) {
      // check query param is a string, not a string[]
      if (typeof router.query.id === "string") {
        setItemId(parseInt(router.query.id));
        setOpen(true);
      }
    }
  }, [router]);

  return (
    <>
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
              {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
                <PostcardPreviewSimple
                  key={item}
                  id={`loading-${item}`}
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
        success={({ data: items }) => {
          const activeItem = items.find((item) => item.id === itemId);
          return (
            <>
              {activeItem && (
                <Slideover
                  open={open}
                  setOpen={setOpen}
                  itemId={activeItem.id}
                  itemLink={activeItem.stripePaymentLink}
                  itemFront={activeItem.front}
                ></Slideover>
              )}
              <div className="mx-auto max-w-2xl py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Products</h2>
                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
                  <PostcardCreateSimple
                    onClick={() => router.push("/items/new")}
                  />
                  {items.map((item) => (
                    <PostcardPreviewSimple
                      key={item.id}
                      id={`postcard-${item.id}`}
                      front={item.front}
                      name={item.name}
                      description={item.description}
                      onClick={() => {
                        setItemId(item.id);
                        setOpen(true);
                        trackGoal("1WFW5D7J", 0);
                      }}
                    />
                  ))}
                </div>
              </div>
            </>
          );
        }}
      />
    </>
  );
};

const Page = () => {
  return (
    <>
      <Head>
        <title>Create unique postcards - PostPostcard</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <SignedIn>
        <SendSignedIn />
      </SignedIn>
      <SignedOut>
        <SendSignedOut />
      </SignedOut>
    </>
  );
};

export default Page;
