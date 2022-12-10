import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SignIn from "../components/SignIn";

const Login = () => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      if (router.query.next) {
        router.push(router.query.next as string);
      } else {
        router.push("/");
      }
    }
  }, [status, router]);

  return <SignIn />;
};

export default Login;
