import { useSession } from "next-auth/react";
import Layout from "../components/Layout";
import SignIn from "../components/SignIn";
import { trpc } from "../utils/trpc";

const Address = () => {
  const { data: session, status } = useSession();
  const createAddress = trpc.useMutation("lob.createAddress");

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
          <button
            onClick={() => {
              createAddress.mutate({
                name: "Thing T. Thing",
                address_line1: "1313 CEMETERY LN",
                address_city: "WESTFIELD",
                address_state: "NJ",
                address_zip: "07090",
              });
            }}
            className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save draft
          </button>
        </Layout>
      ) : (
        <SignIn />
      )}
    </>
  );
};

export default Address;
