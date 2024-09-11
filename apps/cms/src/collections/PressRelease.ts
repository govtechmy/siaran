import { CollectionConfig } from 'payload/types';

const PressRelease: CollectionConfig = {
  slug: 'press-releases',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'summary',  
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'datetime',
      type: 'date',
      required: true,
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'fileUrl',
          type: 'text',
          required: true,
        },
        {
          name: 'filename',
          type: 'text',
          required: true,
        },
        {
          name: 'filesize',
          type: 'number',
          required: true,
        },
      ],
      required: false,
    },
    {
      name: 'relatedAgency',
      type: 'relationship',
      relationTo: 'agencies',
      required: true,
    },
  ],
};

export default PressRelease;