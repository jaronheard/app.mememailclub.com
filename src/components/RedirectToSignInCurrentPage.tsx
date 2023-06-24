import { RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

const RedirectToSignInCurrentPage = () => {
  const { pathname } = useRouter();
  return (
    <RedirectToSignIn afterSignInUrl={pathname} afterSignUpUrl={pathname} />
  );
};

export default RedirectToSignInCurrentPage;
