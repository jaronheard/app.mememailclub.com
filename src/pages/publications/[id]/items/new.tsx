import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Layout from "../../../../components/Layout";
import SignIn from "../../../../components/SignIn";
import { trpc } from "../../../../utils/trpc";
import clsx from "clsx";
import { useRouter } from "next/router";
import { ItemFormValues } from "./[iid]";
import FileUpload from "../../../../components/FileUpload";

const New = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
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
  const createItem = trpc.useMutation("items.createItem", {
    onSuccess: () => router.push(`/publications/${id}`),
  });

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  return (
    <>
      {session ? (
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
                      accept="image/*"
                      required
                      register={register}
                      getValues={getValues}
                      setValue={setValue}
                      errors={errors}
                    />
                  </div>
                  <div className="sm:col-span-6">
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
                  <div className="sm:col-span-6">
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
                  onClick={handleSubmit((data) => {
                    createItem.mutate({
                      publicationId: Number(id),
                      name: data.name,
                      description: data.description,
                      imageUrl: data.imageUrl,
                      front: data.front,
                      back: data.back,
                      status: "DRAFT",
                    });
                  })}
                  className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save draft
                </button>
                <button
                  onClick={handleSubmit((data) => {
                    createItem.mutate({
                      publicationId: Number(id),
                      name: data.name,
                      description: data.description,
                      imageUrl: data.imageUrl,
                      front: data.front,
                      back: data.back,
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
        </Layout>
      ) : (
        <SignIn />
      )}
    </>
  );
};

export default New;
