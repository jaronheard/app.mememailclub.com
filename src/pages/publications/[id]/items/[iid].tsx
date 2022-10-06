import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Layout from "../../../../components/Layout";
import { trpc } from "../../../../utils/trpc";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect } from "react";
import FileUpload from "../../../../components/FileUpload";
import DefaultQueryCell from "../../../../components/DefaultQueryCell";
import Img from "../../../../components/Img";
import { PostcardPreview } from "../../../../components/PostcardPreview";

export type ItemFormValues = {
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
    formState: { errors },
  } = useForm<ItemFormValues>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      front: "",
      back: "",
    },
  });
  const itemsQuery = trpc.useQuery(["items.getOne", { id: Number(iid) }]);
  const { data: item, isLoading } = itemsQuery;
  const updateItem = trpc.useMutation("items.updateItem", {
    onSuccess(data, variables) {
      variables.status === "DRAFT"
        ? router.push(`/publications/${id}/items/${iid}`)
        : router.push(`/publications/${id}`);
    },
  });
  const deleteItem = trpc.useMutation("items.deleteItem", {
    onSuccess: () => router.push(`/publications/${id}`),
  });

  useEffect(() => {
    if (!isLoading) {
      reset({
        name: item?.name || "",
        description: item?.description || "",
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
          <DefaultQueryCell
            query={itemsQuery}
            success={() => (
              <form>
                <div className="space-y-8 divide-y divide-gray-200">
                  <div>
                    <div>
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Item
                      </h3>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3" id="front">
                        <FileUpload
                          id="front"
                          label="Front"
                          accept="application/pdf, image/png, image/jpeg"
                          required
                          register={register}
                          getValues={getValues}
                          setValue={setValue}
                          errors={errors}
                        >
                          4x6 format PDF, PNG, or JPG per{" "}
                          <a
                            href="https://docs.google.com/document/d/1cIc0s2P8gMUaHxykxbzpsaK6U4AJHr0UdqjcRYp6xyc/edit?usp=sharing"
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:text-indigo-500"
                          >
                            instructions
                          </a>
                        </FileUpload>
                      </div>

                      <div className="sm:col-span-3" id="back">
                        <FileUpload
                          id="back"
                          label="Back"
                          required
                          accept="application/pdf, image/png, image/jpeg"
                          register={register}
                          getValues={getValues}
                          setValue={setValue}
                          errors={errors}
                        >
                          4x6 format PDF, PNG, or JPG per{" "}
                          <a
                            href="https://docs.google.com/document/d/1cIc0s2P8gMUaHxykxbzpsaK6U4AJHr0UdqjcRYp6xyc/edit?usp=sharing"
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:text-indigo-500"
                          >
                            instructions
                          </a>
                        </FileUpload>
                      </div>

                      <div className="sm:col-span-4" id="name">
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
                          <p
                            className="mt-2 text-sm text-red-600"
                            id="email-error"
                          >
                            Item name is required.
                          </p>
                        )}
                      </div>

                      <div className="sm:col-span-6" id="description">
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
                          Write a few sentences about your item.
                        </p>
                      </div>
                      <div className="sm:col-span-6" id="preview">
                        <div className="flex justify-start gap-3">
                          <button
                            onClick={handleSubmit((data) => {
                              updateItem.mutate({
                                id: Number(iid),
                                name: data.name,
                                description: data.description,
                                front: data.front,
                                back: data.back,
                                status: "PUBLISHED",
                              });
                            })}
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Publish
                          </button>
                          <button
                            onClick={handleSubmit((data) => {
                              updateItem.mutate({
                                id: Number(iid),
                                name: data.name,
                                description: data.description,
                                front: data.front,
                                back: data.back,
                                status: "DRAFT",
                              });
                            })}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                      <div className="pt-6 sm:col-span-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                          Item Preview
                        </h3>
                      </div>

                      <div className="sm:col-span-3" id="preview">
                        <PostcardPreview
                          id={0}
                          front={item!.frontPreview}
                          back={item!.backPreview}
                          author={item!.publication?.author?.name || ""}
                          name={item!.name}
                          description={item!.description}
                          stripePaymentLink={item!.stripePaymentLink}
                          loadingState={!item?.postcardPreviewRendered}
                        />
                      </div>

                      <div className="sm:col-span-6" id="delete">
                        <div className="flex items-center justify-start gap-3">
                          <button
                            onClick={() => {
                              deleteItem.mutate({
                                id: Number(iid),
                              });
                            }}
                            className="ml-3 inline-flex items-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Delete
                          </button>
                          <p className="text-sm font-medium text-red-700">
                            Warning: this action is irreversable
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}
          />
        </Layout>
      ) : (
        <Layout>
          <DefaultQueryCell
            query={itemsQuery}
            success={() => (
              <>
                <Link href={`/publications/${id}`}>
                  <a className="flex gap-3">
                    <Img
                      className="h-12 w-12 rounded-full"
                      src={item?.publication.imageUrl || ""}
                      alt=""
                      height={48}
                      width={48}
                      autoCrop
                    />
                    <div className="">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        {item?.publication.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-1">
                        <Img
                          className="h-3 w-3 rounded-full"
                          src={item?.publication?.author?.image || ""}
                          alt=""
                          width={24}
                          height={24}
                        />
                        <p className="text-xs italic text-gray-500">
                          {item?.publication?.author?.name}
                        </p>
                      </div>
                    </div>
                  </a>
                </Link>
                <div className="mt-12">
                  <div className="mt-6 flex gap-3">
                    <a
                      href={item?.front || ""}
                      target="_blank"
                      rel="noreferrer"
                    >
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
              </>
            )}
          />
        </Layout>
      )}
    </>
  );
};

export default Item;
