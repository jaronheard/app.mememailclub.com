// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { items } from "./items";
import { publications } from "./publications";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("items.", items)
  .merge("publications.", publications);

// export type definition of API
export type AppRouter = typeof appRouter;
