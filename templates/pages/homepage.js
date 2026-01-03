// templates/pages/homepage.js
export const HOMEPAGE_TEMPLATE = [
  {
    key: 'section1',
    label: 'Hero',
    fields: [
      {
        name: 'slides',
        label: 'Hero Slides',
        type: 'repeater',
        of: [
          {
            name: 'backgroundImage',
            label: 'Background Image',
            type: 'image',
          },
          {
            name: 'title',
            label: 'Title',
            type: 'text',
          },
          {
            name: 'text',
            label: 'Text',
            type: 'rich',
          },
        ],
      },
    ],
  },

  {
    key: 'section2',
    label: 'Blue Banner',
    fields: [
      {
        name: 'backgroundImage',
        label: 'Background Image',
        type: 'image',
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
      },
      {
        name: 'text',
        label: 'Text',
        type: 'rich',
      },
      {
        name: 'linkText',
        label: 'Link Text',
        type: 'text',
      },
      {
        name: 'linkUrl',
        label: 'Link URL',
        type: 'text',
      },
      {
        name: 'options',
        label: 'Options',
        type: 'repeater',
        of: [
          {
            name: 'label',
            label: 'Option Text',
            type: 'text',
          },
        ],
      },
    ],
  },

  {
    key: 'section3',
    label: 'Content Section',
    fields: [
      {
        name: 'subtitle',
        label: 'Subtitle',
        type: 'text',
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
      },
      {
        name: 'text',
        label: 'Text',
        type: 'rich',
      },

      {
        name: 'linkText',
        label: 'Link Text',
        type: 'text',
      },
      {
        name: 'linkUrl',
        label: 'Link URL',
        type: 'text',
      },

    ],
  },
];