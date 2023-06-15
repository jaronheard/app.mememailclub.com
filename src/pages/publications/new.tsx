import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import { trpc } from "../../utils/trpc";
import clsx from "clsx";
import { useRouter } from "next/router";
import { PublicationFormValues } from "./[id]";
import Breadcrumbs from "../../components/Breadcrumbs";
import Button from "../../components/Button";
import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";

type NewProps = {
  user: UserResource;
};

const New = ({ user }: NewProps) => {
  const router = useRouter();
  const utils = trpc.useContext();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PublicationFormValues>({
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const createPublication = trpc.useMutation("publications.createPublication", {
    onSuccess(data) {
      utils.invalidateQueries();
      router.push(`/publications/${data.id}`);
    },
  });

  return (
    <>
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
                      "block w-full rounded-md border p-3 shadow-sm placeholder:text-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      {
                        "border-red-300": errors.name,
                        "border-gray-300": !errors.name,
                      }
                    )}
                    placeholder="Everything but raccoons"
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
                      "block w-full rounded-md shadow-sm placeholder:text-gray-300  focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
                      {
                        "border-red-300": errors.name,
                        "border-gray-300": !errors.name,
                      }
                    )}
                    placeholder="My entire collection of postcards, except for my special raccoon meme collection. 🌈✨💖"
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
            </div>
          </div>
        </div>
        <div className="pt-5">
          <div className="flex justify-end">
            <Button
              onClick={handleSubmit((data) => {
                createPublication.mutate({
                  userId: user.id,
                  name: data.name,
                  description: data.description,
                  imageUrl:
                    "https://res.cloudinary.com/jaronheard/image/upload/v1685474738/folder_fpgnfp.png",
                  status: "PUBLISHED",
                });
              })}
              className="ml-3"
            >
              Create Collection
            </Button>
          </div>
        </div>
      </form>
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
      <New user={user} />
    </Layout>
  );
};

export default Page;
