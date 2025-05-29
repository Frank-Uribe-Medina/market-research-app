const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const customJestConfig = {
  moduleNameMapper: {
    // Handle CSS imports (without CSS modules)
    "^.+\\.(css|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",

    // Handle image imports
    // https://jestjs.io/docs/webpack#handling-static-assets
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$": `<rootDir>/__mocks__/fileMock.js`,

    // Handle module aliases
    "^@/components/(.*)$": "<rootDir>/components/$1",
  },
  testEnvironment: "jest-environment-jsdom",
  passWithNoTests: true,
  setupFilesAfterEnv: ["./src/test-data/setupTests.ts"],
};

// Copied from https://github.com/vercel/next.js/discussions/34774#discussioncomment-2246460
module.exports = async (...args) => {
  const fn = createJestConfig(customJestConfig);
  const res = await fn(...args);

  res.transformIgnorePatterns = res.transformIgnorePatterns.map((pattern) => {
    if (pattern === "/node_modules/") {
      // Transform firebase/auth from ESM to CJS to avoid SyntaxError: Unexpected token 'export'
      return "/node_modules(?!/(firebase|@firebase|use-debounce))/";
    }
    return pattern;
  });

  return res;
};
