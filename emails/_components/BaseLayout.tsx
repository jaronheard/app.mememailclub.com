import React from "react";
import { Body, Container, Head, Html, Preview } from "@react-email/components";
import { colors, fontFamily, screens, spacing } from "../theme";

type BaseLayoutProps = {
  width?: number;
  style?: string;
  preheader?: string;
  children: React.ReactNode;
};

export default function BaseLayout({
  width = 600,
  children,
  preheader,
  style,
}: BaseLayoutProps) {
  return (
    <Html>
      <Head>
        <style>{`
          @import url("https://fonts.googleapis.com/css2?family=Sen:wght@400;700;800&display=swap");

          body {
            -webkit-font-smoothing: antialiased;
            min-width: 320px;
            margin: 0;
            background-color: ${colors.yellow};
          }
          a {
            color: inherit;
          }
          .gutter {
            padding-left: ${spacing.s7}px;
            padding-right: ${spacing.s7}px;
          }
          .no-wrap {
            white-space: nowrap;
          }

          /* Large screens */
          @media (min-width:${screens.xs}) {
            .gutter {
              padding-left: ${spacing.s9}px;
              padding-right: ${spacing.s9}px;
            }
          }

          /* Email specific Styles */
          ${style ?? ""}
        `}</style>
      </Head>
      {preheader && <Preview>{preheader}</Preview>}
      <Body
        style={{
          backgroundColor: colors.yellow,
          fontFamily: fontFamily.sans,
          margin: 0,
        }}
      >
        <Container width={width} style={{ maxWidth: `${width}px` }}>
          {children}
        </Container>
      </Body>
    </Html>
  );
}
