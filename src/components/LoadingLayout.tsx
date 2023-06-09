import Layout from "./Layout";
import Loading from "./Loading";

const LoadingLayout = ({
  message,
  children,
}: {
  message?: string;
  children?: JSX.Element;
}): JSX.Element => (
  <Layout>
    <Loading message={message}>{children}</Loading>
  </Layout>
);

export default LoadingLayout;
