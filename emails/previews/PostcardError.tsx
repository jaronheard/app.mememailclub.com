import React from "react";
import PostcardError from "../PostcardError";

export function preview() {
  return (
    <PostcardError
      includeUnsubscribe
      postcardData={{
        to: "adr_5222955256184be3",
        size: "6x9",
        front:
          "https://res.cloudinary.com/jaronheard/image/upload/w_2775,h_1875/v1687555005/bluePixel_eklcos.jpg",
        back: "https://res.cloudinary.com/jaronheard/image/upload/q_auto,f_auto/c_fit,w_975,bo_30px_solid_white,x_150,b_white,g_west,l_text:Futura_36:This%2520postcard%2520should%2520redirect%2520to%2520188,fl_layer_apply/c_fit,w_332,h_380,x_75,y_75,g_north_east,l_postpostcard-stamp-qr_fxwrje/redPixel_peptry",
        quantity: 1,
      }}
    />
  );
}
