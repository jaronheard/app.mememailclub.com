import React from "react";
import { Section } from "@react-email/components";
import Link from "./Link";
import Logo from "./Logo";
import Text from "./Text";
import { colors } from "../theme";

export default function Header() {
  return (
    <Section
      className="gutter"
      style={{
        backgroundColor: colors.yellow,
        paddingTop: 40,
        paddingBottom: 64,
      }}
    >
      <Text style={{ textAlign: "left" }}>
        <Link
          href="https://postpostcard.com"
          style={{ textDecoration: "none" }}
        >
          <Logo />
        </Link>
      </Text>
    </Section>
  );
}
