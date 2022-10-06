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

const config: Configuration = new Configuration({
  username: env.LOB_API_KEY,
});

export const lob = createRouter()
  // .middleware(async ({ ctx, next }) => {
  //   // Any queries or mutations after this middleware will
  //   // raise an error unless there is a current session
  //   if (!ctx.session) {
  //     throw new TRPCError({ code: "UNAUTHORIZED" });
  //   }
  //   return next();
  // })
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
      try {
        const myAddress = await addressApi.create(addressCreate);
        const myAddressFromApi = await addressApi.get(myAddress.id);
        console.log("myAddressFromApi", myAddressFromApi);
        return myAddressFromApi;
      } catch (error) {
        console.log(error);
      }
    },
  })
  .mutation("createPostcard", {
    input: z.object({
      addressId: z.string(),
      itemId: z.number(),
      quantity: z.number(),
    }),
    async resolve({ ctx, input }) {
      try {
        const item = await ctx.prisma.item.findUnique({
          where: {
            id: input.itemId,
          },
          select: {
            front: true,
            back: true,
          },
        });
        const postcardCreate = new PostcardEditable({
          to: input.addressId,
          front: item?.front || "",
          back: item?.back || "",
          size: "4x6",
          // set to send date in 5 minutes
          // send_date: new Date(Date.now() + 5 * 60000).toISOString(),
          quantity: input.quantity,
        });
        const myPostcard = await new PostcardsApi(config).create(
          postcardCreate
        );
        console.log(`🔔 Postcard created: ${myPostcard.id}`);
      } catch (error) {
        console.log(error);
      }
    },
  });
