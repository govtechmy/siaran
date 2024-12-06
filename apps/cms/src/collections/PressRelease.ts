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
          name: "plain",
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
      name: "draftAttachments",
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
          label: "URL",
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
        {
          name: "storage",
          type: "group",
          hidden: true,
          fields: [
            {
              name: "domain",
              type: "text",
              required: false,
            },
            {
              name: "key",
              type: "text",
              required: false,
            },
          ],
        },
      ],
    },
    {
      name: "relatedAgency",
      type: "relationship",
      relationTo: "agencies",
    },
  ],
};

export default PressRelease;
