import React from "react";
import { MjmlColumn, MjmlSection, MjmlWrapper } from "@faire/mjml-react";
import BaseLayout from "./components/BaseLayout";
import Footer from "./components/Footer";
import Heading from "./components/Heading";
import Text from "./components/Text";
import Header from "./components/Header";
import { colors, fontFamily, spacing } from "./theme";
import Link from "./components/Link";

type PostcardErrorProps = {
  includeUnsubscribe?: boolean;
  postcardData?: {
    to: string;
    front: string;
    back: string;
    size: string;
    quantity: number;
  };
  error?: string;
};

const PostcardError = ({
  includeUnsubscribe,
  postcardData,
  error,
}: PostcardErrorProps) => {
  return (
    <BaseLayout width={600}>
      <Header />
      <MjmlWrapper>
        <MjmlSection
          padding={spacing.s11}
          cssClass="gutter"
          backgroundColor={colors.postcard}
        >
          <MjmlColumn>
            <Heading maxWidth={420} cssClass="h1" color={colors.black}>
              ⚠️ A postcard has errored!
            </Heading>
            {postcardData && (
              <>
                <Text color={colors.black}>
                  This postcard errored when it was sent to Lob.
                </Text>
                <Text color={colors.black} paddingTop={spacing.s8}>
                  <Link
                    href={`https://dashboard.lob.com/addresses/${postcardData.to}`}
                  >
                    {postcardData.to}
                  </Link>
                </Text>
                <Text color={colors.black}>
                  <Link href={postcardData.front}>Front</Link>
                </Text>
                <Text color={colors.black}>
                  <Link href={postcardData.back}>Back</Link>
                </Text>
                <Text color={colors.black} paddingTop={spacing.s8}>
                  <Link href="https://dashboard.lob.com/logs?status_code%5B0%5D=401&status_code%5B1%5D=403&status_code%5B2%5D=404&status_code%5B3%5D=422&status_code%5B4%5D=429&status_code%5B5%5D=500">
                    View Lob Logs
                  </Link>
                </Text>
              </>
            )}
            {!postcardData && (
              <>
                <Text color={colors.black}>
                  This error occurred before the postcard was sent to Lob.
                </Text>
                <Text
                  color={colors.black}
                  fontFamily={fontFamily.mono}
                  paddingTop={spacing.s8}
                >
                  {error}
                </Text>
              </>
            )}
          </MjmlColumn>
        </MjmlSection>
        <MjmlSection
          paddingBottom={spacing.s11}
          cssClass="gutter"
        ></MjmlSection>
      </MjmlWrapper>
      <Footer includeUnsubscribe={includeUnsubscribe} />
    </BaseLayout>
  );
};
PostcardError.subject = `⚠️ A postcard has errored!`;
export default PostcardError;
