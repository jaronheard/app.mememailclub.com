import React from "react";
import { Section } from "@react-email/components";
import Link from "./Link";
import Logo from "./Logo";
import Text from "./Text";
import { colors, fontSize, fontWeight } from "../theme";

const EMAIL_PREFERENCES_URL =
  "mailto:hi@postpostcard.com?subject=Unsubscribe";

type FooterProps = {
  includeUnsubscribe?: boolean;
};

export default function Footer({ includeUnsubscribe = false }: FooterProps) {
  return (
    <>
      <Section
        className="gutter"
        style={{
          backgroundColor: colors.yellow,
          paddingTop: 32,
          paddingBottom: 24,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: fontSize.xs,
            color: colors.gray400,
            fontWeight: fontWeight.bold,
            textTransform: "uppercase",
          }}
        >
          PostPostcard {new Date().getFullYear()}
        </Text>

        {includeUnsubscribe && (
          <Text
            style={{
              textAlign: "center",
              fontSize: fontSize.xs,
              color: colors.gray400,
              paddingTop: 12,
            }}
          >
            You&rsquo;re receiving this email because you asked for occasional
            updates about PostPostcard. If you don&rsquo;t want to receive these
            in the future, you can{" "}
            <Link
              href={EMAIL_PREFERENCES_URL}
              style={{
                color: colors.gray400,
                textDecoration: "underline",
              }}
            >
              unsubscribe.
            </Link>
          </Text>
        )}
      </Section>

      <Section
        style={{ backgroundColor: colors.yellow, paddingBottom: 40 }}
      >
        <Text style={{ textAlign: "center" }}>
          <Link
            href="https://postpostcard.com"
            style={{ textDecoration: "none" }}
          >
            <Logo />
          </Link>
        </Text>
      </Section>
    </>
  );
}
