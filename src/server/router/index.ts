// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { itemRouter } from "./item";
import { publicationRouter } from "./publication";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("item.", itemRouter)
  .merge("publication.", publicationRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
