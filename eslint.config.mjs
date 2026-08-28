import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "public/**",
      "next-env.d.ts",
      "patches/**",
      "*.config.js",
      "*.config.cjs",
      "*.config.mjs",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
  ...tsPlugin.configs["flat/recommended"],
  {
    // Parity with the previous setup: @typescript-eslint v5 "recommended"
    // reported these as warnings, v8 upgraded them to errors.
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
