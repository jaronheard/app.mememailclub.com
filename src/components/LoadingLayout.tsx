import Layout from "./Layout";
import Loading from "./Loading";

const LoadingLayout = ({ message }: { message?: string }): JSX.Element => (
  <Layout>
    <Loading message={message} />
  </Layout>
);

export default LoadingLayout;
