import React from "react";
import { MjmlColumn, MjmlSection, MjmlWrapper } from "@faire/mjml-react";
import BaseLayout from "./components/BaseLayout";
import Footer from "./components/Footer";
import Heading from "./components/Heading";
import Text from "./components/Text";
import Header from "./components/Header";
import { colors, spacing } from "./theme";
import { Postcard } from "@lob/lob-typescript-sdk";
import Link from "./components/Link";

type PostcardSentProps = {
  includeUnsubscribe?: boolean;
  postcard: Postcard;
};

const PostcardSent = ({ includeUnsubscribe, postcard }: PostcardSentProps) => {
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
              Your postcard to {postcard.to?.name} has been sent!
            </Heading>
            <Text color={colors.black}>
              Expected delivery date {postcard.expected_delivery_date}
            </Text>
            <Text color={colors.black}>
              <Link href={postcard.url}>View Postcard</Link>
            </Text>
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
PostcardSent.subject = "Thank you for signing up!";
export default PostcardSent;
