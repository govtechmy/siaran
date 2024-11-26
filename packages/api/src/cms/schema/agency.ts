import { z } from "#extensions/zod";

const agency = z.object({
  id: z.string(),
  name: z.string(),
  acronym: z.string(),
  email: z.string().email(),
  socialMedia: z.array(z.string().url()),
});

type Agency = z.infer<typeof agency>;

export { agency, type Agency };
