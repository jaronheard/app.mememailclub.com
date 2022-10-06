import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Layout from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Pricing from "../../components/Pricing";
import {
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { format } from "date-fns";
import DefaultQueryCell from "../../components/DefaultQueryCell";
import Img from "../../components/Img";
import FileUpload from "../../components/FileUpload";

export type PublicationFormValues = {
  name: string;
  description: string;
  imageUrl: string;
};

const Publication = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<PublicationFormValues>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  });
  const publicationQuery = trpc.useQuery(
    ["publications.getOne", { id: Number(id) }],
    { enabled: id !== undefined }
  );
  const { data: publication, isLoading } = publicationQuery;
  const updatePublication = trpc.useMutation("publications.updatePublication", {
    onSuccess: () => router.push("/publications"),
  });
  const deletePublication = trpc.useMutation("publications.deletePublication", {
    onSuccess: () => router.push("/publications"),
  });
  const createItem = trpc.useMutation("items.createItem", {
    onSuccess: (data) => router.push(`/publications/${id}/items/${data?.id}`),
  });

  useEffect(() => {
    if (!isLoading) {
      reset({
        name: publication?.name,
        description: publication?.description,
        imageUrl: publication?.imageUrl,
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
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  const randomFront = Math.floor(Math.random() * 1000);
  const randomBack = Math.floor(Math.random() * 1000);

  return (
    <>
      {session && session.user?.id === publication?.author.id ? (
        <Layout
          user={{
            name: session.user?.name,
            email: session.user?.email,
            imageUrl: session.user?.image,
          }}
        >
          <button
            onClick={() =>
              createItem.mutate({
                publicationId: publication?.id as number,
                name: "New postcard",
                description: "New postcard description",
                front: `https://picsum.photos/id/${randomFront}/1875/1275`,
                back: `https://picsum.photos/id/${randomBack}/1875/1275`,
                status: "DRAFT",
              })
            }
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Postcard
          </button>
          <DefaultQueryCell
            query={publicationQuery}
            success={({ data: publication }) => (
              <form className="mt-6">
                <div
                  className="space-y-8 divide-y divide-gray-200"
                  id="publication"
                >
                  <div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Publication
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        This information will be displayed publicly once your
                        publication is published.
                      </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Publication name
                        </label>
                        <div className="mt-1">
                          <input
                            {...register("name", { required: true })}
                            autoComplete="off"
                            className={clsx(
                              "block w-full rounded-md border p-3 shadow-sm focus:border-indigo-500  focus:ring-indigo-500 sm:text-sm",
                              {
                                "border-red-300": errors.name,
                                "border-gray-300": !errors.name,
                              }
                            )}
                          />
                        </div>
                        {errors.name && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="email-error"
                          >
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
                              "block w-full rounded-md shadow-sm focus:border-indigo-500  focus:ring-indigo-500 sm:text-sm",
                              {
                                "border-red-300": errors.name,
                                "border-gray-300": !errors.name,
                              }
                            )}
                            defaultValue={""}
                          />
                        </div>
                        {errors.description && (
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="email-error"
                          >
                            Description is required.
                          </p>
                        )}
                        <p className="mt-2 text-sm text-gray-500">
                          Write a few sentences about your publication.
                        </p>
                      </div>

                      <div className="sm:col-span-6">
                        <FileUpload
                          id="imageUrl"
                          label="Image"
                          accept="image/*"
                          required
                          register={register}
                          getValues={getValues}
                          setValue={setValue}
                          errors={errors}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-5" id="items">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Postcards
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    These are the available postcards within your publication
                  </p>
                </div>
                {
                  // placeholder if no items in publication
                  publication?.Items.length === 0 && (
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
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No items
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by adding a new item.
                      </p>
                    </div>
                  )
                }
                {
                  // list of items
                  publication && publication?.Items.length > 0 && (
                    <div>
                      <div className="overflow-hidden bg-white shadow sm:rounded-md">
                        <ul role="list" className="divide-y divide-gray-200">
                          {publication.Items.map((item) => (
                            <li key={item.id}>
                              <Link
                                href={`/publications/${id}/items/${item.id}`}
                              >
                                <a className="block hover:bg-gray-50">
                                  <div className="flex items-center px-4 py-4 sm:px-6">
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
                                </a>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                }
                <div className="pt-5">
                  <div className="flex justify-end">
                    <Link href="/publications">
                      <a className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Cancel
                      </a>
                    </Link>
                    <button
                      onClick={() => {
                        deletePublication.mutate({
                          id: Number(id),
                        });
                      }}
                      className="ml-3 inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleSubmit((data) => {
                        updatePublication.mutate({
                          id: Number(id),
                          name: data.name,
                          description: data.description,
                          imageUrl: data.imageUrl,
                          status: "PUBLISHED",
                        });
                      })}
                      className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Unpublish
                    </button>
                    <button
                      onClick={handleSubmit((data) => {
                        updatePublication.mutate({
                          id: Number(id),
                          name: data.name,
                          description: data.description,
                          imageUrl: data.imageUrl,
                          status: "PUBLISHED",
                        });
                      })}
                      className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </form>
            )}
          />
        </Layout>
      ) : (
        <Layout>
          <DefaultQueryCell
            query={publicationQuery}
            success={({ data: publication }) => (
              <>
                <div className="flex gap-3">
                  <Img
                    className="h-12 w-12 rounded-full"
                    src={publication?.imageUrl || ""}
                    alt=""
                    height={48}
                    width={48}
                    autoCrop
                  />
                  <div className="">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {publication?.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1">
                      <Img
                        className="h-3 w-3 rounded-full"
                        src={publication?.author?.image || ""}
                        referrerPolicy="no-referrer"
                        alt=""
                        height={12}
                        width={12}
                      />
                      <p className="text-xs italic text-gray-500">
                        {publication?.author?.name}
                      </p>
                    </div>
                    <p className="mt-12 text-gray-700">
                      {publication?.description}
                    </p>
                  </div>
                </div>
                <Pricing />
              </>
            )}
          />
        </Layout>
      )}
    </>
  );
};

export default Publication;
