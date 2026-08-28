import React from "react";
import { Section } from "@react-email/components";
import BaseLayout from "./_components/BaseLayout";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Heading from "./_components/Heading";
import Text from "./_components/Text";
import { colors, spacing } from "./theme";

type WelcomeProps = {
  includeUnsubscribe?: boolean;
};

const Welcome = ({ includeUnsubscribe }: WelcomeProps) => {
  return (
    <BaseLayout width={600}>
      <Header />
      <Section
        className="gutter"
        style={{
          backgroundColor: colors.postcard,
          paddingTop: spacing.s11,
          paddingBottom: spacing.s11,
        }}
      >
        <Heading maxWidth={420} style={{ color: colors.black }}>
          Welcome to PostPostcard!
        </Heading>
        <Text style={{ color: colors.black }}>Glad you are here!</Text>
      </Section>
      <Section style={{ paddingBottom: spacing.s11 }} />
      <Footer includeUnsubscribe={includeUnsubscribe} />
    </BaseLayout>
  );
};
Welcome.subject = "Thank you for signing up!";
Welcome.PreviewProps = {
  includeUnsubscribe: true,
} satisfies WelcomeProps;
export default Welcome;
