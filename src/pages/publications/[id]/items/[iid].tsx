import { useForm } from "react-hook-form";
// import Link from "next/link";
import { useAction, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FileUpload from "../../../../components/FileUpload";
import QueryCell from "../../../../components/QueryCell";
import { z } from "zod";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import LoadingLayout from "../../../../components/LoadingLayout";
import Button from "../../../../components/Button";
import {
  ItemSizeOpts,
  PRIVATE_ITEM_DEFAULTS,
  itemSizeToClient,
} from "../../../../utils/itemSize";
import { Field, Label, Switch } from "@headlessui/react";
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

type ItemStatus = "DRAFT" | "PUBLISHED";

const ParamsValidator = z.object({
  id: z.optional(z.string().transform((str) => Number(str))),
  iid: z.optional(z.string().transform((str) => Number(str))),
});

const disallowedChars = ["'", '"', "!", "@", "#"]; // Add or remove characters as required.
const hasNoDisallowedChars = (value: string | undefined): boolean | string => {
  const foundChars = disallowedChars.filter((char) => value?.includes(char));

  if (foundChars.length > 0) {
    return `These characters are not allowed: ${foundChars.join(", ")}`;
  }

  return true;
};

const Item = () => {
  const router = useRouter();
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

  const item = useQuery(
    api.items.getOne,
    queryStatus.ready ? { id: queryStatus.iid } : "skip"
  );
  const updateItem = useAction(api.itemsNode.updateItem);
  const deleteItem = useAction(api.itemsNode.deleteItem);

  const saveItem = async (values: ItemFormValues, status: ItemStatus) => {
    await updateItem({
      id: queryStatus.iid,
      name: values.name || PRIVATE_ITEM_DEFAULTS.name,
      description: values.description || PRIVATE_ITEM_DEFAULTS.description,
      front: values.front,
      back: values.back,
      status,
      size: values.size,
      visibility: values.visibility,
    });
    if (status === "DRAFT") {
      router.push(`/publications/${queryStatus.id}/items/${queryStatus.iid}`);
    } else {
      router.push(`/send?id=${queryStatus.iid}`);
    }
  };

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
      <QueryCell
        data={item}
        success={(item) => (
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
        <QueryCell
          data={item}
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
                <Field as="div" className="flex items-center">
                  <Label as="span" className="mr-3 w-[7ch] text-sm">
                    <div
                      className={
                        watch("visibility") === "PUBLIC"
                          ? "font-medium text-gray-900"
                          : "font-bold text-gray-900"
                      }
                    >
                      Private
                    </div>
                  </Label>
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
                      "rounded-full relative inline-flex h-6 w-11 shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
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
                  <Label as="span" className="ml-3 w-[8ch] text-sm">
                    <span
                      className={
                        watch("visibility") === "PUBLIC"
                          ? "font-bold text-gray-900"
                          : "font-medium text-gray-900"
                      }
                    >
                      Public
                    </span>
                  </Label>
                </Field>
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
                      validate: hasNoDisallowedChars,
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
                    {errors.name.message || "Title is required."}
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
                      validate: hasNoDisallowedChars,
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
                    {errors.description.message || "Description is required."}
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
                <Field as="div" className="flex items-center">
                  <Label as="span" className="mr-3 w-[7ch] text-sm">
                    <div className="font-bold text-gray-900">Private</div>
                  </Label>
                  <Switch
                    checked
                    className="rounded-full relative inline-flex h-6 w-11 shrink-0 cursor-pointer border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                    disabled
                  >
                    <span
                      aria-hidden="true"
                      className="rounded-full pointer-events-none inline-block h-5 w-5 translate-x-0 transform bg-white shadow ring-0 transition duration-200 ease-in-out"
                    />
                  </Switch>
                  <Label as="span" className="ml-3 w-[8ch] text-sm">
                    <span className="font-medium text-gray-900">Public</span>
                  </Label>
                </Field>
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
                onClick={handleSubmit((data) => saveItem(data, "PUBLISHED"))}
                size="sm"
              >
                Add Message
              </Button>
              <Button
                onClick={handleSubmit((data) => saveItem(data, "DRAFT"))}
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
                onClick={async (event) => {
                  event?.preventDefault();
                  await deleteItem({
                    id: queryStatus.iid,
                  });
                  router.push(`/publications/${queryStatus.id}`);
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
