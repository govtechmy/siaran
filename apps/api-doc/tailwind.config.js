// @ts-check
import { preset, preset_fumadocs } from "@govtechmy/myds-style";
import { createPreset } from "fumadocs-ui/tailwind-plugin";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./mdx-components.{ts,tsx}",
    "../../node_modules/fumadocs-ui/dist/**/*.js",
    // include MYDS React components in Tailwind compilation
    "../../node_modules/@govtechmy/myds-react/dist/**/*.{js,jsx,ts,tsx}",
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
      colors: {
        primary: {
          700: "rgb(var(--theme-700))",
          600: "rgb(var(--theme-600))",
          500: "rgb(var(--theme-500))",
          400: "rgb(var(--theme-400))",
          300: "rgb(var(--theme-300))",
          200: "rgb(var(--theme-200))",
          100: "rgb(var(--theme-100))",
          50: "rgb(var(--theme-50))",
        },
      },
    },
  },
};
