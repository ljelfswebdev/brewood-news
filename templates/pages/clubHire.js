export const CLUB_HIRE_TEMPLATE = [
  {
    key: 'content',
    label: 'Content',
    fields: [
      {
        name: 'body',
        label: 'Body',
        type: 'rich',
      },
    ],
  },
  {
    key: 'gallery',
    label: 'Image Gallery',
    fields: [
      {
        name: 'items',
        label: 'Images',
        type: 'repeater',
        defaultItem: { image: '' },
        of: [
          {
            name: 'image',
            label: 'Image',
            type: 'image',
          },
        ],
      },
    ],
  },
];
