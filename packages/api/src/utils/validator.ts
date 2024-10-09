import { z } from "zod";

export const localeSchema = z.union([z.literal("en-MY"), z.literal("ms-MY")]);
