import path from "path";

import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloud } from "@payloadcms/plugin-cloud";
import search from "@payloadcms/plugin-search";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";

import { webpackBundler } from "@payloadcms/bundler-webpack";
import { Logo } from "./admin/components/Logo";
import Agency from "./collections/Agency";
import PressRelease from "./collections/PressRelease";
import Users from "./collections/Users";
import endpoints from "./endpoints/app";

export default buildConfig({
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
  editor: slateEditor({}),
  collections: [Users, Agency, PressRelease],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  endpoints,
  plugins: [
    payloadCloud(),
    search({
      searchOverrides: {
        slug: "search-collections",
        admin: {
          hidden: true,
        },
        access: {
          read: ({ req: { user } }) => {
            return user != null;
          },
        },
      },
      collections: ["press-releases", "agencies"],
      defaultPriorities: {
        PressRelease: 10,
        Agency: 20,
      },
    }),
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});
