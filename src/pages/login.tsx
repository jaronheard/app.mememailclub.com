import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SignIn from "../components/SignIn";

const Login = () => {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      if (router.query.next) {
        router.push(router.query.next as string);
      } else {
        router.push("/");
      }
    }
  }, [isLoaded, userId, router]);

  return <SignIn />;
};

export default Login;
