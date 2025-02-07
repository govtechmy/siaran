// @ts-check
import { createPreset } from "fumadocs-ui/tailwind-plugin";
import { preset, preset_fumadocs } from "@govtechmy/myds-style";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./mdx-components.{ts,tsx}",
    "../../node_modules/fumadocs-ui/dist/**/*.js",
  ],
  presets: [
    createPreset({
      preset: {
        light: {
          ...preset_fumadocs["light"],
          primary: "15.9 100% 41.4%",
        },
        dark: {
          ...preset_fumadocs["dark"],
          primary: "15.9 100% 41.4%",
        },
      },
      layoutWidth: "1318px",
    }),
    preset,
  ],
  theme: {
    extend: {
      colors: {},
    },
  },
};
