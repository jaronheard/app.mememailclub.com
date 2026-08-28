import { RedirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

const RedirectToSignInCurrentPage = () => {
  const { pathname } = useRouter();
  return (
    <RedirectToSignIn
      signInForceRedirectUrl={pathname}
      signUpForceRedirectUrl={pathname}
    />
  );
};

export default RedirectToSignInCurrentPage;
