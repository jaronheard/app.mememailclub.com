import React from "react";
import {
  MjmlSection,
  MjmlWrapper,
  MjmlColumn,
  MjmlText,
  MjmlImage,
} from "@faire/mjml-react";
import Link from "./Link";
import { colors, fontSize, fontWeight } from "../theme";
import { EMAIL_PREFERENCES_URL } from "mailing-core";

type FooterProps = {
  includeUnsubscribe?: boolean;
};

export default function Footer({ includeUnsubscribe = false }: FooterProps) {
  return (
    <>
      <MjmlWrapper backgroundColor={colors.postcard}>
        <MjmlSection paddingTop={32} paddingBottom={24} cssClass="gutter">
          <MjmlColumn>
            <MjmlText
              align="center"
              fontSize={fontSize.xs}
              color={colors.gray400}
              fontWeight={fontWeight.bold}
              textTransform="uppercase"
            >
              PostPostcard {new Date().getFullYear()}
            </MjmlText>

            {includeUnsubscribe && (
              <MjmlText
                align="center"
                fontSize={fontSize.xs}
                color={colors.gray400}
                paddingTop={12}
              >
                You&rsquo;re receiving this email because you asked for
                occasional updates about PostPostcard. If you don&rsquo;t want
                to receive these in the future, you can{" "}
                <Link
                  color={colors.gray400}
                  textDecoration="underline"
                  href={EMAIL_PREFERENCES_URL}
                >
                  unsubscribe.
                </Link>
              </MjmlText>
            )}
          </MjmlColumn>
        </MjmlSection>

        <MjmlSection paddingBottom={40}>
          <MjmlColumn>
            <MjmlImage
              height={16}
              width={13}
              src={"https://mailing.run/welcome-template/logo.png"}
              href="https://postpostcard.com"
            />
          </MjmlColumn>
        </MjmlSection>
      </MjmlWrapper>
    </>
  );
}
