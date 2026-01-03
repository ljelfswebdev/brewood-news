// templates/pages/index.js
import { HOMEPAGE_TEMPLATE } from './homepage';
import { ABOUT_TEMPLATE } from './about';

export const PAGE_TEMPLATES = {
  homepage: {
    key: 'homepage',
    label: 'Homepage',
    sections: HOMEPAGE_TEMPLATE,
  },

  // example for later:
  about: {
    key: 'about',
    label: 'About Page',
    sections: ABOUT_TEMPLATE,
  },
};