// templates/pages/index.js
import { HOMEPAGE_TEMPLATE } from './homepage';
import { ABOUT_TEMPLATE } from './about';
import { CLUB_HIRE_TEMPLATE } from './clubHire';
import { CLUB_HISTORY_TEMPLATE } from './clubHistory';
import { LEGALS_TEMPLATE } from './legals';
import { SPONSORS_PAGE_TEMPLATE } from './sponsors';
import { MEMBERSHIP_TEMPLATE } from './membership';
import { PREMIER_DRAW_TEMPLATE } from './premierDraw';

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
  legals: {
    key: 'legals',
    label: 'Legals',
    sections: LEGALS_TEMPLATE,
  },
  sponsors: {
    key: 'sponsors',
    label: 'Sponsors',
    sections: SPONSORS_PAGE_TEMPLATE,
  },
  membership: {
    key: 'membership',
    label: 'Membership',
    sections: MEMBERSHIP_TEMPLATE,
  },
  premierDraw: {
    key: 'premierDraw',
    label: 'Premier Draw',
    sections: PREMIER_DRAW_TEMPLATE,
  },
};
