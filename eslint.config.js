import {dirname} from "path";
import {fileURLToPath} from "url";

import {FlatCompat} from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import onlyWarnPlugin from "eslint-plugin-only-warn";
import prettierPlugin from "eslint-plugin-prettier";
import sortDestructureKeysPlugin from "eslint-plugin-sort-destructure-keys";
import sortKeysFixPlugin from "eslint-plugin-sort-keys-fix";
import unusedImportsPlugin from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ),
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2025,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        project: "./tsconfig.json",
      },
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      import: importPlugin,
      "only-warn": onlyWarnPlugin,
      prettier: prettierPlugin,
      "sort-destructure-keys": sortDestructureKeysPlugin,
      "sort-keys-fix": sortKeysFixPlugin,
      "unused-imports": unusedImportsPlugin,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/newline-after-import": ["error", {count: 1}],
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        {
          alphabetize: {
            caseInsensitive: true,
            order: "asc",
          },
          groups: [
            "type",
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "unknown",
          ],
          "newlines-between": "always",
          pathGroups: [
            {
              group: "internal",
              pattern: "@/**",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["type"],
          warnOnUnassignedImports: true,
        },
      ],
      "no-console": "off",
      "no-unused-vars": "off",
      "object-curly-spacing": ["error", "never"],
      "padding-line-between-statements": ["warn", {blankLine: "always", next: "return", prev: "*"}],
      "prettier/prettier": "error",
      "sort-destructure-keys/sort-destructure-keys": "off",
      "sort-imports": [
        "error",
        {
          allowSeparatedGroups: true,
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        },
      ],
      "sort-keys": "off",
      "sort-keys-fix/sort-keys-fix": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "none",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
    settings: {
      "import/resolver": {
        node: true,
        typescript: true,
      },
    },
  },
  {
    files: ["*.config.js", "*.config.ts", "*.config.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    ignores: [
      "**/.temp/**",
      "**/.next/**",
      "**/.swc/**",
      "**/.turbo/**",
      "**/.cache/**",
      "**/.build/**",
      "**/.vercel/**",
      "**/.rollup.cache/**",
      "**/.rollup.cache",
      "**/.changeset/**",
      "**/.DS_Store",
      "**/dist/**",
      "**/build/**",
      "**/public/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/.contentlayer/",
      "**/__snapshots__/**",
      "**/pnpm-lock.yaml",
      "**/bun.lockb",
      "**/.source/**",
      "**/next-env.d.ts",
      "eslint.config.js",
      ".prettierrc",
      "next.config.js",
      "postcss.config.js",
      "tailwind.config.js",
      "remotion.config.ts",
    ],
  },
];