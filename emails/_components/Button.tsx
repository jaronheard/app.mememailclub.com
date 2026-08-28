import React from "react";
import { Button as REButton } from "@react-email/components";
import {
  borderRadius,
  colors,
  fontSize,
  fontWeight,
  lineHeight,
} from "../theme";

type ButtonProps = React.ComponentProps<typeof REButton>;

export default function Button({ style, ...props }: ButtonProps) {
  return (
    <REButton
      style={{
        backgroundColor: colors.indigo,
        color: colors.white,
        fontSize: fontSize.base,
        fontWeight: fontWeight.bold,
        lineHeight: lineHeight.tight,
        borderRadius: `${borderRadius.base}px`,
        padding: "16px 24px 18px",
        textDecoration: "none",
        display: "inline-block",
        ...style,
      }}
      {...props}
    />
  );
}
