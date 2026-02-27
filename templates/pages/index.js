// templates/pages/index.js
import { HOMEPAGE_TEMPLATE } from './homepage';
import { ABOUT_TEMPLATE } from './about';
import { CLUB_HIRE_TEMPLATE } from './clubHire';
import { CLUB_HISTORY_TEMPLATE } from './clubHistory';

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
  clubHire: {
    key: 'clubHire',
    label: 'Club Hire',
    sections: CLUB_HIRE_TEMPLATE,
  },
  clubHistory: {
    key: 'clubHistory',
    label: 'Club History',
    sections: CLUB_HISTORY_TEMPLATE,
  },
};
