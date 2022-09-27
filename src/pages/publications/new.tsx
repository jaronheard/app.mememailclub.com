import { signIn, signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Layout from "../../components/Layout";
import SignIn from "../../components/SignIn";
import { trpc } from "../../utils/trpc";
import clsx from "clsx";
import { router } from "@trpc/server";
import { useRouter } from "next/router";

const New = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const ctx = trpc.useContext();
  const createPublication = trpc.useMutation("publications.createPublication", {
    onMutate: () => {
      ctx.cancelQuery(["publications.getAll"]);

      const optimisticUpdate = ctx.getQueryData(["publications.getAll"]);
      if (optimisticUpdate) {
        ctx.setQueryData(["publications.getAll"], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["publications.getAll"]);
    },
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
          signOut={signOut}
        >
          <form
            onSubmit={handleSubmit((data) => {
              createPublication.mutate({
                authorId: session.user?.id as string,
                name: data.name,
                description: data.description,
                imageUrl:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              });

              router.push("/");
            })}
          >
            <div className="space-y-8 divide-y divide-gray-200">
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
                      Write a few sentences about your publication.
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="photo"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cover photo
                    </label>
                    <div
                      className={clsx(
                        "mt-1 flex justify-center rounded-md border-2 border-dashed px-6 pt-5 pb-6",
                        {
                          "border-red-300": errors.photo,
                          "border-gray-300": !errors.photo,
                        }
                      )}
                    >
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="photo"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              {...register("photo")}
                              type="file"
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    {errors.description && (
                      <p className="mt-2 text-sm text-red-600" id="email-error">
                        Cover photo is required.
                      </p>
                    )}
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
                  type="submit"
                  className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </Layout>
      ) : (
        <SignIn signIn={() => signIn("google")} />
      )}
    </>
  );
};

export default New;
