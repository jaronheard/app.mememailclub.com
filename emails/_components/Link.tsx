import React from "react";
import { Link as RELink } from "@react-email/components";
import { colors } from "../theme";

type LinkProps = React.ComponentProps<typeof RELink>;

export default function Link({ children, style, ...props }: LinkProps) {
  return (
    <RELink
      target="_blank"
      rel="noopener"
      style={{
        color: colors.indigo,
        textDecoration: "underline",
        ...style,
      }}
      {...props}
    >
      {children}
    </RELink>
  );
}
