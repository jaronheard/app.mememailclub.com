import React from "react";
import { MjmlColumn, MjmlSection, MjmlWrapper } from "@faire/mjml-react";
import BaseLayout from "./components/BaseLayout";
import Footer from "./components/Footer";
import Heading from "./components/Heading";
import Text from "./components/Text";
import Header from "./components/Header";
import { colors, spacing } from "./theme";

type WelcomeProps = {
  includeUnsubscribe?: boolean;
};

const Welcome = ({ includeUnsubscribe }: WelcomeProps) => {
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
              Welcome to PostPostcard!
            </Heading>
            <Text color={colors.black}>Glad you are here!</Text>
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
Welcome.subject = "Thank you for signing up!";
export default Welcome;
