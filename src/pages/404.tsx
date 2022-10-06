import Error from "next/error";

export default function Page() {
  return <Error statusCode={404} />;
}
