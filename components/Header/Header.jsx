// components/Header.jsx
import { dbConnect } from '@helpers/db';
import Menu from '@/models/Menu';
import HeaderClient from '@/components/Header/HeaderClient';

function menuTreeFromItems(items = []) {
  if (!Array.isArray(items)) return [];

  // New shape: flat items with id/parentId/order.
  const hasFlatKeys = items.some((item) => item?.id || item?.parentId != null);
  if (hasFlatKeys) {
    const normalized = items.map((item, idx) => ({
      id: String(item?.id || `menu-${idx}`),
      label: String(item?.label || ''),
      url: String(item?.url || ''),
      target: String(item?.target || '_self'),
      parentId: item?.parentId ? String(item.parentId) : null,
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : idx,
    }));

    const byParent = new Map();
    normalized.forEach((item) => {
      const key = item.parentId || '__root__';
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push({ ...item, children: [] });
    });

    const parents = (byParent.get('__root__') || []).sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );

    return parents.map((parent) => ({
      ...parent,
      children: (byParent.get(parent.id) || []).sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      ),
    }));
  }

  // Legacy shape: top-level array (optionally already with children).
  return items.map((item) => ({
    ...item,
    url: String(item?.url || ''),
    target: String(item?.target || '_self'),
    children: Array.isArray(item?.children)
      ? item.children.map((child) => ({
          ...child,
          url: String(child?.url || ''),
          target: String(child?.target || '_self'),
        }))
      : [],
  }));
}

export default async function Header() {
  let items = [];

  try {
    await dbConnect();
    const menu = await Menu.findOne({ key: 'header' }).lean();
    items = menuTreeFromItems(menu?.items || []);
  } catch (error) {
    // Do not take down the whole site if menu/db loading fails in production.
    console.error('Header menu load failed:', error?.message || error);
  }

  return <HeaderClient items={items} />;
}
