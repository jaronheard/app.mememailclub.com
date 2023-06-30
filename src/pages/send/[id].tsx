// import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";
import Head from "next/head";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ItemSizeOpts } from "../../utils/itemSize";
import { PostcardPreviewSimple } from "../../components/PostcardPreviewSimple";
import { trpc } from "../../utils/trpc";
import DefaultQueryCell from "../../components/DefaultQueryCell";
import Slideover from "../../components/Slideover";

export type ItemFormValues = {
  name: string;
  description?: string;
  imageUrl: string;
  front: string;
  back: string;
  size: ItemSizeOpts;
  visibility: "PRIVATE" | "PUBLIC";
};

const ParamsValidator = z.object({
  id: z.optional(z.string().transform((str) => Number(str))),
});

const LoadingItem = () => (
  <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
    {[0, 1].map((item) => (
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
);

const Item = () => {
  const router = useRouter();
  const [queryStatus, setQueryStatus] = useState({
    ready: false,
    id: 0,
  });
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    // navigate to /send while preserving query params
    router.push("/send", undefined, { shallow: true });
    setOpen(false);
  };

  const itemsQuery = trpc.useQuery(["items.getOne", { id: queryStatus.id }], {
    enabled: queryStatus.ready,
  });
  const { data: item } = itemsQuery;

  useEffect(() => {
    if (router.isReady) {
      const zQuery = ParamsValidator.safeParse(router.query);
      if (zQuery.success && zQuery.data.id) {
        setQueryStatus({
          ready: true,
          id: zQuery.data.id,
        });
      }
    }
  }, [router.isReady, router.query]);

  if (!queryStatus.ready) {
    return (
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="py-24">
          <h2 className="text-lg font-semibold text-indigo-600">Postcards</h2>
          <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Add a message
          </p>
          <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
            A 6&quot;x9&quot; postcard with your message delivered for{" "}
            <span className="font-semibold text-indigo-600">$1</span>*
          </p>
          <p className="mx-auto max-w-xl text-xs text-gray-500">
            <em>*U.S. addresses only</em>
          </p>
        </div>
        <LoadingItem />
      </div>
    );
  }

  return (
    <DefaultQueryCell
      query={itemsQuery}
      empty={() => <div>Item not found</div>}
      loading={() => <LoadingItem />}
      success={({ data: item }) => (
        <>
          <Slideover
            open={open}
            setOpen={handleClose}
            itemId={item.id}
            itemLink={item.stripePaymentLink}
            itemFront={item.front}
          ></Slideover>
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="py-24">
              <h2 className="text-lg font-semibold text-indigo-600">
                Postcards
              </h2>
              <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Add a message
              </p>
              <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
                A 6&quot;x9&quot; postcard with your message delivered for{" "}
                <span className="font-semibold text-indigo-600">$1</span>*
              </p>
              <p className="mx-auto max-w-xl text-xs text-gray-500">
                <em>*U.S. addresses only</em>
              </p>
            </div>
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
              <PostcardPreviewSimple
                key={item.id}
                id={`postcard-${item.id}`}
                front={item.front}
                name="Front"
                onClick={() => {
                  setOpen(true);
                }}
                hideButton={true}
              />
              <PostcardPreviewSimple
                key={item.id}
                id={`postcard-${item.id}`}
                front={item.back}
                name="Back"
                onClick={() => {
                  setOpen(true);
                }}
                hideButton={open}
              />
            </div>
          </div>
        </>
      )}
    />
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
        <Item />
      </SignedIn>
      <SignedOut>
        <Item />
      </SignedOut>
    </>
  );
};

export default Page;
