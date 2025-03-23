import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,vue}"], // Apply to JavaScript, Vue, and module files
    languageOptions: {
      globals: {
        ...globals.browser, // Include browser-specific globals
        ...globals.node, // Include Node.js-specific globals
        ...globals.es2021, // Include modern JavaScript globals (ES2021)
        vi: "readonly", // Add `vi` for Vitest-specific testing
        describe: "readonly", // Add `describe` for testing frameworks
        it: "readonly", // Add `it` for testing frameworks
        expect: "readonly", // Add `expect` for testing frameworks
        beforeEach: "readonly", // Add `beforeEach` for Vitest
        test: "readonly", // Add `test` for Vitest
      },
    },
  },
  pluginJs.configs.recommended, // Use recommended JavaScript rules
  ...pluginVue.configs["flat/essential"], // Use essential Vue rules
  {
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Warn for unused variables except those starting with `_`
      "no-undef": "error", // Error on undefined variables
      "vue/multi-word-component-names": "off", // Allow single-word Vue component names
    },
  },
];
