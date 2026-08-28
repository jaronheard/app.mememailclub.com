import { query } from "./_generated/server";
import { shapeTag, type TagCategoryWithTags } from "./lib/model";

/**
 * Prisma equivalent:
 *   where:   { Tags: { some: {} } }            // category has >= 1 tag
 *   include: { Tags: { where: { Items: { some: {} } } } }  // tag has >= 1 item
 *
 * Convex cannot index into `items.tagIds`, so tag usage is computed by
 * scanning the items table. That table is small; revisit if it grows.
 */
export const getAllTagCategories = query({
  args: {},
  handler: async (ctx): Promise<TagCategoryWithTags[]> => {
    const [tagCategories, tags, items] = await Promise.all([
      ctx.db.query("tagCategories").collect(),
      ctx.db.query("tags").collect(),
      ctx.db.query("items").collect(),
    ]);

    const usedTagIds = new Set<string>();
    for (const item of items) {
      for (const tagId of item.tagIds) usedTagIds.add(tagId);
    }

    const categoryLegacyIdById = new Map(
      tagCategories.map((c) => [c._id as string, c.legacyId])
    );

    return tagCategories
      .map((category) => {
        const categoryTags = tags.filter(
          (tag) => tag.tagCategoryId === category._id
        );
        return {
          ...category,
          id: category.legacyId,
          // keep only tags that are attached to at least one item
          Tags: categoryTags
            .filter((tag) => usedTagIds.has(tag._id))
            .map((tag) =>
              shapeTag(
                tag,
                tag.tagCategoryId
                  ? (categoryLegacyIdById.get(tag.tagCategoryId) ?? null)
                  : null
              )
            ),
          // categories with no tags at all are dropped below
          _hasAnyTag: categoryTags.length > 0,
        };
      })
      .filter((category) => category._hasAnyTag)
      .map(({ _hasAnyTag, ...category }) => {
        void _hasAnyTag;
        return category;
      });
  },
});
