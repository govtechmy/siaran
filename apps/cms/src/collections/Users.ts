import { User } from "payload/dist/auth";
import { CollectionConfig, PayloadRequest } from "payload/types";

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
      name: "role",
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
    // Email added by default
    // Add more fields as needed
  ],
};

export default Users;
