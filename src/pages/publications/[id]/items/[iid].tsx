import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
// import Link from "next/link";
import Layout from "../../../../components/Layout";
import { trpc } from "../../../../utils/trpc";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FileUpload from "../../../../components/FileUpload";
import DefaultQueryCell from "../../../../components/DefaultQueryCell";
// import Img from "../../../../components/Img";
import { PostcardPreview } from "../../../../components/PostcardPreview";
// import { id } from "date-fns/locale";
import { z } from "zod";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import SignIn from "../../../../components/SignIn";
import LoadingLayout from "../../../../components/LoadingLayout";
import Button from "../../../../components/Button";
import {
  ItemSizeOpts,
  itemSizeToClient,
  SIZES,
} from "../../../../utils/itemSize";

export type ItemFormValues = {
  name: string;
  description: string;
  imageUrl: string;
  front: string;
  back: string;
  size: ItemSizeOpts;
};

const ParamsValidator = z.object({
  id: z.optional(z.string().transform((str) => Number(str))),
  iid: z.optional(z.string().transform((str) => Number(str))),
});

const Item = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const [query, setQuery] = useState({
    ready: false,
    id: 0,
    iid: 0,
  });

  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItemFormValues>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      front: "",
      back: "",
      size: "4x6",
    },
  });

  const resizeImageUrl = (url: string, size: ItemSizeOpts) => {
    const dpi = 300;
    const heightInches = size === "4x6" ? 4 : size === "6x9" ? 6 : 6;
    const widthInches = size === "4x6" ? 6 : size === "6x9" ? 9 : 11;
    const heightInchesWithMargin = heightInches + 0.25;
    const widthInchesWithMargin = widthInches + 0.25;
    const heightPixels = heightInchesWithMargin * dpi;
    const widthPixels = widthInchesWithMargin * dpi;

    // if url is from picsum, resize it
    if (url.includes("picsum")) {
      // split url at second to last slash
      const splitUrl = url.split("/");
      splitUrl.pop();
      splitUrl.pop();
      const newUrl = splitUrl.join("/") + `/${widthPixels}/${heightPixels}`;
      return newUrl;
    }
    // else return original url
    return url;
  };

  const itemsQuery = trpc.useQuery(["items.getOne", { id: query.iid }], {
    enabled: query.ready,
  });
  const { data: item } = itemsQuery;
  const updateItem = trpc.useMutation("items.updateItem", {
    onSuccess(data, variables) {
      utils.invalidateQueries(["items.getAll"]);
      utils.invalidateQueries(["items.getPublished"]);
      utils.invalidateQueries(["items.getOne", { id: variables.id }]);
      variables.status === "DRAFT"
        ? router.push(`/publications/${query.id}/items/${query.iid}`)
        : router.push(`/publications/${query.id}`);
    },
  });
  const deleteItem = trpc.useMutation("items.deleteItem", {
    onSuccess() {
      router.push(`/publications/${query.id}`);
    },
  });

  useEffect(() => {
    if (router.isReady) {
      const zQuery = ParamsValidator.safeParse(router.query);
      if (zQuery.success && zQuery.data.id && zQuery.data.iid) {
        setQuery({
          ready: true,
          id: zQuery.data.id,
          iid: zQuery.data.iid,
        });
      }
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    // set form to form values is item is loaded
    if (item) {
      reset({
        name: item.name,
        description: item.description,
        front: item.front,
        back: item.back,
        size: itemSizeToClient(item.size),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id, reset]);

  if (status === "loading" || !query.ready) {
    return <LoadingLayout />;
  }

  return (
    <>
      {status === "authenticated" && session.user ? (
        <Layout
          user={{
            name: session.user?.name,
            email: session.user?.email,
            imageUrl: session.user?.image,
          }}
        >
          <DefaultQueryCell
            query={itemsQuery}
            success={({ data: item }) => (
              <Breadcrumbs
                pages={[
                  {
                    name: item.publication.name,
                    href: `/publications/${query.id}`,
                    current: false,
                  },
                  {
                    name: watch("name"),
                    href: `/publications/${query.id}/items/${query.iid}`,
                    current: true,
                  },
                ]}
              />
            )}
          />
          <form className="mt-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Postcard
              </h3>
            </div>
            <DefaultQueryCell
              query={itemsQuery}
              success={() => (
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6" id="size">
                    {/* Size field with options for 4x6, 6x9, and 6x11 */}
                    <label
                      htmlFor="size"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Size
                    </label>
                    <select
                      id="size"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      {...register("size", {
                        onChange: () => {
                          setValue(
                            "front",
                            resizeImageUrl(watch("front"), watch("size"))
                          );
                          setValue(
                            "back",
                            resizeImageUrl(watch("back"), watch("size"))
                          );
                        },
                      })}
                    >
                      <option value="4x6">4x6</option>
                      <option value="6x9">6x9</option>
                      <option value="6x11">6x11</option>
                    </select>
                  </div>
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
                      size={watch("size")}
                    >
                      Must be exactly {SIZES[watch("size")].widthPx}px by{" "}
                      {SIZES[watch("size")].heightPx}px in PDF, PNG, or JPG
                      format
                    </FileUpload>
                  </div>

                  <div className="sm:col-span-3" id="back">
                    <FileUpload
                      id="back"
                      label="Back (address and message side)"
                      required
                      accept="application/pdf, image/png, image/jpeg"
                      register={register}
                      getValues={getValues}
                      setValue={setValue}
                      errors={errors}
                      size={watch("size")}
                    >
                      Must be exactly {SIZES[watch("size")].widthPx}px by{" "}
                      {SIZES[watch("size")].heightPx}px in PDF, PNG, or JPG
                      format.
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
                          "block w-full rounded-md border p-3 shadow-sm placeholder:text-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                          {
                            "border-red-300": errors.name,
                            "border-gray-300": !errors.name,
                          }
                        )}
                        placeholder="Something very pretty"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600" id="email-error">
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
                          "block w-full rounded-md shadow-sm placeholder:text-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                          {
                            "border-red-300": errors.name,
                            "border-gray-300": !errors.name,
                          }
                        )}
                        placeholder={
                          "Something beautiful or funny. As you can see, there are no raccoons here."
                        }
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
                </div>
              )}
            />

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6" id="actions">
                <div className="flex justify-start gap-3">
                  <Button
                    onClick={handleSubmit((data) => {
                      updateItem.mutate({
                        id: query.iid,
                        name: data.name,
                        description: data.description,
                        front: data.front,
                        back: data.back,
                        status: "PUBLISHED",
                        size: data.size,
                      });
                    })}
                    size="sm"
                  >
                    Publish
                  </Button>
                  <Button
                    onClick={handleSubmit((data) => {
                      updateItem.mutate({
                        id: query.iid,
                        name: data.name,
                        description: data.description,
                        front: data.front,
                        back: data.back,
                        status: "DRAFT",
                        size: data.size,
                      });
                    })}
                    size="sm"
                    variant="secondary"
                  >
                    Preview
                  </Button>
                </div>
              </div>
              <div className="pt-6 sm:col-span-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Item Preview
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  This preview shows exactly how your item will look. It takes a
                  while to load...
                </p>
              </div>
            </div>

            <DefaultQueryCell
              query={itemsQuery}
              success={() => (
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6 lg:col-span-3" id="preview">
                    <PostcardPreview
                      itemId={item?.id || 0}
                      size={item?.size ? itemSizeToClient(item.size) : "4x6"}
                      front={item?.frontPreview || ""}
                      back={item?.backPreview || ""}
                      author={item?.publication?.author?.name || ""}
                      name={watch("name")}
                      description={watch("description")}
                      stripePaymentLink={item?.stripePaymentLink || "#"}
                      loadingState={!item?.postcardPreviewRendered}
                      hideAddressArea={true}
                    />
                  </div>
                </div>
              )}
            />
          </form>
          <div className="mt-6 sm:col-span-6" id="delete">
            <div className="flex items-center justify-start gap-3">
              <Button
                onClick={() => {
                  deleteItem.mutate({
                    id: query.iid,
                  });
                }}
                className="ml-3"
                size="sm"
                variant="danger"
              >
                Delete
              </Button>
              <p className="text-sm font-medium text-red-700">
                Warning: this action is irreversable
              </p>
            </div>
          </div>
        </Layout>
      ) : (
        <Layout>
          <SignIn />
        </Layout>
      )}
    </>
  );
};

export default Item;
