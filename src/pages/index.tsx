import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const Items = () => {
  const { data: items, isLoading } = trpc.useQuery(["item.getAll"]);

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

const Home = () => {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [front, setFront] = useState([""]);
  const [back, setBack] = useState([""]);
  const ctx = trpc.useContext();
  const createItem = trpc.useMutation("item.createItem", {
    onMutate: () => {
      ctx.cancelQuery(["item.getAll"]);

      const optimisticUpdate = ctx.getQueryData(["item.getAll"]);
      if (optimisticUpdate) {
        ctx.setQueryData(["item.getAll"], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["item.getAll"]);
    },
  });

  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  return (
    <main className="max-w- flex flex-col items-center">
      <h1>Home</h1>
      {session ? (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
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
        </div>
      ) : (
        <div>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
          <div className="pt-10">
            <Items />
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;
