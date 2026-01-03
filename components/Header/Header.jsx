// components/Header.jsx
import { dbConnect } from '@helpers/db';
import Menu from '@/models/Menu';
import HeaderClient from '@/components/Header/HeaderClient';

export default async function Header() {
  await dbConnect();

  const menu = await Menu.findOne({ key: 'header' }).lean();
  const items = menu?.items || [];

  return <HeaderClient items={items} />;
}