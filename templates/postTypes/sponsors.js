// templates/postTypes/sponsors.js
export const SPONSORS_POST_TEMPLATE = [
  {
    key: 'main',
    label: 'Sponsor Content',
    fields: [
      {
        name: 'image',
        label: 'Sponsor Image',
        type: 'image',
      },

      {
        name: 'link',
        label: 'Sponsor Link',
        type: 'text',
      },

      {
        name: 'content',
        label: 'Description',
        type: 'rich',
      },
    ],
  },
];