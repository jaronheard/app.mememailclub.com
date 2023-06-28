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
import CategoryFilter, {
  occasionParams,
  sortOptionsParams,
  toneParams,
  visibilityParams,
} from "../components/CategoryFilter";
import { useInView } from "react-intersection-observer";
import Button from "../components/Button";
import { z } from "zod";

const zSortOptions = z.enum(sortOptionsParams);
type sortOptions = z.infer<typeof zSortOptions>;
const zVisibilityOptions = z.enum(visibilityParams);
type visibilityOptions = z.infer<typeof zVisibilityOptions>;
const zToneOptions = z.enum(toneParams);
type toneOptions = z.infer<typeof zToneOptions>;
const zOccasionOptions = z.enum(occasionParams);
type occasionOptions = z.infer<typeof zOccasionOptions>;

const ParamsValidator = z.object({
  ready: z.boolean().optional(),
  sort: zSortOptions.optional(),
  visibility: zVisibilityOptions.optional(),
  tone: zToneOptions.optional(),
  occasion: zOccasionOptions.optional(),
  id: z.string().optional(),
});
export type SendParams = z.infer<typeof ParamsValidator>;

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
  // queryStatus is of type params
  const [queryStatus, setQueryStatus] = useState<SendParams>({
    ready: false,
    sort: "newest",
  })

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

  useEffect(() => {
    if (router.isReady) {
      const zQuery = ParamsValidator.safeParse(router.query);
      if (zQuery.success) {
        setQueryStatus({
          ready: true,
          sort: zQuery.data.sort,
        });
      }
    }
  }, [router.isReady, router.query]);
  return (
    <>
      <DefaultQueryCell
        query={itemsQuery}
        empty={() => <div>No postcards</div>}
        loading={() => (
          <div className="mx-auto max-w-2xl lg:max-w-7xl">
            <h2 className="sr-only">Products</h2>
            <CategoryFilter>
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
                <PostcardCreateSimple
                  onClick={() => router.push("/items/new")}
                />
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
            </CategoryFilter>
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
              <div className="mx-auto max-w-2xl lg:max-w-7xl">
                <h2 className="sr-only">Products</h2>
                <CategoryFilter>
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
                </CategoryFilter>
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
  const { ref, inView } = useInView();

  const itemsQuery = trpc.useInfiniteQuery(
    [
      "items.getInfinite",
      {
        limit: 20,
      },
    ],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  useEffect(() => {
    if (inView) {
      itemsQuery.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

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
      <DefaultQueryCell
        query={itemsQuery}
        empty={() => <div>No postcards</div>}
        loading={() => (
          <div className="mx-auto max-w-2xl lg:max-w-7xl">
            <h2 className="sr-only">Products</h2>
            <CategoryFilter>
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
            </CategoryFilter>
          </div>
        )}
        success={({ data: infiniteData }) => {
          const items =
            infiniteData.pages?.map((page) => page.items).flat() || [];
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
              <div className="mx-auto max-w-2xl lg:max-w-7xl">
                <h2 className="sr-only">Products</h2>
                <CategoryFilter>
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
                </CategoryFilter>
              </div>
            </>
          );
        }}
      />
      <div className="flex justify-center py-8" ref={ref}>
        <Button
          variant="secondary"
          onClick={() => itemsQuery.fetchNextPage()}
          disabled={!(itemsQuery.hasNextPage || itemsQuery.isFetchingNextPage)}
        >
          {itemsQuery.isFetchingNextPage
            ? "Loading more..."
            : itemsQuery.hasNextPage
            ? "Load Newer"
            : "Nothing more to load"}
        </Button>
      </div>
      <div>
        {itemsQuery.isFetching && !itemsQuery.isFetchingNextPage
          ? "Background Updating..."
          : null}
      </div>
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
