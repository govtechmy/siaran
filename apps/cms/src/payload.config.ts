import path from "path";

import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import search from "@payloadcms/plugin-search";
import { buildConfig } from "payload/config";

import { slateEditor } from "@payloadcms/richtext-slate";
import { Logo } from "./admin/components/Logo";
import Agency from "./collections/Agency";
import PressRelease from "./collections/PressRelease";
import Users from "./collections/Users";
import endpoints from "./endpoints/app";
import enMY from "./i18n/resources/en-MY";
import msMY from "./i18n/resources/ms-MY";

export default buildConfig({
  i18n: {
    fallbackLng: "en-MY",
    supportedLngs: ["en-MY", "ms-MY"],
    resources: {
      ["en-MY"]: enMY,
      ["ms-MY"]: msMY,
    },
  },
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: "- SiaranGovMY",
      favicon: "/assets/logo.svg",
    },
    components: {
      graphics: {
        Logo,
      },
    },
  },
  // editor: lexicalEditor({ features }),
  editor: slateEditor({}),
  collections: [Users, Agency, PressRelease],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  endpoints,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  plugins: [
    search({
      collections: ["press-releases"],
      defaultPriorities: {
        "press-releases": 10,
      },
      searchOverrides: {
        slug: "search-results",
        admin: {
          hidden: true,
        },
      },
    }),
  ],
});
