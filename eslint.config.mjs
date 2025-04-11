import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import-x";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";
// We are using eslint-config-mourner to be consistent with the Leaflet project:
// https://github.com/Leaflet/Leaflet/blob/main/eslint.config.js
import config from "eslint-config-mourner";

export default defineConfig([
  config,
  eslintConfigPrettier,
  {
    files: ["*.js", "*.cjs"],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
    },
  },
  {
    ignores: ["dist", "coverage"],
  },
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "dot-notation": "off",
      "consistent-return": "off",
      curly: "error",
      "no-unused-expressions": ["error", { allowShortCircuit: true }],
      "no-unused-vars": ["error", { caughtErrors: "none" }],

      "import/extensions": ["error", "ignorePackages"],

      "@stylistic/js/indent": [
        "error",
        "tab",
        { VariableDeclarator: 0, flatTernaryExpressions: true },
      ],
      "@stylistic/js/no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
      "@stylistic/js/key-spacing": "off",
      "@stylistic/js/linebreak-style": ["off", "unix"],
      "@stylistic/js/spaced-comment": "error",

      // TODO: Re-enable the rules below and fix the linting issues.
      "no-invalid-this": "off",
      "prefer-object-has-own": "error",
      "prefer-spread": "off",
      "no-new": "off",
    },
  },
  {
    files: ["spec/**"],
    languageOptions: {
      globals: { ...globals.mocha, expect: "readable", L: "writeable" },
    },
    rules: {
      "no-unused-expressions": "off",
    },
  },
]);
