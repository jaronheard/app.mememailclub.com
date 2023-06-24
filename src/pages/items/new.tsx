import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingLayout from "../../components/LoadingLayout";

const Page = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { isLoaded, isSignedIn } = useAuth();
  const { mutate, status } = trpc.useMutation("items.createItemForUser", {
    onSuccess: (data) => {
      utils.invalidateQueries();
      router.replace(`/publications/${data.publicationId}/items/${data.id}`);
    },
  });

  // effect that runs mutation when a user is signed in and loaded and cleans up when the component is unmounted
  useEffect(() => {
    if (isLoaded && isSignedIn && status === "idle") {
      mutate({
        name: "",
        description: "",
        front: `https://res.cloudinary.com/jaronheard/image/upload/ar_1.48,c_scale/v1687555005/bluePixel_eklcos.jpg`,
        back: `https://res.cloudinary.com/jaronheard/image/upload/ar_1.48,c_scale/v1687555005/redPixel_peptry.jpg`,
        status: "DRAFT",
        size: "6x9",
        visibility: "PRIVATE",
      });
    }
  }, [isLoaded, isSignedIn, status, mutate]);

  return (
    <>
      <SignedIn>
        <LoadingLayout>
          <p>Creating your new item...</p>
        </LoadingLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Page;
