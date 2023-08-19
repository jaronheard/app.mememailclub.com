import React from "react";
import {
  MjmlColumn,
  MjmlGroup,
  MjmlSection,
  MjmlWrapper,
} from "@faire/mjml-react";
import Text from "./Text";
import Link from "./Link";
import { colors, fontSize, lineHeight, fontWeight } from "../theme";

export default function Header() {
  return (
    <MjmlWrapper padding="40px 0 64px" backgroundColor={colors.yellow}>
      <MjmlSection cssClass="gutter">
        <MjmlGroup>
          <MjmlColumn width="42%">
            <Text align="left">
              <Link
                color={colors.white}
                fontSize={fontSize.xl}
                fontWeight={fontWeight.bold}
                href="https://postpostcard.com"
                textDecoration="none"
              >
                <svg
                  width="26"
                  height="37"
                  className="block h-8 w-auto"
                  viewBox="0 0 26 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_112_3"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="26"
                    height="37"
                  >
                    <path
                      d="M15.4688 0.390625C17.25 0.390625 18.9219 0.84375 20.4844 1.75C22.0781 2.65625 23.3594 4.04688 24.3281 5.92188C25.2969 7.79688 25.7812 10.1875 25.7812 13.0938C25.7812 15.7812 25.2812 18.0625 24.2812 19.9375C23.3125 21.8125 22 23.25 20.3438 24.25C18.7188 25.2188 16.9375 25.7031 15 25.7031C13.75 25.7031 12.5156 25.4375 11.2969 24.9062C10.1094 24.3438 9.125 23.6406 8.34375 22.7969V36.25H0.28125V1.09375H8.34375V5.07812C8.9375 3.76562 9.84375 2.65625 11.0625 1.75C12.2812 0.84375 13.75 0.390625 15.4688 0.390625ZM13.0781 8.54688C12.4219 8.54688 11.7188 8.73438 10.9688 9.10938C10.25 9.45312 9.625 10 9.09375 10.75C8.59375 11.4688 8.34375 12.4062 8.34375 13.5625V15.8594C9.0625 16.4219 9.84375 16.8906 10.6875 17.2656C11.5625 17.6406 12.4375 17.8281 13.3125 17.8281C14.5 17.8281 15.4688 17.3594 16.2188 16.4219C16.9688 15.4531 17.3438 14.3438 17.3438 13.0938C17.3438 11.8125 16.9531 10.7344 16.1719 9.85938C15.3906 8.98438 14.3594 8.54688 13.0781 8.54688Z"
                      fill="black"
                    />
                  </mask>
                  <g mask="url(#mask0_112_3)">
                    <path d="M18 27V14.4V13H9V27H18Z" fill="#FC5825" />
                    <path d="M8 36V3.6V0H-1V36H8Z" fill="#120F0C" />
                    <path d="M18 13V-0.5V-2H9V13H18Z" fill="#2385F8" />
                    <path d="M26 27V14.4V13H18V27H26Z" fill="#FE0760" />
                    <path d="M26 13V-0.5V-2H18V13H26Z" fill="#5520F8" />
                  </g>
                </svg>
              </Link>
            </Text>
          </MjmlColumn>
          <MjmlColumn width="58%"></MjmlColumn>
        </MjmlGroup>
      </MjmlSection>
    </MjmlWrapper>
  );
}
