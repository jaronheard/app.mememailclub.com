import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Layout from "../components/Layout";
import SignIn from "../components/SignIn";
import { trpc } from "../utils/trpc";
import { PlusIcon } from "@heroicons/react/20/solid";

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
        No publications
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new publication.
      </p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Publication
        </button>
      </div>
    </div>
  );
};

const Items = () => {
  const { data: items, isLoading } = trpc.useQuery(["items.getAll"]);

  if (isLoading) return <div>Fetching messages...</div>;

  return (
    <div className="flex flex-col gap-4">
      {items?.map((item, index) => {
        return (
          <div key={index}>
            <p>{item.name}</p>
            <code className="max-w-md">{item.front[0]}</code>
            <br></br>
            <code className="max-w-md">{item.back[0]}</code>
          </div>
        );
      })}
    </div>
  );
};

const Publications = () => {
  const { data: publications, isLoading } = trpc.useQuery([
    "publications.getAll",
  ]);

  if (isLoading) return <div>Fetching messages...</div>;

  // return placeeholder if 0 publications
  if (publications?.length === 0) {
    return <PublicationsEmpty />;
  }

  return (
    <div className="flex flex-col gap-4">
      {publications?.map((publication, index) => {
        console.log(publication);
        return (
          <div key={index}>
            <p>{publication.name}</p>
            <p>{publication.description}</p>
          </div>
        );
      })}
    </div>
  );
};

const Home = () => {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [front, setFront] = useState([""]);
  const [back, setBack] = useState([""]);
  const ctx = trpc.useContext();
  const createItem = trpc.useMutation("items.createItem", {
    onMutate: () => {
      ctx.cancelQuery(["items.getAll"]);

      const optimisticUpdate = ctx.getQueryData(["items.getAll"]);
      if (optimisticUpdate) {
        ctx.setQueryData(["items.getAll"], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["items.getAll"]);
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
          <Publications />
          {/* <div>
            <div className="pt-6">
              <form
                className="flex flex-col gap-2"
                onSubmit={(event) => {
                  event.preventDefault();

                  createItem.mutate({
                    email: session.user?.email as string,
                    name: name,
                    front: front,
                    back: back,
                  });

                  setName("");
                  setFront([""]);
                  setBack([""]);
                }}
              >
                <input
                  type="text"
                  value={name}
                  placeholder="Name"
                  onChange={(event) => setName(event.target.value)}
                  className="rounded-md border-2 border-zinc-800 px-4 py-2 focus:outline-none"
                />
                <input
                  type="text"
                  value={front}
                  placeholder="Front"
                  onChange={(event) => setFront([event.target.value])}
                  className="rounded-md border-2 border-zinc-800 px-4 py-2 focus:outline-none"
                />
                <input
                  type="text"
                  value={back}
                  placeholder="Back"
                  onChange={(event) => setBack([event.target.value])}
                  className="rounded-md border-2 border-zinc-800 px-4 py-2 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
                >
                  Submit
                </button>
              </form>
            </div>
            <div className="pt-10">
              <Items />
            </div> 
          </div>*/}
        </Layout>
      ) : (
        <SignIn signIn={() => signIn("google")} />
      )}
    </>
  );
};

export default Home;
