import { signIn, signOut, useSession } from "next-auth/react";
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
