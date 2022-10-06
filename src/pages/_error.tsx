import { NextPageContext } from "next";
import NextErrorComponent from "next/error";

const CustomErrorComponent = (props: { statusCode: number }) => {
  return <NextErrorComponent statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(contextData);
};

export default CustomErrorComponent;
