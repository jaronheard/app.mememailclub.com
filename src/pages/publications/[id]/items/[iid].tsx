import { useForm } from "react-hook-form";
// import Link from "next/link";
import { trpc } from "../../../../utils/trpc";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FileUpload from "../../../../components/FileUpload";
import DefaultQueryCell from "../../../../components/DefaultQueryCell";
import { z } from "zod";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import LoadingLayout from "../../../../components/LoadingLayout";
import Button from "../../../../components/Button";
import {
  ItemSizeOpts,
  PRIVATE_ITEM_DEFAULTS,
  itemSizeToClient,
} from "../../../../utils/itemSize";
import { Switch } from "@headlessui/react";
import Head from "next/head";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { PostcardPreviewSimple } from "../../../../components/PostcardPreviewSimple";
import { SIZES } from "../../../../utils/itemSize";

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
  iid: z.optional(z.string().transform((str) => Number(str))),
});

const Item = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const [queryStatus, setQueryStatus] = useState({
    ready: false,
    id: 0,
    iid: 0,
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ItemFormValues>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      front: "",
      back: "",
      size: "6x9",
      visibility: "PRIVATE",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const returnUrlUnchanged = (url: string, size: ItemSizeOpts) => {
    return url;
  };

  const itemsQuery = trpc.useQuery(["items.getOne", { id: queryStatus.iid }], {
    enabled: queryStatus.ready,
  });
  const { data: item } = itemsQuery;
  const updateItem = trpc.useMutation("items.updateItem", {
    onSuccess(data, variables) {
      item
        ? utils.setQueryData(["items.getOne", { id: queryStatus.iid }], {
            ...item,
            ...data,
          })
        : console.error("Query data not set in updateItem, item is undefined");
      variables.status === "DRAFT"
        ? router.push(
            `/publications/${queryStatus.id}/items/${queryStatus.iid}`
          )
        : router.push(`/send?id=${queryStatus.iid}`);
    },
  });
  const deleteItem = trpc.useMutation("items.deleteItem", {
    onSuccess() {
      utils.invalidateQueries();
      router.push(`/publications/${queryStatus.id}`);
    },
  });

  useEffect(() => {
    if (router.isReady) {
      const zQuery = ParamsValidator.safeParse(router.query);
      if (zQuery.success && zQuery.data.id && zQuery.data.iid) {
        setQueryStatus({
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
        visibility: item.visibility,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id, reset]);

  if (!queryStatus.ready) {
    return <LoadingLayout />;
  }

  return (
    <>
      <DefaultQueryCell
        query={itemsQuery}
        success={({ data: item }) => (
          <Breadcrumbs
            pages={[
              {
                name: item.publication.name,
                href: `/publications/${queryStatus.id}`,
                current: false,
              },
              {
                name: watch("name"),
                href: `/publications/${queryStatus.id}/items/${queryStatus.iid}`,
                current: true,
              },
            ]}
          />
        )}
        loading={() => <Breadcrumbs loading />}
      />
      <form className="mt-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Postcard
          </h3>
          <pre>{}</pre>
        </div>
        <DefaultQueryCell
          query={itemsQuery}
          success={() => (
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="hidden sm:col-span-6" id="size">
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
                        returnUrlUnchanged(watch("front"), watch("size"))
                      );
                      setValue(
                        "back",
                        returnUrlUnchanged(watch("back"), watch("size"))
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
                  getValues={getValues}
                  setValue={setValue}
                  errors={errors}
                  size={watch("size")}
                  postcardFrontWithRotation
                >
                  Maximum file size 10MB
                </FileUpload>
              </div>

              <div className="sm:col-span-3" id="back">
                <FileUpload
                  id="back"
                  label="Back (address and message side)"
                  getValues={getValues}
                  setValue={setValue}
                  errors={errors}
                  size={watch("size")}
                  postcardBackWithOverlay
                >
                  Maximum file size 10MB
                </FileUpload>
              </div>

              <div className="sm:col-span-6" id="visibility">
                <Switch.Group as="div" className="flex items-center">
                  <Switch.Label as="span" className="mr-3 w-[7ch] text-sm">
                    <div
                      className={
                        watch("visibility") === "PUBLIC"
                          ? "font-medium text-gray-900"
                          : "font-bold text-gray-900"
                      }
                    >
                      Private
                    </div>
                  </Switch.Label>
                  <Switch
                    checked={watch("visibility") === "PUBLIC"}
                    onChange={() =>
                      setValue(
                        "visibility",
                        watch("visibility") === "PUBLIC" ? "PRIVATE" : "PUBLIC"
                      )
                    }
                    className={clsx(
                      watch("visibility") === "PUBLIC"
                        ? "bg-indigo-600"
                        : "bg-gray-200",
                      "rounded-full relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={clsx(
                        watch("visibility") === "PUBLIC"
                          ? "translate-x-5"
                          : "translate-x-0",
                        "rounded-full pointer-events-none inline-block h-5 w-5 transform bg-white shadow ring-0 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                  <Switch.Label as="span" className="ml-3 w-[8ch] text-sm">
                    <span
                      className={
                        watch("visibility") === "PUBLIC"
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-900"
                      }
                    >
                      Public
                    </span>
                  </Switch.Label>
                </Switch.Group>
                <p className="mt-2 text-sm text-gray-500">
                  {watch("visibility") === "PUBLIC"
                    ? "Your postcard will be visible and available to send by anyone on PostPostcard once it is approved by our team."
                    : "Your postcard will only be visible to you"}
                </p>
              </div>

              <div
                className={
                  watch("visibility") === "PUBLIC" ? "sm:col-span-4" : "hidden"
                }
                id="name"
              >
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <div className="mt-1">
                  <input
                    {...register("name", {
                      required: watch("visibility") === "PUBLIC",
                    })}
                    autoComplete="off"
                    className={clsx(
                      "block w-full rounded-md border p-3 shadow-sm placeholder:text-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      {
                        "border-red-300": errors.name,
                        "border-gray-300": !errors.name,
                      }
                    )}
                    placeholder="Your postcard is your art, give it a title!"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    Title is required.
                  </p>
                )}
              </div>

              <div
                className={
                  watch("visibility") === "PUBLIC" ? "sm:col-span-6" : "hidden"
                }
                id="description"
              >
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    {...register("description", {
                      required: watch("visibility") === "PUBLIC",
                    })}
                    autoComplete="off"
                    rows={3}
                    className={clsx(
                      "block w-full rounded-md shadow-sm placeholder:text-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      {
                        "border-red-300": errors.name,
                        "border-gray-300": !errors.name,
                      }
                    )}
                    placeholder={"A longer description of your postcard."}
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
          loading={() => (
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="hidden sm:col-span-6" id="size">
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
                  defaultValue="6x9"
                  disabled
                >
                  <option value="6x9">6x9</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 sm:col-span-3" id="front">
                <p className="block text-sm font-medium text-gray-700">Front</p>
                <div className={SIZES["6x9"].previewClassNames}>
                  <PostcardPreviewSimple
                    id={`loading-front`}
                    loadingState={true}
                    front=""
                    name=""
                    description=""
                    onClick={() => null}
                    hideText
                  />
                </div>
                <p className="mt-1 block text-sm font-medium text-gray-700">
                  Maximum file size 10MB
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:col-span-3" id="back">
                <p className="block text-sm font-medium text-gray-700">
                  Back (address and message side)
                </p>
                <div className={SIZES["6x9"].previewClassNames}>
                  <PostcardPreviewSimple
                    id={`loading-back`}
                    loadingState={true}
                    front=""
                    name=""
                    description=""
                    onClick={() => null}
                    hideText
                  />
                </div>
                <p className="mt-1 block text-sm font-medium text-gray-700">
                  Maximum file size 10MB
                </p>
              </div>

              <div className="sm:col-span-6" id="visibility">
                <Switch.Group as="div" className="flex items-center">
                  <Switch.Label as="span" className="mr-3 w-[7ch] text-sm">
                    <div className="font-bold text-gray-900">Private</div>
                  </Switch.Label>
                  <Switch
                    checked
                    className="rounded-full relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                    disabled
                  >
                    <span
                      aria-hidden="true"
                      className="rounded-full pointer-events-none inline-block h-5 w-5 translate-x-0 transform bg-white shadow ring-0 transition duration-200 ease-in-out"
                    />
                  </Switch>
                  <Switch.Label as="span" className="ml-3 w-[8ch] text-sm">
                    <span className="font-medium text-gray-900">Public</span>
                  </Switch.Label>
                </Switch.Group>
                <p className="mt-2 text-sm text-gray-500">
                  Postcard visibility loading...
                </p>
              </div>
            </div>
          )}
        />

        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="col-span-6 sm:col-span-4" id="actions">
            <div className="flex items-center justify-start gap-3">
              <Button
                onClick={handleSubmit((data) => {
                  updateItem.mutate({
                    id: queryStatus.iid,
                    name: data.name || PRIVATE_ITEM_DEFAULTS.name,
                    description:
                      data.description || PRIVATE_ITEM_DEFAULTS.description,
                    front: data.front,
                    back: data.back,
                    status: "PUBLISHED",
                    size: data.size,
                    visibility: data.visibility,
                  });
                })}
                size="sm"
              >
                Add Message
              </Button>
              <Button
                onClick={handleSubmit((data) => {
                  updateItem.mutate({
                    id: queryStatus.iid,
                    name: data.name || PRIVATE_ITEM_DEFAULTS.name,
                    description:
                      data.description || PRIVATE_ITEM_DEFAULTS.description,
                    front: data.front,
                    back: data.back,
                    status: "DRAFT",
                    size: data.size,
                    visibility: data.visibility,
                  });
                })}
                size="sm"
                variant="secondary"
                disabled={!isDirty}
              >
                {isDirty ? "Save Draft" : "Saved"}
              </Button>
            </div>
          </div>
          <div className="col-span-6 sm:col-span-2" id="delete">
            <div className="flex items-center justify-start gap-3">
              <Button
                onClick={(event) => {
                  event?.preventDefault();
                  deleteItem.mutate({
                    id: queryStatus.iid,
                  });
                }}
                size="sm"
                variant="danger"
              >
                Delete
              </Button>
              <p className="text-sm font-medium text-red-700">
                Warning: this action is irreversible
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

const Page = () => {
  return (
    <>
      <Head>
        <title>Postcard - PostPostcard</title>
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
