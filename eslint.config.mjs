import { fixupPluginRules } from "@eslint/compat"
import eslintPluginPrettierRecommended from "eslint-config-prettier"
import importPlugin from "eslint-plugin-import"
// import next from "eslint-config-next"
import jest from "eslint-plugin-jest"
import jestDom from "eslint-plugin-jest-dom"
import jsxA11y from "eslint-plugin-jsx-a11y"
import promise from "eslint-plugin-promise"
import react from "eslint-plugin-react"
import reacthooks from "eslint-plugin-react-hooks"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import sonarjs from "eslint-plugin-sonarjs"
import testingLibrary from "eslint-plugin-testing-library"
import eslintPluginUnicorn from "eslint-plugin-unicorn"
import tseslint from "typescript-eslint"

export default [
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  // next.configs.recommended,
  // eslintPluginUnicorn.configs["flat/recommended"],
  {
    ignores: ["coverage", "node_modules", ".next", "eslint.config.mjs"],
  },
  /*
   * typescript-eslint
   */
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2019,
        project: ["./tsconfig.json"],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "typescript-eslint": tseslint,
    },
    rules: {
      ...importPlugin.configs.typescript.rules,
      "no-case-declarations": "off",
      eqeqeq: "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "off", // TODO: change this to warn when ready
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-floating-promises": "off",
    },
    settings: {
      ...importPlugin.configs.typescript.settings,
      "import/resolver": {
        ...importPlugin.configs.typescript.settings["import/resolver"],
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  /*
   * eslint-plugin-import
   */
  {
    plugins: {
      import: fixupPluginRules(importPlugin),
    },
    rules: {
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
    },
  },
  /*
   * eslint-plugin-simple-import-sort
   */
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
    },
  },
  /*
   * eslint-plugin-react
   */
  {
    plugins: {
      react: fixupPluginRules(react),
    },
    rules: {
      "react/prop-types": "warn",
      "react/no-unescaped-entities": "off",
    },
    settings: {
      react: {
        createClass: "createReactClass", // Regex for Component Factory to use,
        pragma: "React", // Pragma to use, default to "React"
        fragment: "Fragment", // Fragment to use (may be a property of <pragma>), default to "Fragment"
        version: "detect", // React version. "detect" automatically picks the version you have installed.
        // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
        // It will default to "latest" and warn if missing, and to "detect" in the future
        flowVersion: "0.53", // Flow version
      },
    },
  },
  /*
   * eslint-plugin-react-hooks
   */
  {
    plugins: {
      "react-hooks": fixupPluginRules(reacthooks),
    },
    rules: {
      ...reacthooks.configs.recommended.rules,
    },
  },
  /*
   * eslint-plugin-sonarjs
   */
  {
    plugins: {
      sonarjs: fixupPluginRules(sonarjs),
    },
    rules: {
      ...sonarjs.configs.recommended.rules,
      "sonarjs/no-duplicate-string": "off",
      "sonarjs/pseudo-random": "off",
      "sonarjs/void-use": "off",
    },
  },
  /**
   * eslint-plugin-unicorn
   **/
  {
    plugins: {
      unicorn: eslintPluginUnicorn,
    },
    rules: {
      "unicorn/filename-case": "off",
      "unicorn/no-null": "off",
      "unicorn/no-useless-undefined": "off",
      "unicorn/prefer-module": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-empty-file": "off",
      "unicorn/catch-error-name": "off",
      "unicorn/consistent-function-scoping": "off",
      "unicorn/no-array-for-each": "off",
      // TODO: Remove this when ready
      "unicorn/prefer-logical-operator-over-ternary": "off",
      "unicorn/no-nested-ternary": "off",
    },
  },
  /*
   * eslint-config-prettier
   */
  {},
  /*
   * eslint-plugin-jsx-a11y
   */
  {
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/media-has-caption": "off",
    },
  },
  /*
   * eslint-plugin-promise
   */
  {
    plugins: {
      promise: promise,
    },
    rules: {
      "promise/always-return": "off",
      "promise/catch-or-return": ["error", { allowFinally: true }],
    },
  },
  /*
   * eslint-plugin-jest
   */
  {
    files: ["__test__"],
    plugins: {
      jest: jest,
    },
    rules: {
      "jest/no-done-callback": "off",
      "jest/prefer-spy-on": "error",
    },
  },
  /*
   * eslint-plugin-jest-dom
   */
  {
    files: ["__test__"],
    plugins: {
      "jest-dom": jestDom,
    },
    rules: {
      ...jestDom.configs.recommended.rules,
    },
  },
  {
    files: ["__test__"],
    plugins: {
      "eslint-plugin-testing-library": testingLibrary,
    },
  },
]
