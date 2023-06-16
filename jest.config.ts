import { Config } from "jest";

const config: Config = {
  rootDir: ".",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "<rootDir>/utils/**/*.ts",
    "!<rootDir>/**/**spec.ts",
    "!<rootDir>/src/infra/database/**",
    "!<rootDir>/src/infra/http/**",
    "!<rootDir>/src/index.ts",
  ],
  coveragePathIgnorePatterns: ["<rootDir>/dist/"],
  coverageDirectory: "coverage",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};

export default config;
