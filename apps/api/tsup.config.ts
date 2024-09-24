import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  noExternal: ["@repo"],
  splitting: false,
  bundle: true,
  outDir: "./dist",
  clean: true,
  loader: { ".json": "copy" },
  minify: true,
  sourcemap: true,
});