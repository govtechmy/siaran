import { APIError } from "payload/errors";
import { CollectionConfig } from "payload/types";
import { Field } from "../admin/components/press-releases/fields/Attachment";
import { commitPreUploadedAttachments, deleteAllAttachments } from "../api";

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
    beforeChange: [
      ({ req, operation, data, context }) => {
        context.operation = operation;
        context.sessionId = data.sessionId;
        context.token = req.cookies["payload-token"];

        if (data.isPreUploading) {
          throw new APIError("Please wait for file(s) to be uploaded.", 400);
        }

        if (operation === "update" && !data.relatedAgency) {
          throw new APIError("Agency cannot be changed", 400);
        }

        return {
          ...data,
          relatedAgency: data.relatedAgency || req.user.agency.id,
        };
      },
    ],
    afterChange: [
      ({ doc, context }) => {
        const { sessionId, token } = context as {
          sessionId: string;
          token: string;
        };

        if (sessionId && token) {
          // Use timeout to let Payload commit the changes first
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
      async ({ req, id, context }) => {
        const token = req.cookies["payload-token"];

        if (token) {
          await deleteAllAttachments({
            id: id as string,
            token,
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
    },
    {
      name: "date_published",
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
      name: "content",
      label: {
        ["en-MY"]: "Content",
        ["ms-MY"]: "Kandungan",
      },
      type: "group",
      fields: [
        {
          name: "plain",
          label: {
            ["en-MY"]: "Text",
            ["ms-MY"]: "Teks",
          },
          type: "textarea",
          required: false,
        },
        {
          name: "markdown",
          label: "Markdown",
          type: "textarea",
          required: false,
        },
      ],
    },
    {
      name: "uploadAttachments",
      label: "Attachments",
      type: "ui",
      admin: {
        position: "sidebar",
        components: { Field },
      },
    },
    {
      name: "attachments",
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
      type: "relationship",
      relationTo: "agencies",
      admin: {
        hidden: true,
      },
    },
  ],
};

export default PressRelease;
