import { publicProcedure, router } from "./context";

export const tags = router({
  getAllTagCategories: publicProcedure.query(async ({ ctx }) => {
    const tagCategories = await ctx.prisma.tagCategory.findMany({
      include: {
        Tags: {
          where: {
            Items: {
              some: {
                id: {
                  not: undefined,
                },
              },
            },
          },
        },
      },
      where: {
        Tags: {
          some: {
            id: {
              not: undefined,
            },
          },
        },
      },
    });
    return tagCategories;
  }),
});
