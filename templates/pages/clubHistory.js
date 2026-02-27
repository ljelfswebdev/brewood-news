export const CLUB_HISTORY_TEMPLATE = [
  {
    key: 'blocks',
    label: 'Blocks',
    fields: [
      {
        name: 'items',
        label: 'Content Blocks',
        type: 'repeater',
        defaultItem: {
          blockType: 'richText',
          content: '',
          gallery: [],
        },
        of: [
          {
            name: 'blockType',
            label: 'Block Type',
            type: 'select',
            options: ['richText', 'gallery'],
          },
          {
            name: 'content',
            label: 'Rich Text',
            type: 'rich',
            showWhen: { field: 'blockType', equals: 'richText' },
          },
          {
            name: 'gallery',
            label: 'Gallery',
            type: 'repeater',
            showWhen: { field: 'blockType', equals: 'gallery' },
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
    ],
  },
];
