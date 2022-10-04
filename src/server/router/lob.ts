import { TRPCError } from "@trpc/server";
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
  })
  .mutation("createPostcard", {
    input: z.object({
      addressId: z.string(),
      itemId: z.number(),
    }),
    async resolve({ ctx, input }) {
      const postcardCreate = new PostcardEditable({
        to: input.addressId,
        front:
          "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/templates/4x6_pc_template.pdf",
        back: "https://s3-us-west-2.amazonaws.com/public.lob.com/assets/templates/4x6_pc_template.pdf",
      });
      try {
        const item = await ctx.prisma.item.findUnique({
          where: {
            id: input.itemId,
          },
          select: {
            name: true,
            description: true,
            front: true,
            back: true,
            publication: {
              select: {
                name: true,
                description: true,
                imageUrl: true,
                author: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
                authorId: true,
              },
            },
          },
        });
        console.log("item", item);
        const myPostcard = await new PostcardsApi(config).create(
          postcardCreate
        );
        console.log("myPostcard", myPostcard);
      } catch (error) {
        console.log(error);
      }
    },
  });
