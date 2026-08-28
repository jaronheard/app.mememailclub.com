import { nanoid } from "nanoid";
import { publicProcedure, router } from "./context";

export const users = router({
  getUniqueUserId: publicProcedure.query(async () => {
    // generate using nanoid
    const uniqueId = `anonymous-${nanoid()}`;
    return uniqueId;
  }),
});
