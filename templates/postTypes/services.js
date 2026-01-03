// templates/postTypes/services.js
export const SERVICES_POST_TEMPLATE = [
  {
    key: 'main',
    label: 'Service Content',
    fields: [
      { name: 'title', label: 'Service Title', type: 'text' },

      { name: 'description', label: 'Description', type: 'rich' },

      {
        name: 'gallery',
        label: 'Image Gallery',
        type: 'repeater',
        of: [
          {
            name: 'image',
            label: 'Image',
            type: 'image',
          },
        ],
      },

      // Checkbox options: Kirby, Dyson, Spares
      { name: 'isKirby', label: 'Kirby', type: 'checkbox' },
      { name: 'isDyson', label: 'Dyson', type: 'checkbox' },
      { name: 'isSpares', label: 'Spares', type: 'checkbox' },
    ],
  },
];