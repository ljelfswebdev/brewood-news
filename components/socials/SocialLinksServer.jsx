// components/socials/SocialLinksServer.jsx
import { dbConnect } from '@helpers/db';
import Setting from '@/models/Settings';
import SocialIcons from '@/components/socials/SocialIcons';

export default async function SocialLinksServer({
  className = '',
  size = 22,
  showLabels = false,
  gap = 'gap-6',
}) {
  await dbConnect();


  const settings = await Setting.findOne({ key: 'global' }).lean();

  const socials = settings?.templateData?.socials || {};

  const links = Object.entries(socials)
    .filter(([_, v]) => !!v && v.trim() !== '')
    .map(([name, url]) => ({
      name,
      url: url.startsWith('http') ? url : `https://${url}`,
    }));

 
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