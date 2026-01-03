// components/socials/SocialLinksClient.jsx
'use client';

import { useEffect, useState } from 'react';
import SocialIcons from '@/components/socials/SocialIcons';

export default function SocialLinksClient({
  className = '',
  size = 22,
  showLabels = false,
  gap = 'gap-6',
}) {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    (async () => {
      try {

        const r = await fetch('/api/admin/settings/global', { cache: 'no-store' });

        if (!r.ok) {

          return;
        }

        const settings = await r.json();

        const socials = settings?.templateData?.socials || {};


        const list = Object.entries(socials)
          .filter(([_, v]) => !!v && v.trim() !== '')
          .map(([name, url]) => ({
            name,
            url: url.startsWith('http') ? url : `https://${url}`,
          }));


        setLinks(list);
      } catch (err) {

      }
    })();
  }, []);

  if (!links.length) {

    return null;
  }

  return (
    <nav aria-label="Social media" className={className}>
      <ul className={`flex items-center flex-wrap ${gap}`}>
        {links.map(({ name, url }) => (
          <li key={name}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white hover:text-secondary transition-colors"
            >
              <SocialIcons name={name} size={size} />
              {showLabels && <span className="capitalize">{name}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}