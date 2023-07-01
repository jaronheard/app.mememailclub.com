// import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
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

const LoadingItems = () => (
  <div className="py-18 grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
    {[0, 1].map((item) => (
      <PostcardPreviewSimple
        key={`loading-${item}`}
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

const Splash = () => (
  <div className="border-b border-gray-200 py-24">
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
);

const Item = () => {
  const router = useRouter();
  // parse id from query params as number
  const { id } = ParamsValidator.parse(router.query);
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    // navigate to /send while preserving query params
    router.push("/send", undefined, { shallow: true });
    setOpen(false);
  };

  const itemsQuery = trpc.useQuery(["items.getOne", { id }], {
    enabled: !!id,
  });

  return (
    <DefaultQueryCell
      query={itemsQuery}
      empty={() => <div>Item not found</div>}
      loading={() => (
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
          <Splash />
          <LoadingItems />
        </div>
      )}
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
            <Splash />
            <div className="grid grid-cols-1 gap-y-4 py-[4.5rem] sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
              <PostcardPreviewSimple
                key={`postcard-front-${item.id}`}
                id={`postcard-${item.id}`}
                front={item.front}
                name="Front"
                onClick={() => {
                  setOpen(true);
                }}
                hideButton={true}
              />
              <PostcardPreviewSimple
                key={`postcard-back-${item.id}`}
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
