import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["index.ts"],
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2020",
  noExternal: ["shared-types"],
  env: {
    NODE_ENV: "production",
  },
});
