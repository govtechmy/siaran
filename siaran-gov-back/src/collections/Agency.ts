import { CollectionConfig } from 'payload/types';

const Agency: CollectionConfig = {
  slug: 'agencies',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'acronym',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'website',
      type: 'text',
      required: false,
    },
    {
      name: 'socialMedia',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            {
              label: 'Facebook',
              value: 'facebook',
            },
            {
              label: 'Twitter',
              value: 'twitter',
            },
            {
              label: 'TikTok',
              value: 'tiktok',
            },
          ],
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
      required: false,
    },
  ],
};

export default Agency;