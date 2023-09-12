import { z } from "zod";
import { createRouter } from "./context";
import {
  Configuration,
  AddressesApi,
  AddressEditable,
  PostcardEditable,
  PostcardsApi,
} from "@lob/lob-typescript-sdk";
import { env } from "../../env/server.mjs";
import { TRPCError } from "@trpc/server";
import { itemSizeToClient } from "../../utils/itemSize";
import { addTextTransformationToURL } from "../../components/Img";
import sendMail from "../../../emails";
import PostcardSent from "../../../emails/PostcardSent";
import PostcardError from "../../../emails/PostcardError";

const config: Configuration = new Configuration({
  username: env.LOB_API_KEY,
});

export const lob = createRouter()
  .mutation("createAddress", {
    input: z.object({
      name: z.string(),
      address_line1: z.string(),
      address_line2: z.string().optional(),
      address_city: z.string(),
      address_state: z.string(),
      address_zip: z.string(),
    }),
    async resolve({ input }) {
      const addressApi = new AddressesApi(config);
      const addressCreate = new AddressEditable({
        name: input.name,
        address_line1: input.address_line1,
        address_line2: input.address_line2,
        address_city: input.address_city,
        address_state: input.address_state,
        address_zip: input.address_zip,
      });
      const myAddress = await addressApi.create(addressCreate);
      const myAddressFromApi = await addressApi.get(myAddress.id);
      if (!myAddressFromApi) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Address not created from Lob API",
        });
      }
      return myAddressFromApi;
    },
  })
  .mutation("createPostcard", {
    input: z.object({
      addressId: z.string(),
      itemId: z.number(),
      quantity: z.number(),
      test: z.boolean().optional(),
      size: z.enum(["4x6", "6x9", "6x11"]),
      client_reference_id: z.string().optional(), // not here
      email: z.string(),
    }),
    async resolve({ ctx, input }) {
      const message = input.client_reference_id
        ? await ctx.prisma.message.findUnique({
            where: {
              // use client_reference_id to find message as integer
              id: parseInt(input.client_reference_id),
            },
          })
        : null;

      const item = await ctx.prisma.item.findUnique({
        where: {
          id: input.itemId,
        },
        select: {
          front: true,
          back: true,
          size: true,
        },
      });
      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not found",
        });
      }

      const backWithText = message
        ? addTextTransformationToURL({
            src: item.back,
            text: message.message,
            size: itemSizeToClient(item.size),
          })
        : item.back;

      console.log("backWithText", backWithText);

      const postcardCreate = new PostcardEditable({
        to: input.addressId,
        front: item.front,
        back: backWithText,
        size: itemSizeToClient(item.size),
        // set to send date in 5 minutes
        // send_date: new Date(Date.now() + 5 * 60000).toISOString(),
        quantity: input.quantity,
      });
      const myPostcard = await new PostcardsApi(config).create(postcardCreate);
      if (!myPostcard) {
        await sendMail({
          to: "hi@postpostcard.com",
          subject: "Test Postcard Error Email",
          component: (
            <PostcardError
              postcardData={{
                to: input.addressId,
                front: item.front,
                back: backWithText,
                size: itemSizeToClient(item.size),
                // set to send date in 5 minutes
                // send_date: new Date(Date.now() + 5 * 60000).toISOString(),
                quantity: input.quantity,
              }}
            />
          ),
        });
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Postcard not created from Lob API",
        });
      }
      await sendMail({
        to: input.email,
        component: <PostcardSent postcard={myPostcard} />,
      });
      return myPostcard;
    },
  });
