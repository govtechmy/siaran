import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["cjs"],
  noExternal: ["@repo/api"],
  splitting: false,
  bundle: true,
  outDir: "./dist",
  clean: true,
  loader: { ".json": "copy" },
  minify: true,
  sourcemap: true,
});
