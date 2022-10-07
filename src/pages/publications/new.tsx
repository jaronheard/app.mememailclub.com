import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import SignIn from "../../components/SignIn";
import { trpc } from "../../utils/trpc";
import clsx from "clsx";
import { useRouter } from "next/router";
import FileUpload from "../../components/FileUpload";
import { PublicationFormValues } from "./[id]";
import Breadcrumbs from "../../components/Breadcrumbs";
import LoadingLayout from "../../components/LoadingLayout";

const New = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PublicationFormValues>({
    defaultValues: {
      name: "Everything but raccoons 🌈✨💖",
      description:
        "My entire collection of postcards, except for my special raccoon meme collection.",
      imageUrl: "",
    },
  });
  const createPublication = trpc.useMutation("publications.createPublication", {
    onSuccess(data) {
      router.push(`/publications/${data.id}`);
    },
  });

  if (status === "loading") {
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
          <Breadcrumbs
            pages={[
              {
                name: watch("name"),
                href: "/publications/new",
                current: false,
              },
            ]}
          />
          <form className="mt-6">
            <div className="space-y-8 divide-y divide-gray-200">
              <div>
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Postcard collection
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    If you choose to make your postcard collection public, this
                    information will help others find it!
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
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
                        Name is required.
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      The name of your new postcard collection
                    </p>
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
                        Description is required
                      </p>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      A few sentences about your new postcard collection
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    <FileUpload
                      id="imageUrl"
                      label="Cover Image"
                      accept="image/*"
                      required
                      register={register}
                      getValues={getValues}
                      setValue={setValue}
                      errors={errors}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      A cover photo for your new postcard collection
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <div className="flex justify-end">
                {/* <button
                  onClick={handleSubmit((data) => {
                    createPublication.mutate({
                      authorId: session.user?.id as string,
                      name: data.name,
                      description: data.description,
                      imageUrl:
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                      status: "DRAFT",
                    });
                  })}
                  className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save draft
                </button> */}
                <button
                  onClick={handleSubmit((data) => {
                    createPublication.mutate({
                      authorId: session.user?.id as string,
                      name: data.name,
                      description: data.description,
                      imageUrl: data.imageUrl,
                      status: "PUBLISHED",
                    });
                  })}
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create Collection
                </button>
              </div>
            </div>
          </form>
        </Layout>
      ) : (
        <Layout>
          <SignIn />
        </Layout>
      )}
    </>
  );
};

export default New;
