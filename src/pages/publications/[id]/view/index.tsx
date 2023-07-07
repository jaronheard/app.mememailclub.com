import DefaultQueryCell from "../../../../components/DefaultQueryCell";
import { trpc } from "../../../../utils/trpc";
import Head from "next/head";
import { PostcardPreviewSimple } from "../../../../components/PostcardPreviewSimple";
import { useEffect, useState, Fragment } from "react";
import { trackGoal } from "fathom-client";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { PostcardCreateSimple } from "../../../../components/PostcardCreateSimple";
import { useInView } from "react-intersection-observer";
import Button from "../../../../components/Button";
import { z } from "zod";
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import {
  useQueryParam,
  ObjectParam as DefaultObjectParam,
  ArrayParam as DefaultArrayParam,
  QueryParamConfig,
  withDefault,
  NumberParam,
} from "use-query-params";
import { Tag, TagCategory } from "@prisma/client";

function Splash() {
  return (
    <div className="py-24">
      <h2 className="text-lg font-semibold text-indigo-600">
        Postcard Collection
      </h2>
      <p className="mt-1 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
        Send love by mail
      </p>
      <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
        A 6&quot;x9&quot; postcard with your message delivered for{" "}
        <span className="font-semibold text-indigo-600">$2.99</span>*
      </p>
      <p className="mx-auto max-w-xl text-xs text-gray-500">
        <em>*U.S. addresses only</em>
      </p>
    </div>
  );
}

const ArrayParam = withDefault(
  DefaultArrayParam,
  undefined
) as QueryParamConfig<string[] | undefined>;

const SortOptionParam = withDefault(
  DefaultObjectParam,
  undefined
) as QueryParamConfig<SortOption | undefined>;

const sort = [
  { label: "Newest", name: "newest", field: "createdAt", order: "desc" },
  { label: "Oldest", name: "oldest", field: "createdAt", order: "asc" },
];

const zSortOption = z.object({
  label: z.string(),
  name: z.string(),
  field: z.string(),
  order: z.string(),
});

type SortOption = z.TypeOf<typeof zSortOption>;

type CategoryFilterCellProps = {
  activeSort?: SortOption;
  activeFilters?: string[];
  setActiveSort: (sort: SortOption) => void;
  setActiveFilters: (filters: string[]) => void;
  children?: React.ReactNode;
};

function CategoryFilterCell(props: CategoryFilterCellProps) {
  const tagsQuery = trpc.useQuery(["tags.getAllTagCategories"]);
  return (
    <DefaultQueryCell
      query={tagsQuery}
      empty={() => null}
      loading={() => (
        <CategoryFilterLoading>{props.children}</CategoryFilterLoading>
      )}
      success={({ data }) => {
        return (
          <CategoryFilter
            tags={data}
            activeSort={props.activeSort}
            setActiveSort={props.setActiveSort}
            activeFilters={props.activeFilters}
            setActiveFilters={props.setActiveFilters}
          >
            {props.children}
          </CategoryFilter>
        );
      }}
    />
  );
}

type CategoryFilterLoadingProps = {
  children?: React.ReactNode;
};

function CategoryFilterLoading(props: CategoryFilterLoadingProps) {
  return (
    <div className="">
      {/* Mobile filter dialog */}
      <Transition.Root show={false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 sm:hidden"
          onClose={() => null}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="hover: -mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => null}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
        <Splash />

        <section
          aria-labelledby="filter-heading"
          className="border-t border-gray-200 py-6"
        >
          <h2 id="filter-heading" className="sr-only">
            Product filters
          </h2>
          <div className="flex items-center justify-between">
            Loading filters...
          </div>
        </section>
        {props.children}
      </div>
    </div>
  );
}

type CategoryFilterProps = CategoryFilterCellProps & {
  tags: (TagCategory & { Tags: Tag[] })[];
};

function CategoryFilter(props: CategoryFilterProps) {
  const [open, setOpen] = useState(false);
  const activeFilters = props.activeFilters
    ? Object.fromEntries(props.activeFilters.map((filter) => [filter, true]))
    : {};
  const { register } = useForm<SendParams>({
    defaultValues: activeFilters,
  });

  const numberOfActiveFilters = Object.keys(activeFilters).length;

  return (
    <div className="">
      {/* Mobile filter dialog */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 sm:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="hover: -mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4">
                  {props.tags.map((section) => {
                    const activeFiltersInSection = props.activeFilters
                      ? props.activeFilters.filter((filter) =>
                          section.Tags.find((tag) => tag.name === filter)
                        )
                      : [];
                    const numberOfActiveFiltersInSection =
                      activeFiltersInSection.length;
                    return (
                      <Disclosure
                        as="div"
                        key={`disclosure-${section.name}`}
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                                <span className="font-medium text-gray-900">
                                  {numberOfActiveFiltersInSection > 0 ? (
                                    <span className="mr-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                                      {numberOfActiveFiltersInSection}
                                    </span>
                                  ) : null}
                                  {section.label}
                                </span>
                                <span className="ml-6 flex items-center">
                                  <ChevronDownIcon
                                    className={clsx(
                                      open ? "-rotate-180" : "rotate-0",
                                      "h-5 w-5 transform"
                                    )}
                                    aria-hidden="true"
                                  />
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-6">
                                {section.Tags.map((option, optionIdx) => (
                                  <div
                                    key={`filter-mobile-${section.id}-${optionIdx}-wrapper`}
                                    className="flex items-center"
                                  >
                                    <input
                                      id={`filter-mobile-${section.id}-${optionIdx}`}
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                      {...register(`${option.name}` as any, {
                                        onChange(event) {
                                          const value = option.name;

                                          const newFilters = props.activeFilters
                                            ? props.activeFilters.filter(
                                                (filter) => filter !== value
                                              )
                                            : [];

                                          if (value && event.target.checked) {
                                            newFilters.push(value);
                                          }

                                          props.setActiveFilters(newFilters);
                                        },
                                      })}
                                    />
                                    <label
                                      htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                      className="ml-3 text-sm text-gray-500"
                                    >
                                      {option.label}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    );
                  })}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
        <Splash />
        <section
          aria-labelledby="filter-heading"
          className="border-t border-gray-200 py-6"
        >
          <h2 id="filter-heading" className="sr-only">
            Product filters
          </h2>

          <div className="flex items-center justify-between">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sort.map((option) => (
                      <Menu.Item key={`sort-option-${option.name}`}>
                        {() => (
                          <button
                            onClick={() => {
                              props.setActiveSort({
                                label: option.label,
                                name: option.name,
                                field: option.field,
                                order: option.order,
                              });
                            }}
                            className={clsx(
                              "block w-full px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-indigo-700 hover:text-white",
                              {
                                "font-bold":
                                  option.name === props.activeSort?.name,
                              }
                            )}
                          >
                            {option.label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <button
              type="button"
              className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
              onClick={() => setOpen(true)}
            >
              {numberOfActiveFilters > 0 ? (
                <span className="mr-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                  {numberOfActiveFilters}
                </span>
              ) : null}
              Filters
            </button>

            <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
              {props.tags.map((section, sectionIdx) => {
                const activeFiltersInSection = props.activeFilters
                  ? props.activeFilters.filter((filter) =>
                      section.Tags.find((tag) => tag.name === filter)
                    )
                  : [];
                const numberOfActiveFiltersInSection =
                  activeFiltersInSection.length;
                return (
                  <Popover
                    as="div"
                    key={`desktop-menu-${section.name}`}
                    id={`desktop-menu-${sectionIdx}`}
                    className="relative inline-block text-left"
                  >
                    <div>
                      <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        <span>{section.label}</span>
                        {numberOfActiveFiltersInSection > 0 ? (
                          <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                            {numberOfActiveFiltersInSection}
                          </span>
                        ) : null}
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Popover.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <form className="space-y-4">
                          {section.Tags.map((option) => (
                            <div
                              key={`filter-wrapper-${section.id}-${option.name}`}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-${section.id}-${option.name}`}
                                defaultValue={option.name}
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                {...register(`${option.name}` as any, {
                                  onChange(event) {
                                    const value = option.name;

                                    const newFilters = props.activeFilters
                                      ? props.activeFilters.filter(
                                          (filter) => filter !== value
                                        )
                                      : [];

                                    if (value && event.target.checked) {
                                      newFilters.push(value);
                                    }

                                    props.setActiveFilters(newFilters);
                                  },
                                })}
                              />
                              <label
                                htmlFor={`filter-${section.id}-${option.name}`}
                                className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </form>
                      </Popover.Panel>
                    </Transition>
                  </Popover>
                );
              })}
            </Popover.Group>
          </div>
        </section>
        {props.children}
      </div>
    </div>
  );
}

const ParamsValidator = z.object({
  ready: z.boolean().optional(),
  sortKey: z.string().optional(),
  sortDirection: z.string().optional(),
  filters: z.array(z.string()).optional(),
  id: z.string().optional(),
});
export type SendParams = z.infer<typeof ParamsValidator>;

const Send = () => {
  const router = useRouter();
  // redirect for legacy query params
  const [itemId] = useQueryParam("id", NumberParam);
  useEffect(() => {
    if (itemId) {
      router.replace(`/send/${itemId}`);
    }
  }, [itemId, router]);

  const { isSignedIn } = useAuth();
  const { data: anonymousUserId } = trpc.useQuery(["users.getUniqueUserId"], {
    staleTime: Infinity,
  });
  const [activeSort, setActiveSort] = useQueryParam("sort", SortOptionParam);
  const [activeFilters, setActiveFilters] = useQueryParam(
    "filters",
    ArrayParam
  );
  const [queryStatus, setQueryStatus] = useState({
    ready: false,
    id: 0,
  });
  const { ref, inView } = useInView();

  const order = z
    .enum(["asc", "desc"])
    .optional()
    .nullish()
    .safeParse(activeSort?.order);
  const orderToUse = order.success ? order.data : undefined;

  // items query
  const itemsQuery = trpc.useInfiniteQuery(
    [
      "items.getInfinite",
      {
        limit: 20,
        order: orderToUse,
        filters: activeFilters,
        anonymousUserId: anonymousUserId,
        publicationId:
          queryStatus.ready && queryStatus.id > 0 ? queryStatus.id : undefined,
      },
    ],
    {
      enabled: queryStatus.ready,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  // infinite scroll
  useEffect(() => {
    if (inView) {
      itemsQuery.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (router.isReady) {
      const zQuery = ParamsValidator.safeParse(router.query);
      if (zQuery.success && zQuery.data.id) {
        setQueryStatus({
          ready: true,
          id: Number(zQuery.data.id),
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
            <CategoryFilterCell
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              activeSort={activeSort}
              setActiveSort={setActiveSort}
            >
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
                <PostcardCreateSimple
                  onClick={() => router.push("/items/new")}
                />
              </div>
            </CategoryFilterCell>
          </div>
        )}
        success={({ data: infiniteData }) => {
          const items =
            infiniteData.pages?.map((page) => page.items).flat() || [];
          return (
            <>
              <div className="mx-auto max-w-2xl lg:max-w-7xl">
                <h2 className="sr-only">Products</h2>
                <CategoryFilterCell
                  activeFilters={activeFilters}
                  setActiveFilters={setActiveFilters}
                  activeSort={activeSort}
                  setActiveSort={setActiveSort}
                >
                  <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-1 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-2 lg:gap-x-8">
                    {items.map((item, index) => (
                      <>
                        <PostcardPreviewSimple
                          key={`postcard-${item.id}`}
                          id={`postcard-${item.id}`}
                          front={item.front}
                          name={
                            isSignedIn
                              ? `${
                                  item.visibility === "PRIVATE" ? "🔒" : "🌐"
                                } ${item.name}`
                              : item.name
                          }
                          description={item.description}
                          onClick={() => {
                            router.push(`/send/${item.id}`);
                            trackGoal("1WFW5D7J", 0);
                          }}
                        />
                      </>
                    ))}
                  </div>
                  <PostcardCreateSimple
                    onClick={() => router.push("/items/new")}
                  />
                </CategoryFilterCell>
              </div>
            </>
          );
        }}
      />
      <div className="flex justify-center py-8" ref={ref}>
        {(itemsQuery.isFetchingNextPage || itemsQuery.hasNextPage) && (
          <Button
            variant="secondary"
            onClick={() => itemsQuery.fetchNextPage()}
            disabled={
              !(itemsQuery.hasNextPage || itemsQuery.isFetchingNextPage)
            }
          >
            {itemsQuery.isFetchingNextPage
              ? "Loading more..."
              : itemsQuery.hasNextPage
              ? "Load Newer"
              : "Nothing more to load"}
          </Button>
        )}
      </div>
      {!itemsQuery.isFetchingNextPage && !itemsQuery.hasNextPage && (
        <>
          <div className="mx-auto flex max-w-xl justify-center italic">
            There are no more postcards to see, but you can create your own!
          </div>
          <div className="flex justify-center py-8">
            <Button href="/items/new">Create your own</Button>
          </div>
        </>
      )}
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
        <Send />
      </SignedIn>
      <SignedOut>
        <Send />
      </SignedOut>
    </>
  );
};

export default Page;
