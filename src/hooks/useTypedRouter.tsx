import { useRouter } from "next/router";
import { z } from "zod";

// Usage
// The routerSchema uses the coerce feature from Zod to transform the type of our query string, here boolean and number.

// const routerSchema = z.object({
//   someText: z.coerce.string().optional(),
//   someNumber: z.coerce.number().optional(),
//   someBool: z.coerce.boolean().optional()
// });

// export default () => {
//   const { query } = useTypedRouter(routerSchema);

//   return (
//     <div>
//       ...
//     </div>
//   )
// }


const useTypedRouter = <T extends z.Schema>(schema: T) => {
  const { query, ...router } = useRouter();

  return {
    query: schema.parse(query) as z.infer<typeof schema>,
    ...router,
  };
};

export default useTypedRouter;
