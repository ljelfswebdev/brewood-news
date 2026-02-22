// templates/postTypes/news.js
export const NEWS_POST_TEMPLATE = [
  {
    key: 'taxonomy',
    label: 'Categories',
    fields: [
      { name: 'isTeamsheets', label: 'Teamsheets', type: 'checkbox' },
      { name: 'isMatchReports', label: 'Match Reports', type: 'checkbox' },
      { name: 'isNews', label: 'News', type: 'checkbox' },
      { name: 'isPlayers', label: 'Players', type: 'checkbox' },
    ],
  },

  {
    key: 'intro',
    label: 'Intro Text + Image',
    fields: [
      { name: 'introText', label: 'Intro Text', type: 'textarea' },
      { name: 'introImage', label: 'Intro Image', type: 'image' },
    ],
  },


  {
    key: 'blocks',
    label: 'Content Blocks',
    fields: [
      {
        name: 'blocks',
        label: 'Blocks',
        type: 'repeater',
        defaultItem: {
          blockType: 'richText',
          gallery: [],
          content: '',
        },
        of: [
          { name: 'blockType', label: 'Block Type', type: 'select', options: ['imageGallery', 'richText'] },
          {
            name: 'gallery',
            label: 'Gallery Images',
            type: 'repeater',
            showWhen: { field: 'blockType', equals: 'imageGallery' },
            defaultItem: { image: '' },
            of: [{ name: 'image', label: 'Image', type: 'image' }],
          },
          {
            name: 'content',
            label: 'Rich Text Content',
            type: 'rich',
            showWhen: { field: 'blockType', equals: 'richText' },
          },
        ],
      },
    ],
  },
];
