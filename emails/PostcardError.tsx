import React from "react";
import { Section } from "@react-email/components";
import BaseLayout from "./_components/BaseLayout";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Heading from "./_components/Heading";
import Link from "./_components/Link";
import Text from "./_components/Text";
import { colors, fontFamily, spacing } from "./theme";

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
      <Section
        className="gutter"
        style={{
          backgroundColor: colors.postcard,
          paddingTop: spacing.s11,
          paddingBottom: spacing.s11,
        }}
      >
        <Heading maxWidth={420} style={{ color: colors.black }}>
          ⚠️ A postcard has errored!
        </Heading>
        {postcardData && (
          <>
            <Text style={{ color: colors.black }}>
              This postcard errored when it was sent to Lob.
            </Text>
            <Text style={{ color: colors.black, paddingTop: spacing.s8 }}>
              <Link
                href={`https://dashboard.lob.com/addresses/${postcardData.to}`}
              >
                {postcardData.to}
              </Link>
            </Text>
            <Text style={{ color: colors.black }}>
              <Link href={postcardData.front}>Front</Link>
            </Text>
            <Text style={{ color: colors.black }}>
              <Link href={postcardData.back}>Back</Link>
            </Text>
            <Text style={{ color: colors.black, paddingTop: spacing.s8 }}>
              <Link href="https://dashboard.lob.com/logs?status_code%5B0%5D=401&status_code%5B1%5D=403&status_code%5B2%5D=404&status_code%5B3%5D=422&status_code%5B4%5D=429&status_code%5B5%5D=500">
                View Lob Logs
              </Link>
            </Text>
          </>
        )}
        {!postcardData && (
          <>
            <Text style={{ color: colors.black }}>
              This error occurred before the postcard was sent to Lob.
            </Text>
            <Text
              style={{
                color: colors.black,
                fontFamily: fontFamily.mono,
                paddingTop: spacing.s8,
              }}
            >
              {error}
            </Text>
          </>
        )}
      </Section>
      <Section style={{ paddingBottom: spacing.s11 }} />
      <Footer includeUnsubscribe={includeUnsubscribe} />
    </BaseLayout>
  );
};
PostcardError.subject = `⚠️ A postcard has errored!`;
PostcardError.PreviewProps = {
  includeUnsubscribe: true,
  postcardData: {
    to: "adr_5222955256184be3",
    size: "6x9",
    front:
      "https://res.cloudinary.com/jaronheard/image/upload/w_2775,h_1875/v1687555005/bluePixel_eklcos.jpg",
    back: "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/c_fit,w_975,bo_30px_solid_white,x_150,b_white,g_west,l_text:Futura_36:This%2520postcard%2520should%2520redirect%2520to%2520188,fl_layer_apply/c_fit,w_332,h_380,x_75,y_75,g_north_east,l_postpostcard-stamp-qr_fxwrje/redPixel_peptry",
    quantity: 1,
  },
} satisfies PostcardErrorProps;
export default PostcardError;
