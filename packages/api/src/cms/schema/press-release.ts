import { agency } from "#cms/schema/agency";
import { z } from "#extensions/zod";

const type = z.enum(["kenyataan_media", "ucapan", "other"]);

const priority = z.enum(["high", "normal", "low"]);

const attachment = z.object({
  url: z.string().url(),
  alt: z.string(),
  // TODO: use consistent naming convention (e.g. fileName instead of file_name)
  file_name: z.string(),
  file_type: z.string(),
  file_size: z.number(),
});

const content = z.object({
  plain: z.string(),
  markdown: z.string().optional(),
});

const pressRelease = z.object({
  id: z.string(),
  language: z.string(), // TODO: further definition
  title: z.string(),
  date_published: z.string(), // TODO: further definition
  type,
  content,
  attachments: z.array(attachment).optional(),
  priority: priority.optional(),
  relatedAgency: agency,
});

type Type = z.infer<typeof type>;
type Priority = z.infer<typeof priority>;
type Attachment = z.infer<typeof attachment>;
type Content = z.infer<typeof content>;
type PressRelease = z.infer<typeof pressRelease>;

export {
  type,
  priority,
  attachment,
  content,
  pressRelease,
  type Type,
  type Priority,
  type Attachment,
  type Content,
  type PressRelease,
};
