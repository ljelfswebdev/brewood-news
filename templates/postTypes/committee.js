// templates/postTypes/committee.js
export const COMMITTEE_POST_TEMPLATE = [
  {
    key: 'main',
    label: 'Committee Member',
    fields: [
      { name: 'firstName', label: 'First Name', type: 'text' },
      { name: 'lastName', label: 'Last Name', type: 'text' },
      { name: 'position', label: 'Position', type: 'text' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'about', label: 'About', type: 'rich' },
    ],
  },
];
