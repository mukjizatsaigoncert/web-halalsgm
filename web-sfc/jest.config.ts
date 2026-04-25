import type { Config } from "jest";
import nextJest from "next/jest.js";

// Uses Next.js's Jest preset, which handles swc transform + CSS mocks +
// image/env resolution in the same way `next dev` does.
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

export default createJestConfig(config);
