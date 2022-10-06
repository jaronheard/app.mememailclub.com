// src/pages/api/trpc/[trpc].ts
import * as Sentry from "@sentry/nextjs";
import { withSentry } from "@sentry/nextjs";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/router/context";
// export API handler
export default withSentry(
  createNextApiHandler({
    router: appRouter,
    createContext,
    onError: ({ path, error, type, ctx, input, req }) => {
      Sentry.captureException(error, {
        tags: {
          path,
          type,
        },
        user: {
          id: ctx?.session?.userId as string,
        },
        extra: {
          trpc: {
            path,
            type,
            error,
            ctx,
            input,
            req,
          },
        },
      });
    },
  })
);
