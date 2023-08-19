import React from "react";
import {
  Mjml,
  MjmlBody,
  MjmlHead,
  MjmlFont,
  MjmlStyle,
  MjmlAttributes,
  MjmlAll,
  MjmlPreview,
} from "@faire/mjml-react";
import {
  screens,
  themeDefaults,
  spacing,
  colors,
  fontFamily,
  fontSize,
  borderRadius,
} from "../theme";

type BaseLayoutProps = {
  width?: number;
  style?: string;
  preheader?: string;
  children: React.ReactNode;
};

export default function BaseLayout({
  width,
  children,
  preheader,
  style,
}: BaseLayoutProps) {
  return (
    <Mjml>
      <MjmlHead>
        <MjmlFont
          name="Sen"
          href="https://fonts.googleapis.com/css2?family=Sen:wght@400;700;800&display=swap"
        />
        <MjmlAttributes>
          <MjmlAll {...themeDefaults} />
        </MjmlAttributes>
        <MjmlStyle>{`
          body {
            -webkit-font-smoothing: antialiased;
            min-width: 320px;
            background-color: ${colors.yellow};
          }
          a {
            color: inherit
          }
          .gutter {
            padding-left: ${spacing.s7}px;
            padding-right: ${spacing.s7}px;
          }
          .code {
            font-family: ${fontFamily.mono};
            color: ${colors.black};
            background-color: ${colors.postcard};
            font-size: ${fontSize.sm}px;
            border-radius: ${borderRadius.sm}px;
            padding: ${spacing.s1}px ${spacing.s3}px;
          }
          .no-wrap {
            white-space: nowrap;
          }
          .hidden {
            display: none;
            max-width: 0px;
            max-height: 0px;
            overflow: hidden;
            mso-hide: all;
          }
          .lg-hidden {
            display: none;
            max-width: 0px;
            max-height: 0px;
            overflow: hidden;
            mso-hide: all;
          }

          /* Large screens */
          @media (min-width:${screens.xs}) {
            .gutter {
              padding-left: ${spacing.s9}px;
              padding-right: ${spacing.s9}px;
            }
            .sm-hidden {
              display: none;
              max-width: 0px;
              max-height: 0px;
              overflow: hidden;
              mso-hide: all;
            }
            .lg-hidden {
              display: block !important;
              max-width: none !important;
              max-height: none !important;
              overflow: visible !important;
              mso-hide: none !important;
            }
          }

          /* Email specific Styles */
          ${style}
      `}</MjmlStyle>
        {preheader && <MjmlPreview>{preheader}</MjmlPreview>}
      </MjmlHead>

      <MjmlBody width={width}>{children}</MjmlBody>
    </Mjml>
  );
}
