import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Layout from "../../../../components/Layout";
import { trpc } from "../../../../utils/trpc";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FileUpload from "../../../../components/SimpleFileUpload";

export type FormValues = {
  name: string;
  description: string;
  imageUrl: string;
  front: string;
  back: string;
};

const Item = () => {
  const router = useRouter();
  const { id, iid } = router.query;
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      front: "",
      back: "",
    },
  });
  const { data: item, isLoading } = trpc.useQuery([
    "items.getOne",
    { id: Number(iid) },
  ]);
  const updateItem = trpc.useMutation("items.updateItem");
  const deleteItem = trpc.useMutation("items.deleteItem");

  useEffect(() => {
    if (!isLoading) {
      reset({
        name: item?.name || "",
        description: item?.description || "",
        imageUrl: item?.imageUrl || "",
        front: item?.front || "",
        back: item?.back || "",
      });
    }
  }, [reset, item, isLoading]);

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  return (
    <>
      {session && session.user?.id === item?.publication.authorId ? (
        <Layout
          user={{
            name: session.user?.name,
            email: session.user?.email,
            imageUrl: session.user?.image,
          }}
        >
          <form>
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Item
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This information will be displayed publicly once your item
                    is published.
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Item name
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
                      <p className="mt-2 text-sm text-red-600" id="email-error">
                        Item name is required.
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
                      <p className="mt-2 text-sm text-red-600" id="email-error">
                        Description is required.
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Write a few sentences about your item.
                    </p>
                  </div>
                  <div className="sm:col-span-6">
                    <FileUpload
                      id="imageUrl"
                      label="Image"
                      required
                      register={register}
                      getValues={getValues}
                      setValue={setValue}
                    />
                    {errors.imageUrl && (
                      <p className="mt-2 text-sm text-red-600" id="email-error">
                        imageUrl is required. {watch("imageUrl")}{" "}
                        {errors.imageUrl.type} {errors.imageUrl.type}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-6">
                    <FileUpload
                      id="front"
                      label="Front PDF per instructions"
                      required
                      register={register}
                      getValues={getValues}
                      setValue={setValue}
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <FileUpload
                      id="back"
                      label="Back PDF per instructions"
                      required
                      register={register}
                      getValues={getValues}
                      setValue={setValue}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <div className="flex justify-end">
                <Link href="/">
                  <a className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                    Cancel
                  </a>
                </Link>
                <button
                  onClick={() => {
                    deleteItem.mutate({
                      id: Number(iid),
                    });

                    router.push(`/publications/${id}`);
                  }}
                  className="ml-3 inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Delete
                </button>
                <button
                  onClick={handleSubmit((data) => {
                    updateItem.mutate({
                      id: Number(iid),
                      name: data.name,
                      description: data.description,
                      imageUrl: data.imageUrl,
                      front: data.front,
                      back: data.back,
                      status: "DRAFT",
                    });

                    router.push(`/publications/${id}`);
                  })}
                  className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Unpublish
                </button>
                <button
                  onClick={handleSubmit((data) => {
                    updateItem.mutate({
                      id: Number(iid),
                      name: data.name,
                      description: data.description,
                      imageUrl: data.imageUrl,
                      front: data.front,
                      back: data.back,
                      status: "PUBLISHED",
                    });

                    router.push(`/publications/${id}`);
                  })}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Publish
                </button>
              </div>
            </div>
          </form>
        </Layout>
      ) : (
        <Layout>
          <Link href={`/publications/${id}`}>
            <a className="flex gap-3">
              <img
                className="h-12 w-12 rounded-full"
                src={item?.publication.imageUrl || ""}
                alt=""
              />
              <div className="">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {item?.publication.name}
                </h3>
                <div className="mt-1 flex items-center gap-1">
                  <img
                    className="h-3 w-3 rounded-full"
                    src={item?.publication?.author?.image || ""}
                    referrerPolicy="no-referrer"
                    alt=""
                  />
                  <p className="text-xs italic text-gray-500">
                    {item?.publication?.author?.name}
                  </p>
                </div>
              </div>
            </a>
          </Link>
          <div className="mt-12">
            <img
              className="h-12 w-12 rounded-full"
              src={item?.imageUrl || ""}
              alt=""
            />
            <div className="mt-6 flex gap-3">
              <a href={item?.front || ""} target="_blank" rel="noreferrer">
                Front
              </a>
              <a href={item?.back || ""} target="_blank" rel="noreferrer">
                Back
              </a>
            </div>
            <h3 className="mt-6 text-lg font-medium leading-6 text-gray-900">
              {item?.name}
            </h3>
            <p className="mt-3 text-gray-700">{item?.description}</p>
          </div>
        </Layout>
      )}
    </>
  );
};

export default Item;
