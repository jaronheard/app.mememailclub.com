import { createRouter } from "./context";

export const tags = createRouter().query("getAllTagCategories", {
  async resolve({ ctx }) {
    const tagCategories = await ctx.prisma.tagCategory.findMany({
      include: {
        Tags: true,
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
  },
});
