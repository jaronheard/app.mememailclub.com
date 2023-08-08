import React from "react";
import { MjmlColumn, MjmlSection, MjmlWrapper } from "@faire/mjml-react";
import BaseLayout from "./components/BaseLayout";
import Footer from "./components/Footer";
import Heading from "./components/Heading";
import Header from "./components/Header";
import { spacing } from "./theme";

type WelcomeProps = {
  includeUnsubscribe?: boolean;
};

const Welcome = ({ includeUnsubscribe }: WelcomeProps) => {
  return (
    <BaseLayout width={600}>
      <Header />
      <MjmlWrapper>
        <MjmlSection paddingBottom={spacing.s11} cssClass="gutter">
          <MjmlColumn>
            <Heading maxWidth={420} cssClass="h1">
              Your Postcard has been sent!
            </Heading>
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
Welcome.subject = "Thank you for installing Mailing :)";
export default Welcome;
