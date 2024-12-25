import { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  access: {
    create({ req: { user } }) {
      return user?.role === "superadmin";
    },
    read: ({ req: { user } }) => {
      if (user?.role === "superadmin") {
        return true;
      }

      // Can only read the user themselves
      return {
        id: {
          equals: user?.id,
        },
      };
    },
    update({ req: { user } }) {
      return user?.role === "superadmin";
    },
    delete({ req: { user } }) {
      return user?.role === "superadmin";
    },
  },
  admin: {
    useAsTitle: "email",
  },
  fields: [
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
      name: "role",
      label: {
        ["en-MY"]: "Role",
        ["ms-MY"]: "Peranan",
      },
      type: "select",
      required: true,
      options: [
        {
          label: "Super Admin",
          value: "superadmin",
        },
        {
          label: "Admin",
          value: "admin",
        },
      ],
      defaultValue: "admin",
    },
    {
      name: "agency",
      label: {
        ["en-MY"]: "Agency",
        ["ms-MY"]: "Agensi",
      },
      type: "relationship",
      relationTo: "agencies",
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

export default Users;
