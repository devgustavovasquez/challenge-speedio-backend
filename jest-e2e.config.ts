import config from "./jest.config";

config.testEnvironment = "./tests/e2e/prisma-test.ts";
config.testMatch = ["**/*.e2e-spec.ts"];
export default config;
