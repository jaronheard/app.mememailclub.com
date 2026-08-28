import React from "react";
import { Section } from "@react-email/components";
import { Postcard } from "@lob/lob-typescript-sdk";
import BaseLayout from "./_components/BaseLayout";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Heading from "./_components/Heading";
import Link from "./_components/Link";
import Text from "./_components/Text";
import { colors, spacing } from "./theme";

type PostcardSentProps = {
  includeUnsubscribe?: boolean;
  postcard: Postcard;
};

const PostcardSent = ({ includeUnsubscribe, postcard }: PostcardSentProps) => {
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
          💌 Your postcard to {postcard.to?.name} has been sent!
        </Heading>
        <Text style={{ color: colors.black }}>
          Expected delivery date: {postcard.expected_delivery_date}
        </Text>
        <Text style={{ color: colors.black }}>
          <Link href={postcard.url}>View Postcard</Link>
        </Text>
      </Section>
      <Section style={{ paddingBottom: spacing.s11 }} />
      <Footer includeUnsubscribe={includeUnsubscribe} />
    </BaseLayout>
  );
};
PostcardSent.subject = "💌 Your postcard has been sent!";
PostcardSent.PreviewProps = {
  includeUnsubscribe: true,
  postcard: {
    id: "psc_0287b0d8a796a827",
    description: null,
    metadata: {},
    to: {
      id: "adr_a9f18135f50ab060",
      description: null,
      name: "JARON HEARD",
      company: null,
      phone: null,
      email: null,
      address_line1: "3340 SE MORRISON ST APT 388",
      address_line2: null,
      address_city: "PORTLAND",
      address_state: "OR",
      address_zip: "97214-3178",
      address_country: "UNITED STATES",
      metadata: {},
      date_created: "2023-08-19T18:43:57.398Z",
      date_modified: "2023-08-19T18:43:57.398Z",
      object: "address",
    },
    from: undefined,
    url: "https://lob-assets.com/postcards/psc_0287b0d8a796a827.pdf?version=v1&expires=1695062640&signature=aZ65aOhqqJa6t-MYVfUMRtE3VbAh9ukaXbx3GqrwkqVCaZFsAPaaVJtwfM1kqc5jHaDcbOcxnbQK8ybVQCrhAg",
    carrier: "USPS",
    tracking_events: [],
    thumbnails: [],
    merge_variables: null,
    size: "6x9",
    mail_type: "usps_first_class",
    expected_delivery_date: "2023-08-28",
    date_created: "2023-08-19T18:44:00.147Z",
    date_modified: "2023-08-19T18:44:00.147Z",
    send_date: "2023-08-19T18:48:59.888Z",
    object: "postcard",
  } as unknown as Postcard,
} satisfies PostcardSentProps;
export default PostcardSent;
