import { useForm } from "react-hook-form";
import Link from "next/link";
import Layout from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { format } from "date-fns";
import DefaultQueryCell from "../../components/DefaultQueryCell";
import Img from "../../components/Img";
import { z } from "zod";
import Breadcrumbs from "../../components/Breadcrumbs";
import LoadingLayout from "../../components/LoadingLayout";
import Button from "../../components/Button";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import Head from "next/head";

export type PublicationFormValues = {
  name: string;
  description: string;
};

const ItemsEmpty = () => (
  <div className="mt-1 rounded-md border-2 border-dashed px-6 pt-5 pb-6 text-center">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">No postcards</h3>
    <p className="mt-1 text-sm text-gray-500">
      Get started by creating a new postcard.
    </p>
  </div>
);

const ParamsValidator = z.object({
  id: z.optional(z.string().transform((str) => Number(str))),
});

type PublicationProps = {
  user: UserResource;
};

const Publication = ({ user }: PublicationProps) => {
  const router = useRouter();
  const utils = trpc.useContext();
  const [query, setQuery] = useState({ ready: false, id: 0 });

  const { id } = router.query;
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PublicationFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const publicationQuery = trpc.useQuery(
    ["publications.getOne", { id: query.id }],
    { enabled: query.ready }
  );
  const { data: publication, isLoading } = publicationQuery;
  const updatePublication = trpc.useMutation("publications.updatePublication", {
    onSuccess: () => {
      utils.invalidateQueries();
      router.push("/publications");
    },
  });
  const deletePublication = trpc.useMutation("publications.deletePublication", {
    onSuccess: () => {
      utils.invalidateQueries();
      router.push("/publications");
    },
  });
  const createItem = trpc.useMutation("items.createItem", {
    onSuccess: (data) => {
      utils.invalidateQueries();
      router.push(`/publications/${query.id}/items/${data?.id}`);
    },
  });

  useEffect(() => {
    if (router.isReady) {
      const zQuery = ParamsValidator.safeParse(router.query);
      if (zQuery.success && zQuery.data.id) {
        setQuery({
          ready: true,
          id: zQuery.data.id,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  useEffect(() => {
    if (!isLoading) {
      reset({
        name: publication?.name,
        description: publication?.description,
      });
    }
  }, [
    reset,
    isLoading,
    publication?.name,
    publication?.description,
    publication?.imageUrl,
  ]);

  if (status === "loading") {
    <LoadingLayout />;
  }

  return (
    <>
      <Breadcrumbs
        pages={[
          {
            name: watch("name"),
            href: `/publications/${query.id}`,
            current: false,
          },
        ]}
      />
      <DefaultQueryCell
        query={publicationQuery}
        success={({ data: publication }) => (
          <>
            <div className="mt-6" id="items">
              <div id="items-intro">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Postcards
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add postcards to your collection.
                </p>
                <Button
                  onClick={() =>
                    createItem.mutate({
                      publicationId: publication?.id as number,
                      name: "",
                      description: "",
                      front: `https://res.cloudinary.com/jaronheard/image/upload/v1685407734/6x9_postcard_front_ismigp.png`,
                      back: `https://res.cloudinary.com/jaronheard/image/upload/v1685407706/6x9_postcard_ztcybr.png`,
                      status: "DRAFT",
                      size: "6x9",
                      visibility: "PRIVATE",
                    })
                  }
                  size="sm"
                  className="mt-5"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  New Postcard
                </Button>
              </div>
              <div className="my-8" id="items-list">
                {publication?.Items.length === 0 && <ItemsEmpty />}
                {publication && publication?.Items.length > 0 && (
                  <div>
                    <div className="overflow-hidden bg-white shadow sm:rounded-md">
                      <ul role="list" className="divide-y divide-gray-200">
                        {publication.Items.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={`/publications/${id}/items/${item.id}`}
                              className="block hover:bg-gray-50"
                            >
                              <div className="flex items-center px-4 py-4 sm:px-6">
                                <Img
                                  src={item.front}
                                  alt={item.name}
                                  className="w-16 object-contain"
                                  height={425}
                                  width={625}
                                />
                                <div className="flex min-w-0 flex-1 items-center">
                                  <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                    <div>
                                      <p className="truncate text-sm font-medium text-indigo-600">
                                        {item.name}
                                      </p>
                                    </div>
                                    <div className="hidden md:block">
                                      <div>
                                        <p className="text-sm text-gray-900">
                                          Created on{" "}
                                          <time
                                            dateTime={format(
                                              item.createdAt,
                                              "yyyy-MM-dd"
                                            )}
                                          >
                                            {format(
                                              item.createdAt,
                                              "yyyy-MM-dd"
                                            )}
                                          </time>
                                        </p>
                                        <p className="mt-2 flex items-center text-sm text-gray-500">
                                          {item.status === "DRAFT" && (
                                            <EyeSlashIcon
                                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          )}
                                          {item.status === "PUBLISHED" && (
                                            <EyeIcon
                                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          )}
                                          <span className="capitalize">
                                            {item.status.toLowerCase()}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <ChevronRightIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div id="publication">
              <div id="publication-intro">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Postcard collection
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  If you choose to make your postcard collection public, this
                  information will help others find it.
                </p>
              </div>

              <form className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("name", { required: true })}
                      autoComplete="off"
                      className={clsx(
                        "block w-full rounded-md border p-3 shadow-sm placeholder:text-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                        {
                          "border-red-300": errors.name,
                          "border-gray-300": !errors.name,
                        }
                      )}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      Publication name is required.
                    </p>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      {...register("description", { required: true })}
                      autoComplete="off"
                      rows={3}
                      className={clsx(
                        "block w-full rounded-md shadow-sm placeholder:text-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                        {
                          "border-red-300": errors.name,
                          "border-gray-300": !errors.name,
                        }
                      )}
                      defaultValue={""}
                    />
                  </div>
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      Description is required.
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Write a few sentences about your publication.
                  </p>
                </div>
              </form>
            </div>
            <div className="pt-12">
              <div className="flex justify-between">
                <Button
                  onClick={handleSubmit((data) => {
                    updatePublication.mutate({
                      id: query.id,
                      name: data.name,
                      description: data.description,
                      imageUrl:
                        "https://res.cloudinary.com/jaronheard/image/upload/v1685474738/folder_fpgnfp.png",
                      status: "PUBLISHED",
                    });
                  })}
                  size="sm"
                >
                  Update Collection
                </Button>
                <Button
                  onClick={() => {
                    deletePublication.mutate({
                      id: query.id,
                    });
                  }}
                  size="sm"
                  variant="danger"
                >
                  Delete (cannot be undone)
                </Button>
              </div>
            </div>
          </>
        )}
      />
    </>
  );
};

const Page = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <Layout
      user={{
        name: `${user.firstName} ${user.lastName}`,
        email: user.primaryEmailAddress?.emailAddress,
        imageUrl: user.imageUrl,
      }}
    >
      <Head>
        <title>Create unique postcards - PostPostcard</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Publication user={user} />
    </Layout>
  );
};

export default Page;
