import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import { trpc } from "../../utils/trpc";
// Import for PublicationsEmpty
import { EyeIcon, EyeSlashIcon, PlusIcon } from "@heroicons/react/20/solid";
//imports for PublicationsList
import { ChevronRightIcon, EnvelopeOpenIcon } from "@heroicons/react/20/solid";
import { format } from "date-fns";
import Link from "next/link";
import DefaultQueryCell from "../../components/DefaultQueryCell";
import Img from "../../components/Img";
import SignIn from "../../components/SignIn";
import Breadcrumbs from "../../components/Breadcrumbs";
import LoadingLayout from "../../components/LoadingLayout";

const PublicationsEmpty = () => {
  return (
    <div className="text-center">
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
        You have no postcard collections
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new postcard collection.
      </p>
      <div className="mt-6">
        <Link href="/publications/new">
          <a className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            New Postcard Collection
          </a>
        </Link>
      </div>
    </div>
  );
};

const Publications = () => {
  const { data: session } = useSession();
  const publicationsQuery = trpc.useQuery(
    [
      "publications.getAllByAuthor",
      {
        authorId: session?.user?.id as string,
      },
    ],
    { enabled: !!session?.user?.id }
  );

  return (
    <div>
      <Breadcrumbs pages={[]} />
      <DefaultQueryCell
        query={publicationsQuery}
        empty={() => <PublicationsEmpty />}
        success={({ data: publications }) => (
          <div className="mt-6 overflow-hidden bg-white shadow sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {publications &&
                publications.map((publication) => (
                  <li key={publication.id}>
                    <Link href={`/publications/${publication.id}`}>
                      <a className="block hover:bg-gray-50">
                        <div className="flex items-center px-4 py-4 sm:px-6">
                          <div className="flex min-w-0 flex-1 items-center">
                            <div className="flex-shrink-0">
                              <Img
                                className="h-20 w-20 rounded-md"
                                src={publication.imageUrl || ""}
                                alt=""
                                height={80}
                                width={80}
                                autoCrop
                              />
                            </div>
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                              <div>
                                <p className="truncate text-sm font-medium text-indigo-600">
                                  {publication.name}
                                </p>
                                <p className="truncate text-sm text-gray-500">
                                  {publication.description}
                                </p>
                                <p className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                                  {/* <UsersIcon
                                    className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <span className="">
                                    {publication.Subscriptions.length}{" "}
                                    subscribers
                                  </span> */}
                                  <div
                                    className="flex items-center gap-1.5"
                                    id="postcards"
                                  >
                                    <EnvelopeOpenIcon
                                      className="h-5 w-5 flex-shrink-0 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span className="">
                                      {publication.Items.length} postcards
                                    </span>
                                  </div>
                                </p>
                              </div>
                              <div className="hidden md:block">
                                <div>
                                  <p className="text-sm text-gray-900">
                                    Created on{" "}
                                    <time
                                      dateTime={format(
                                        publication.createdAt,
                                        "yyyy-MM-dd"
                                      )}
                                    >
                                      {format(
                                        publication.createdAt,
                                        "yyyy-MM-dd"
                                      )}
                                    </time>
                                  </p>
                                  <p className="mt-2 flex items-center text-sm text-gray-500">
                                    {publication.status === "DRAFT" && (
                                      <EyeSlashIcon
                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    )}
                                    {publication.status === "PUBLISHED" && (
                                      <EyeIcon
                                        className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                      />
                                    )}
                                    <span className="capitalize">
                                      {publication.status.toLowerCase()}
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
        )}
      />
      <Link href="/publications/new">
        <a className="mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Postcard Collection
        </a>
      </Link>
    </div>
  );
};

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <LoadingLayout />;
  }

  return (
    <>
      {status === "authenticated" && session.user ? (
        <Layout
          user={{
            name: session.user.name,
            email: session.user.email,
            imageUrl: session.user.image,
          }}
        >
          <Publications />
        </Layout>
      ) : (
        <Layout>
          <SignIn />
          {/* <Publications /> */}
        </Layout>
      )}
    </>
  );
};

export default Home;
