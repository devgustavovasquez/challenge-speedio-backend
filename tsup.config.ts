import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  tsconfig: "tsconfig.build.json",
});
