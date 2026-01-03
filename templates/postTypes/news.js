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
    key: 'main',
    label: 'Main Content',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'body', label: 'Body', type: 'rich' },
      { name: 'featuredImage', label: 'Featured Image', type: 'image' },
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
        of: [
          { name: 'blockType', label: 'Block Type', type: 'select', options: ['imageGallery', 'richText'] },
          { name: 'gallery', label: 'Gallery Images', type: 'repeater', of: [{ name: 'image', label: 'Image', type: 'image' }] },
          { name: 'content', label: 'Rich Text Content', type: 'rich' },
        ],
      },
    ],
  },
];