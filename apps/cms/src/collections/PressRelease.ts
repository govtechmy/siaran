import { CollectionConfig } from "payload/types";

const PressRelease: CollectionConfig = {
  slug: "press-releases",
  admin: {
    listSearchableFields: [
      "title",
      "content.plaintext",
      "content.markdown",
      "type",
      "attachments.file_name",
      "relatedAgency",
    ],
  },
  fields: [
    {
      name: "language",
      type: "text",
      required: false,
    },
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "date_published",
      type: "date",
      required: true,
    },
    {
      name: "type",
      type: "text",
      required: true,
    },
    {
      name: "priority",
      type: "select",
      required: true,
      options: [
        {
          label: "High",
          value: "high",
        },
        {
          label: "Normal",
          value: "normal",
        },
        {
          label: "Low",
          value: "low",
        },
      ],
      defaultValue: "normal",
    },
    {
      name: "content",
      type: "group",
      fields: [
        {
          name: "plaintext",
          type: "textarea",
          required: false,
        },
        {
          name: "html",
          type: "textarea",
          required: false,
        },
        {
          name: "markdown",
          type: "textarea",
          required: false,
        },
      ],
    },
    {
      name: "attachments",
      type: "array",
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
      required: false,
    },
    {
      name: "relatedAgency",
      type: "relationship",
      relationTo: "agencies",
      required: true,
    },
  ],
};

export default PressRelease;
