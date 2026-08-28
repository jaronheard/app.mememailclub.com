import React from "react";
import { Text as REText } from "@react-email/components";
import { colors, fontFamily, fontSize, lineHeight } from "../theme";

type TextProps = {
  maxWidth?: number;
} & React.ComponentProps<typeof REText>;

export default function Text({ children, maxWidth, style, ...props }: TextProps) {
  const mergedStyle: React.CSSProperties = {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    color: colors.white,
    margin: 0,
    ...style,
  };
  return (
    <REText style={mergedStyle} {...props}>
      {maxWidth ? <div style={{ maxWidth }}>{children}</div> : children}
    </REText>
  );
}
