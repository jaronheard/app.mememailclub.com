// src/server/router/index.ts
import { router } from "./context";
import { items } from "./items";
import { publications } from "./publications";
import { lob } from "./lob";
import { messages } from "./messages";
import { users } from "./users";
import { tags } from "./tags";

export const appRouter = router({
  items,
  publications,
  messages,
  lob,
  users,
  tags,
});

// export type definition of API
export type AppRouter = typeof appRouter;
