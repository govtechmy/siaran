import { slateEditor } from "@payloadcms/richtext-slate";
import { APIError } from "payload/errors";
import { CollectionConfig } from "payload/types";
import { Field } from "../admin/components/press-releases/fields/Attachment";
import { commitPreUploadedAttachments, deleteAllAttachments } from "../api";
import {
  convertMarkdownToPlainText,
  convertMarkdownToSlate,
  convertSlateToMarkdown,
} from "../serialization/slate";
import { mapLocale } from "../utils/locale";
import * as fields from "./fields/press-release";

const PressRelease: CollectionConfig = {
  slug: "press-releases",
  access: {
    read: ({ req, data }) => {
      return (
        req.user &&
        (req.user.role === "superadmin" ||
          req.user.agency.id === data.relatedAgency)
      );
    },
    update: ({ req, data }) => {
      return (
        req.user &&
        (req.user.role === "superadmin" ||
          req.user.agency.id === data.relatedAgency)
      );
    },
    delete({ req, data }) {
      return (
        req.user &&
        (req.user.role === "superadmin" ||
          req.user.agency.id === data.relatedAgency)
      );
    },
  },
  hooks: {
    beforeValidate: [
      async ({ operation, data }) => {
        if (operation === "update" && !data.relatedAgency) {
          throw new APIError("Agency cannot be changed", 400);
        }

        if (data.isPreUploading) {
          throw new APIError("Please wait for file(s) to be uploaded.", 400);
        }

        return data;
      },
    ],
    beforeRead: [
      async ({ doc }) => {
        if (!doc.content.slate) {
          if (doc.content.markdown) {
            doc.content.slate = convertMarkdownToSlate(doc.content.markdown);
          } else {
            doc.content.slate = null;
          }
        }

        doc.language = mapLocale(doc.language);

        return doc;
      },
    ],
    beforeChange: [
      ({ req, operation, data, context }) => {
        context.operation = operation;
        context.sessionId = data.sessionId;
        context.token = req.cookies["payload-token"];
        context.shouldCommitUpload = data.shouldCommitUpload;

        if (data.content.slate) {
          if (Array.isArray(data.content.slate)) {
            data.content.markdown = data.content.slate
              .map(convertSlateToMarkdown)
              .join("");

            data.content.plain = convertMarkdownToPlainText(
              data.content.markdown,
            );
          }
        }

        return {
          ...data,
          relatedAgency: data.relatedAgency || req.user.agency.id,
        };
      },
    ],
    afterChange: [
      ({ doc, context }) => {
        const { sessionId, shouldCommitUpload, token } = context as {
          sessionId: string;
          shouldCommitUpload: boolean;
          token: string;
        };

        if (sessionId && token && shouldCommitUpload) {
          // Wait until Payload commit the changes
          setTimeout(() => {
            commitPreUploadedAttachments({
              pressReleaseId: doc.id as string,
              sessionId,
              token,
            });
          }, 750);
        }

        return doc;
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        const token = req.cookies["payload-token"];

        if (token) {
          await deleteAllAttachments({
            id: id as string,
            token,
          }).catch((e) => {
            // Ignore error
          });
        }
      },
    ],
  },
  admin: {
    listSearchableFields: [
      "title",
      "content.plain",
      "content.markdown",
      "type",
      "attachments.file_name",
      "relatedAgency",
    ],
  },
  fields: [
    {
      name: "language",
      label: {
        ["en-MY"]: "Language",
        ["ms-MY"]: "Bahasa",
      },
      type: "select",
      required: true,
      options: [
        {
          label: "English",
          value: "en-MY",
        },
        {
          label: "Bahasa Melayu",
          value: "ms-MY",
        },
      ],
      defaultValue: "ms-MY",
    },
    {
      name: "title",
      label: {
        ["en-MY"]: "Title",
        ["ms-MY"]: "Tajuk",
      },
      type: "text",
      required: true,
      index: true,
    },
    {
      name: fields.datePublished,
      label: {
        ["en-MY"]: "Date Published",
        ["ms-MY"]: "Tarikh Diterbitkan",
      },
      type: "date",
      required: true,
    },
    {
      name: "type",
      label: {
        ["en-MY"]: "Type",
        ["ms-MY"]: "Jenis",
      },
      type: "select",
      required: true,
      options: [
        {
          label: "Press Release",
          value: "kenyataan_media",
        },
        {
          label: "Speech",
          value: "ucapan",
        },
      ],
      defaultValue: "kenyataan_media",
    },
    {
      name: "priority",
      label: {
        ["en-MY"]: "Priority",
        ["ms-MY"]: "Keutamaan",
      },
      type: "select",
      required: true,
      options: [
        {
          label: {
            ["en-MY"]: "High",
            ["ms-MY"]: "Tinggi",
          },
          value: "high",
        },
        {
          label: {
            ["en-MY"]: "Normal",
            ["ms-MY"]: "Biasa",
          },
          value: "normal",
        },
        {
          label: {
            ["en-MY"]: "Low",
            ["ms-MY"]: "Rendah",
          },
          value: "low",
        },
      ],
      defaultValue: "normal",
    },
    {
      name: fields.content,
      label: {
        ["en-MY"]: "Content",
        ["ms-MY"]: "Kandungan",
      },
      type: "group",
      fields: [
        {
          name: fields.contentPlain,
          type: "text",
          required: false,
          admin: {
            hidden: true,
          },
        },
        {
          name: fields.contentMarkdown,
          type: "text",
          required: false,
          admin: {
            hidden: true,
          },
        },
        {
          name: "slate",
          label: "Markdown",
          type: "richText",
          editor: slateEditor({
            admin: {
              elements: [
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "blockquote",
                "link",
                "ol",
                "ul",
                "indent",
              ],
              leaves: ["bold", "italic", "strikethrough"],
            },
          }),
          required: false,
        },
      ],
    },
    {
      name: "uploadAttachments",
      label: {
        ["en-MY"]: "Attachments",
        ["ms-MY"]: "Lampiran",
      },
      type: "ui",
      admin: {
        position: "sidebar",
        components: { Field },
      },
    },
    {
      name: "attachments",
      label: {
        ["en-MY"]: "Attachments",
        ["ms-MY"]: "Lampiran",
      },
      type: "array",
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: "url",
          type: "text",
          required: true,
        },
        {
          name: "file_name",
          type: "text",
          required: true,
        },
        {
          name: "file_type",
          type: "text",
          required: true,
        },
        {
          name: "file_size",
          type: "number", //bytes
          required: false,
        },
      ],
    },
    {
      name: "relatedAgency",
      label: {
        ["en-MY"]: "Agency",
        ["ms-MY"]: "Agensi",
      },
      type: "relationship",
      relationTo: "agencies",
      admin: {
        hidden: true,
      },
    },
    {
      name: "createdAt",
      label: {
        ["en-MY"]: "Created At",
        ["ms-MY"]: "Dicipta Pada",
      },
      type: "date",
      admin: {
        hidden: true,
      },
    },
    {
      name: "updatedAt",
      label: {
        ["en-MY"]: "Updated At",
        ["ms-MY"]: "Dikemas Kini Pada",
      },
      type: "date",
      admin: {
        hidden: true,
      },
    },
  ],
};

export default PressRelease;
