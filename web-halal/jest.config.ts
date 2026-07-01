import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/src/layouts/components/$1",
    "^@/shortcodes/(.*)$": "<rootDir>/src/layouts/shortcodes/$1",
    "^@/helpers/(.*)$": "<rootDir>/src/layouts/helpers/$1",
    "^@/partials/(.*)$": "<rootDir>/src/layouts/partials/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.next/",
    "/tests/e2e/",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.{ts,tsx}",
    "!src/app/**/layout.tsx",
    "!src/app/**/loading.tsx",
    "!src/app/**/not-found.tsx",
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
};

// Async wrapper so we can override transformIgnorePatterns AFTER
// next/jest sets its own (which ignores all of node_modules by default).
// github-slugger v2+ is ESM-only and needs to be transformed by SWC.
export default async () => {
  const jestConfig = await createJestConfig(config)();
  jestConfig.transformIgnorePatterns = [
    "/node_modules/(?!(github-slugger|marked)/)",
    "^.+\\.module\\.(css|sass|scss)$",
  ];
  return jestConfig;
};
