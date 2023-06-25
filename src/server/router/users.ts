import { nanoid } from "nanoid";
import { createRouter } from "./context";

export const users = createRouter().query("getUniqueUserId", {
  async resolve() {
    // generate using nanoid
    const uniqueId = `anonymous-${nanoid()}`;
    return uniqueId;
  },
});
