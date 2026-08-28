# PostPostcard

Send real, physical postcards from the browser — [postpostcard.com](https://postpostcard.com). Built on the T3 stack (Next.js pages router + tRPC + Prisma).

## Stack

- [Next.js 15](https://nextjs.org) (pages router) with React 18
- [tRPC 11](https://trpc.io) + [TanStack Query 5](https://tanstack.com/query)
- [Prisma 6](https://prisma.io) against PlanetScale MySQL (`relationMode = "prisma"`)
- [Clerk 6](https://clerk.com) for auth (`clerkMiddleware`, all routes public by default)
- [Stripe](https://stripe.com) Checkout + webhooks for payment
- [Lob](https://lob.com) for postcard printing and mailing
- [Cloudinary](https://cloudinary.com) for image storage/transforms
- [Tailwind CSS 3](https://tailwindcss.com)
- [mailing](https://github.com/sofn-xyz/mailing) + MJML for transactional email
- Axiom (logging) and Fathom (analytics)

## Development

Requires Node 20+ (see `.nvmrc`). Copy env vars into `.env` (see `src/env/schema.mjs` for the required keys).

```bash
npm install        # also applies patches + generates Prisma client
npm run dev        # app on localhost:3000
npm run db         # PlanetScale proxy for the dev branch (port 3309)
npm run stripe     # forward Stripe webhook events to localhost
npm run mailing    # email template preview server
```

Checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Notes

- `patches/` pins fixes for `@heroicons/react@2.0.13` and `cloudinary-build-url@0.2.4`; keep those exact versions or drop the patches deliberately.
- The Stripe webhook (`src/pages/api/webhooks`) reads shipping details from both the current (`collected_information.shipping_details`) and legacy top-level payload shapes, so the webhook endpoint's pinned API version in the Stripe dashboard can be upgraded independently.
- Deploys on Vercel; `postbuild` generates the sitemap from `NEXT_PUBLIC_APP_URL`.
