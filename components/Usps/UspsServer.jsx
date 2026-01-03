// components/Usps/UspsServer.jsx
import { dbConnect } from '@helpers/db';
import Settings from '@/models/Settings'; // <- or whatever your settings model is called
import UspsClient from './UspsClient';

export default async function UspsServer() {
  await dbConnect();

  const settings = await Settings.findOne({ key: 'global' }).lean();

  const uspsItems = settings?.templateData?.usps?.items || [];

  if (!uspsItems.length) {

    return null;
  }

  return <UspsClient items={uspsItems} />;
}