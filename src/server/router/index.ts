// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { items } from "./items";
import { publications } from "./publications";
import { lob } from "./lob";
import { messages } from "./messages";
import { users } from "./users";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("items.", items)
  .merge("publications.", publications)
  .merge("messages.", messages)
  .merge("lob.", lob)
  .merge("users.", users);

// export type definition of API
export type AppRouter = typeof appRouter;
