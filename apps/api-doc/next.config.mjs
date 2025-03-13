import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();
const basePath = process.env.BASE_PATH;

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  trailingSlash: true,
  basePath,
  env: {
    BASE_PATH: basePath,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default withMDX(config);
