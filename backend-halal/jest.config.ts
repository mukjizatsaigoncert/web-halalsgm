import type { Config } from "jest";

// Strapi's runtime relies on heavy native modules (better-sqlite3) and a
// global `strapi` instance that's non-trivial to boot for unit tests. We
// therefore scope Jest to pure-function utilities under src/utils and any
// logic we explicitly extract. Controller/route behaviour is better covered
// by Playwright against a running Strapi instance.
const config: Config = {
  testEnvironment: "node",
  preset: "ts-jest",
  testMatch: ["**/src/utils/**/*.test.ts", "**/tests/unit/**/*.test.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  collectCoverageFrom: ["src/utils/**/*.ts", "!**/*.d.ts"],
};

export default config;
