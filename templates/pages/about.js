// templates/pages/about.js
export const ABOUT_TEMPLATE = [
  {
    key: 'section1',
    label: 'Hero Section',
    fields: [
      { name: 'title',    label: 'Page Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle',   type: 'textarea' },
      { name: 'image',    label: 'Main Image', type: 'image' },
    ],
  },
  {
    key: 'section2',
    label: 'Gallery',
    fields: [
      {
        name: 'items',
        label: 'Gallery Items',
        type: 'repeater',
        of: [
          { name: 'image', label: 'Image',   type: 'image' },
          { name: 'link',  label: 'Link URL', type: 'text' },
        ],
      },
    ],
  },
    {
    key: 'section3',
    label: 'Gallery2',
    fields: [
      {
        name: 'items',
        label: 'Gallery Items',
        type: 'repeater',
        of: [
          { name: 'image', label: 'Image',   type: 'image' },
          { name: 'link',  label: 'Link URL', type: 'text' },
        ],
      },
    ],
  },


];