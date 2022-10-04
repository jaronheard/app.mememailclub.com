import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import {
  Configuration,
  AddressesApi,
  AddressEditable,
} from "@lob/lob-typescript-sdk";
import { env } from "../../env/server.mjs";

const config: Configuration = new Configuration({
  username: env.LOB_API_KEY,
});

export const lob = createRouter()
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next();
  })
  .mutation("createAddress", {
    input: z.object({
      name: z.string(),
      address_line1: z.string(),
      address_line2: z.string().optional(),
      address_city: z.string(),
      address_state: z.string(),
      address_zip: z.string(),
    }),
    async resolve({ ctx, input }) {
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
        // await ctx.prisma.item.create({
        //   data: {
        //     publicationId: input.publicationId,
        //     name: input.name,
        //     description: input.description,
        //     imageUrl: input.imageUrl,
        //     front: input.front,
        //     back: input.back,
        //     status: input.status,
        //   },
        // });
      } catch (error) {
        console.log(error);
      }
    },
  });
