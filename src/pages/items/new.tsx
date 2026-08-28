import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import LoadingLayout from "../../components/LoadingLayout";
import { ITEM_DEFAULTS } from "../../utils/itemSize";
import { useAnonymousUserId } from "../../utils/anonymousUserId";

const SignedInNew = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const createItemForUser = useAction(api.itemsNode.createItemForUser);
  // the action must run exactly once, even under React strict mode
  const started = useRef(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && !started.current) {
      started.current = true;
      createItemForUser(ITEM_DEFAULTS)
        .then((data) => {
          router.replace(`/publications/${data.publicationId}/items/${data.id}`);
        })
        .catch((error) => {
          console.error("error creating item", error);
        });
    }
  }, [isLoaded, isSignedIn, createItemForUser, router]);

  return (
    <LoadingLayout>
      <p>Creating your new item...</p>
    </LoadingLayout>
  );
};

const SignedOutNew = () => {
  const router = useRouter();
  const createItemForAnonymousUser = useAction(
    api.itemsNode.createItemForAnonymousUser
  );
  const anonymousUserId = useAnonymousUserId();
  const started = useRef(false);

  useEffect(() => {
    if (anonymousUserId && !started.current) {
      started.current = true;
      createItemForAnonymousUser({
        ...ITEM_DEFAULTS,
        anonymousUserId: anonymousUserId,
      })
        .then((data) => {
          router.replace(`/publications/${data.publicationId}/items/${data.id}`);
        })
        .catch((error) => {
          console.error("error creating item", error);
        });
    }
  }, [anonymousUserId, createItemForAnonymousUser, router]);

  return (
    <LoadingLayout>
      <p>Creating a new item...</p>
    </LoadingLayout>
  );
};

const Page = () => {
  return (
    <>
      <SignedIn>
        <SignedInNew />
      </SignedIn>
      <SignedOut>
        <SignedOutNew />
      </SignedOut>
    </>
  );
};

export default Page;
