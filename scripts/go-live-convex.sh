#!/bin/bash
# One-time production provisioning for the Convex migration.
# Run from the worktree root. Does four things:
#   1. Deploys convex/ to the production deployment (creates it if needed)
#   2. Copies STRIPE_SECRET_KEY, LOB_API_KEY, POSTMARK_API_KEY from Vercel's
#      production env to the Convex prod deployment (values never printed)
#   3. Sets CLERK_JWT_ISSUER_DOMAIN + NEXT_PUBLIC_APP_URL on Convex prod
#   4. Creates the "convex" JWT template on the LIVE Clerk instance
set -euo pipefail

echo "==> 1/4 convex deploy"
npx convex deploy --yes

echo "==> 2/4 pulling Vercel production env (to a temp file, deleted after)"
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
npx vercel env pull "$TMP" --environment=production --yes >/dev/null

node - "$TMP" <<'EOF'
const fs = require("fs"), { execFileSync } = require("child_process");
const env = {};
for (const line of fs.readFileSync(process.argv[2], "utf8").split("\n")) {
  const m = line.match(/^([A-Z_]+)\s*=\s*"?([^"\n]+)"?\s*$/);
  if (m) env[m[1]] = m[2];
}
for (const k of ["STRIPE_SECRET_KEY", "LOB_API_KEY", "POSTMARK_API_KEY"]) {
  if (!env[k]) { console.log(k, ": MISSING in Vercel prod env — set it manually"); continue; }
  execFileSync("npx", ["convex", "env", "set", "--prod", k, env[k]], { stdio: ["ignore", "ignore", "inherit"] });
  console.log(k, ": set on Convex prod");
}

console.log("==> 3/4 issuer + app url");
const pk = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
const tail = pk.split("_").slice(2).join("_");
const domain = Buffer.from(tail + "=".repeat((4 - (tail.length % 4)) % 4), "base64").toString().replace(/\$$/, "");
const issuer = "https://" + domain;
console.log("issuer:", issuer, pk.startsWith("pk_live_") ? "(live)" : "(NOT LIVE — check!)");
execFileSync("npx", ["convex", "env", "set", "--prod", "CLERK_JWT_ISSUER_DOMAIN", issuer], { stdio: ["ignore", "ignore", "inherit"] });
execFileSync("npx", ["convex", "env", "set", "--prod", "NEXT_PUBLIC_APP_URL", env.NEXT_PUBLIC_APP_URL || "https://www.postpostcard.com"], { stdio: ["ignore", "ignore", "inherit"] });

console.log("==> 4/4 Clerk live JWT template");
const sk = env.CLERK_SECRET_KEY;
if (!sk) { console.log("CLERK_SECRET_KEY missing in Vercel prod env — create the template in the Clerk dashboard instead"); process.exit(0); }
fetch("https://api.clerk.com/v1/jwt_templates", {
  method: "POST",
  headers: { Authorization: `Bearer ${sk}`, "Content-Type": "application/json" },
  body: JSON.stringify({ name: "convex", claims: { aud: "convex" }, lifetime: 3600 }),
}).then(async (r) => {
  const body = await r.json();
  if (r.ok) console.log("created live JWT template:", body.id);
  else if (r.status === 422) console.log("template likely already exists:", JSON.stringify(body.errors ?? "").slice(0, 150));
  else console.log("Clerk API status", r.status, JSON.stringify(body.errors ?? "").slice(0, 200));
});
EOF

echo "==> done. Tell Claude to finish (prod data import + Vercel env + redeploy)."
