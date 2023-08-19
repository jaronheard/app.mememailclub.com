import React from "react";
import PostcardSent from "../PostcardSent";
import {
  AddressObjectEnum,
  CountryExtendedExpanded,
  MailType,
  Postcard,
  PostcardCarrierEnum,
  PostcardObjectEnum,
  PostcardSize,
} from "@lob/lob-typescript-sdk";

export function preview() {
  return (
    <PostcardSent
      includeUnsubscribe
      postcard={
        {
          id: "psc_0287b0d8a796a827",
          description: null,
          metadata: {},
          to: {
            id: "adr_a9f18135f50ab060",
            description: null,
            name: "JARON HEARD",
            company: null,
            phone: null,
            email: null,
            address_line1: "3340 SE MORRISON ST APT 388",
            address_line2: null,
            address_city: "PORTLAND",
            address_state: "OR",
            address_zip: "97214-3178",
            address_country: "UNITED STATES" as CountryExtendedExpanded,
            metadata: {},
            date_created: "2023-08-19T18:43:57.398Z",
            date_modified: "2023-08-19T18:43:57.398Z",
            object: "address" as AddressObjectEnum,
            toJSON: () => {
              return {};
            },
          },
          from: undefined,
          url: "https://lob-assets.com/postcards/psc_0287b0d8a796a827.pdf?version=v1&expires=1695062640&signature=aZ65aOhqqJa6t-MYVfUMRtE3VbAh9ukaXbx3GqrwkqVCaZFsAPaaVJtwfM1kqc5jHaDcbOcxnbQK8ybVQCrhAg",
          front_template_id: null,
          front_template_version_id: null,
          back_template_id: null,
          back_template_version_id: null,
          carrier: "USPS" as PostcardCarrierEnum,
          tracking_events: [],
          thumbnails: [
            {
              small:
                "https://lob-assets.com/postcards/psc_0287b0d8a796a827_thumb_small_1.png?version=v1&expires=1695062640&signature=e0HWWf2mNRAzljNzL3HAS6DIUx6nJBqdN9oJYOayXsFmef5u3aP8J-gS-mc0PSLdLquz3TP-LGptQZFLCGsCDg",
              medium:
                "https://lob-assets.com/postcards/psc_0287b0d8a796a827_thumb_medium_1.png?version=v1&expires=1695062640&signature=XphyUGFsCg86nkjDIwLGeCKjkB_kmUfSKzCG_2H1PYNWJ1G6GuIn_MyeeX51CzeIVyOaoXQL6mkhHozEXq9CCA",
              large:
                "https://lob-assets.com/postcards/psc_0287b0d8a796a827_thumb_large_1.png?version=v1&expires=1695062640&signature=kwwHuIe9rCUJpE0iu-PGFw1KKdX9m9-jzkPy7rEswkEcm2kMIBPUifwR8qZiEsNsvyRhUDaHmaxfDE8jJLaWDw",
              toJSON: () => {
                return {};
              },
            },
            {
              small:
                "https://lob-assets.com/postcards/psc_0287b0d8a796a827_thumb_small_2.png?version=v1&expires=1695062640&signature=imeHn31NSVa5nUgQSYLlW4mdogTPWdrDsjkcJCrMkqnCBnpVXHOcPPT5OvGj9Q0pAdOaeySUHuWr0ZciDFC-Dw",
              medium:
                "https://lob-assets.com/postcards/psc_0287b0d8a796a827_thumb_medium_2.png?version=v1&expires=1695062640&signature=8fSe7G1HGjyO_IELrv_4Ak8rTB-3tHhHfyhEVFNzJf2aTIdFjlv31DyUntVog1oBeaI9LpqE17ElLIRepm6rDg",
              large:
                "https://lob-assets.com/postcards/psc_0287b0d8a796a827_thumb_large_2.png?version=v1&expires=1695062640&signature=mloCSTQ1YmyEpiKuYltUajxrAniMrFW3J4-EdnA_czvheuxSUr7biGbANf4un5Tw1JxG7zlFd6qOK4J72rgjAQ",
              toJSON: () => {
                return {};
              },
            },
          ],
          merge_variables: null,
          size: "6x9" as PostcardSize,
          mail_type: "usps_first_class" as MailType,
          expected_delivery_date: "2023-08-28",
          date_created: "2023-08-19T18:44:00.147Z",
          date_modified: "2023-08-19T18:44:00.147Z",
          send_date: "2023-08-19T18:48:59.888Z",
          object: "postcard" as PostcardObjectEnum,
          toJSON: () => {
            return {};
          },
        } as unknown as Postcard
      }
    />
  );
}
