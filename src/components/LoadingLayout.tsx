import Loading from "./Loading";

const LoadingLayout = ({
  message,
  children,
}: {
  message?: string;
  children?: JSX.Element;
}): JSX.Element => <Loading message={message}>{children}</Loading>;

export default LoadingLayout;
