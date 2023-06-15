import { useUser } from "@clerk/nextjs";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LoadingLayout from "../../components/LoadingLayout";

const Page = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { isLoaded, isSignedIn, user } = useUser();
  const { mutate, status } = trpc.useMutation("items.createItemForUser", {
    onSuccess: (data) => {
      utils.invalidateQueries();
      router.push(`/publications/${data.publicationId}/items/${data.id}`);
    },
  });

  // effect that runs mutation when a user is signed in and loaded and cleans up when the component is unmounted
  useEffect(() => {
    if (isLoaded && isSignedIn && status === "idle") {
      mutate({
        userId: user.id, //TODO: get from user
        name: "",
        description: "",
        front: `https://res.cloudinary.com/jaronheard/image/upload/v1685407734/6x9_postcard_front_ismigp.png`,
        back: `https://res.cloudinary.com/jaronheard/image/upload/v1685407706/6x9_postcard_ztcybr.png`,
        status: "DRAFT",
        size: "6x9",
        visibility: "PRIVATE",
      });
    }
  }, [isLoaded, isSignedIn, status, mutate, user?.id]);

  return (
    <LoadingLayout>
      <p>Creating your new item...</p>
    </LoadingLayout>
  );
};

export default Page;
