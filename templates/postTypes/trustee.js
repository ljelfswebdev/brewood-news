// templates/postTypes/trustee.js
export const TRUSTEE_POST_TEMPLATE = [
  {
    key: 'main',
    label: 'Trustee Member',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'about', label: 'About', type: 'rich' },
    ],
  },
];
