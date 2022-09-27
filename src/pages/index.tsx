import { signIn, signOut, useSession } from "next-auth/react";

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  return (
    <main>
      <h1>Home</h1>
      {session ? (
        <div>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      ) : (
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      )}
    </main>
  );
};

export default Home;
