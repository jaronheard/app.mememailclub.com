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
    {[0].map((item) => (
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
    return <LoadingItem />;
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
              hideButton={true}
            />
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
