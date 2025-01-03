import { CollectionConfig } from "payload/types";

const Agency: CollectionConfig = {
  slug: "agencies",
  auth: true,
  access: {
    create({ req: { user } }) {
      return user?.role === "superadmin";
    },
    read: ({ req: { user } }) => {
      return user != null;
    },
    update({ req: { user } }) {
      return user?.role === "superadmin";
    },
    delete({ req: { user } }) {
      return user?.role === "superadmin";
    },
  },
  admin: {
    listSearchableFields: [
      "id",
      "name",
      "acronym",
      "email",
      "website",
      "socialMedia",
    ],
  },
  fields: [
    {
      name: "id",
      type: "text",
      required: true,
      unique: true, // Ensure the custom ID is unique
    },
    {
      name: "name",
      label: {
        ["en-MY"]: "Name",
        ["ms-MY"]: "Nama",
      },
      type: "text",
      required: true,
    },
    {
      name: "acronym",
      label: {
        ["en-MY"]: "Abbreviation",
        ["ms-MY"]: "Singkatan",
      },
      type: "text",
      required: true,
    },
    {
      name: "email",
      label: {
        ["en-MY"]: "Email",
        ["ms-MY"]: "E-mel",
      },
      type: "email",
      required: true,
    },
    {
      name: "website",
      label: {
        ["en-MY"]: "Website",
        ["ms-MY"]: "Laman Web",
      },
      type: "text",
      required: false,
    },
    {
      name: "socialMedia",
      label: {
        ["en-MY"]: "Social Media",
        ["ms-MY"]: "Media Sosial",
      },
      type: "array",
      fields: [
        {
          name: "platform",
          type: "select",
          options: [
            {
              label: "Facebook",
              value: "facebook",
            },
            {
              label: "Twitter",
              value: "twitter",
            },
            {
              label: "TikTok",
              value: "tiktok",
            },
          ],
          required: true,
        },
        {
          name: "url",
          type: "text",
          required: true,
        },
      ],
      required: false,
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

export default Agency;
