import { CollectionConfig } from 'payload/types';
import { endpoints } from '../endpoints/press-releases';

const PressRelease: CollectionConfig = {
  slug: 'press-releases',
  fields: [
    {
      name: 'language',
      type: 'text',
      required: false,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date_published',
      type: 'date',
      required: true,
    },
    {
      name: 'type',
      type: 'text',
      required: true, 
    },
    {
      name: 'content',
      type: 'group', 
      fields: [
        {
          name: 'plaintext',
          type: 'textarea', 
          required: false,
        },
        {
          name: 'html',
          type: 'textarea',
          required: false,
        },
        {
          name: 'markdown',
          type: 'textarea', 
          required: false,
        },
      ],
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'file_name',
          type: 'text',
          required: true,
        },
        {
          name: 'file_type',
          type: 'text',
          required: true,
        },
        {
          name: 'file_size', 
          type: 'number', //bytes
          required: false,
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
  endpoints,
};

export default PressRelease;
