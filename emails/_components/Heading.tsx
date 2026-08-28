import React from "react";
import Text from "./Text";
import { fontFamily, fontSize, fontWeight, lineHeight } from "../theme";

type HeadingProps = React.ComponentProps<typeof Text>;

export default function Heading({ style, ...props }: HeadingProps) {
  return (
    <Text
      style={{
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.bold,
        lineHeight: lineHeight.tight,
        fontSize: fontSize.xl,
        ...style,
      }}
      {...props}
    >
      {props.children}
    </Text>
  );
}
