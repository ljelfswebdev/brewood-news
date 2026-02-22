'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function uid(prefix = 'item') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeTarget(value) {
  return String(value) === '_blank' ? '_blank' : '_self';
}

function normalizeItems(rawItems = []) {
  const normalized = [];

  function pushItem(item, parentId = null, fallbackOrder = 0) {
    if (!item) return;
    const id = String(item.id || uid('menu'));
    normalized.push({
      id,
      label: String(item.label || ''),
      url: String(item.url || ''),
      target: normalizeTarget(item.target),
      type: String(item.type || 'custom'),
      parentId: parentId || null,
      order: Number.isFinite(Number(item.order)) ? Number(item.order) : fallbackOrder,
    });

    const children = Array.isArray(item.children) ? item.children : [];
    children.forEach((child, idx) => pushItem(child, id, idx));
  }

  rawItems.forEach((item, idx) => {
    if (Array.isArray(item?.children)) {
      pushItem(item, null, idx);
    } else {
      normalized.push({
        id: String(item?.id || uid('menu')),
        label: String(item?.label || ''),
        url: String(item?.url || ''),
        target: normalizeTarget(item?.target),
        type: String(item?.type || 'custom'),
        parentId: item?.parentId ? String(item.parentId) : null,
        order: Number.isFinite(Number(item?.order)) ? Number(item.order) : idx,
      });
    }
  });

  return normalized;
}

function buildTree(items = []) {
  const sorted = [...items].sort((a, b) => {
    if (a.parentId === b.parentId) return (a.order || 0) - (b.order || 0);
    return String(a.parentId || '').localeCompare(String(b.parentId || ''));
  });

  const byParent = new Map();
  sorted.forEach((item) => {
    const key = item.parentId || '__root__';
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push({ ...item, children: [] });
  });

  const parents = byParent.get('__root__') || [];
  parents.forEach((parent) => {
    parent.children = (byParent.get(parent.id) || []).sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
  });

  return parents.sort((a, b) => (a.order || 0) - (b.order || 0));
}

function flattenTree(parents = []) {
  return parents.flatMap((parent, pIdx) => {
    const parentItem = {
      id: parent.id,
      label: parent.label || '',
      url: parent.url || '',
      target: normalizeTarget(parent.target),
      type: parent.type || 'custom',
      parentId: null,
      order: pIdx,
    };

    const children = (parent.children || []).map((child, cIdx) => ({
      id: child.id,
      label: child.label || '',
      url: child.url || '',
      target: normalizeTarget(child.target),
      type: child.type || 'custom',
      parentId: parent.id,
      order: cIdx,
    }));

    return [parentItem, ...children];
  });
}

export default function MenusAdmin() {
  const [menus, setMenus] = useState([]);
  const [pages, setPages] = useState([]);
  const [key, setKey] = useState('header');
  const [items, setItems] = useState([]);

  const [selectedParentPageId, setSelectedParentPageId] = useState('');
  const [newParentLabel, setNewParentLabel] = useState('');
  const [newParentUrl, setNewParentUrl] = useState('');
  const [newParentTarget, setNewParentTarget] = useState('_self');

  const [childParentId, setChildParentId] = useState('');
  const [selectedChildPageId, setSelectedChildPageId] = useState('');
  const [newChildLabel, setNewChildLabel] = useState('');
  const [newChildUrl, setNewChildUrl] = useState('');
  const [newChildTarget, setNewChildTarget] = useState('_self');

  useEffect(() => {
    (async () => {
      const [rMenus, rPages] = await Promise.all([
        fetch('/api/admin/menus', { cache: 'no-store' }),
        fetch('/api/admin/pages?page=1&limit=1000', { cache: 'no-store' }),
      ]);
      const menusJson = await rMenus.json();
      const pagesJson = await rPages.json();
      setMenus(Array.isArray(menusJson) ? menusJson : []);
      setPages(Array.isArray(pagesJson?.items) ? pagesJson.items : []);
    })();
  }, []);

  useEffect(() => {
    const found = menus.find((m) => m.key === key);
    setItems(normalizeItems(found?.items || []));
  }, [key, menus]);

  const tree = useMemo(() => buildTree(items), [items]);

  const keyOptions = useMemo(() => {
    const builtIns = ['header', 'footer'];
    return Array.from(new Set([...(menus || []).map((m) => m.key), ...builtIns]));
  }, [menus]);

  useEffect(() => {
    if (!childParentId && tree.length) setChildParentId(tree[0].id);
    if (childParentId && !tree.some((p) => p.id === childParentId)) {
      setChildParentId(tree[0]?.id || '');
    }
  }, [tree, childParentId]);

  function addParent() {
    const label = newParentLabel.trim();
    if (!label) return;
    const parent = {
      id: uid('parent'),
      label,
      url: newParentUrl.trim(),
      target: newParentTarget,
      type: 'custom',
      parentId: null,
      order: tree.length,
    };
    setItems((prev) => [...prev, parent]);
    setNewParentLabel('');
    setNewParentUrl('');
    setNewParentTarget('_self');
    setChildParentId(parent.id);
  }

  function addParentFromPage() {
    if (!selectedParentPageId) return;
    const page = pages.find((p) => String(p._id) === String(selectedParentPageId));
    if (!page) return;

    const parent = {
      id: uid('parent'),
      label: String(page.title || page.slug || 'Untitled').trim(),
      url: `/${String(page.slug || '').replace(/^\//, '')}`,
      target: '_self',
      type: 'page',
      parentId: null,
      order: tree.length,
    };

    setItems((prev) => [...prev, parent]);
    setSelectedParentPageId('');
    setChildParentId(parent.id);
  }

  function addChild() {
    const label = newChildLabel.trim();
    if (!label || !childParentId) return;
    const siblings = items.filter((x) => x.parentId === childParentId);
    const child = {
      id: uid('child'),
      label,
      url: newChildUrl.trim(),
      target: newChildTarget,
      type: 'custom',
      parentId: childParentId,
      order: siblings.length,
    };
    setItems((prev) => [...prev, child]);
    setNewChildLabel('');
    setNewChildUrl('');
    setNewChildTarget('_self');
  }

  function addChildFromPage() {
    if (!selectedChildPageId || !childParentId) return;
    const page = pages.find((p) => String(p._id) === String(selectedChildPageId));
    if (!page) return;

    const siblings = items.filter((x) => x.parentId === childParentId);
    const child = {
      id: uid('child'),
      label: String(page.title || page.slug || 'Untitled').trim(),
      url: `/${String(page.slug || '').replace(/^\//, '')}`,
      target: '_self',
      type: 'page',
      parentId: childParentId,
      order: siblings.length,
    };

    setItems((prev) => [...prev, child]);
    setSelectedChildPageId('');
  }

  function updateItem(id, patch) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              ...patch,
              target:
                Object.prototype.hasOwnProperty.call(patch, 'target')
                  ? normalizeTarget(patch.target)
                  : it.target,
            }
          : it
      )
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((it) => it.id !== id && it.parentId !== id));
  }

  function moveChild(parentId, from, to) {
    const parent = tree.find((p) => p.id === parentId);
    if (!parent) return;
    const children = [...(parent.children || [])];
    if (from < 0 || to < 0 || from >= children.length || to >= children.length) return;
    const [moved] = children.splice(from, 1);
    children.splice(to, 0, moved);

    setItems((prev) => {
      const next = prev.map((it) => ({ ...it }));
      children.forEach((child, idx) => {
        const target = next.find((x) => x.id === child.id);
        if (target) target.order = idx;
      });
      return next;
    });
  }

  function onDragEnd(result) {
    if (!result.destination) return;
    const parents = [...tree];
    const [moved] = parents.splice(result.source.index, 1);
    parents.splice(result.destination.index, 0, moved);
    const flat = flattenTree(parents);
    setItems(flat);
  }

  async function save() {
    const payloadItems = flattenTree(tree);
    const r = await fetch('/api/admin/menus', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ key, items: payloadItems }),
    });
    if (!r.ok) return toast.error('Save failed');
    toast.success('Menu saved');
    const refreshed = await (await fetch('/api/admin/menus', { cache: 'no-store' })).json();
    setMenus(Array.isArray(refreshed) ? refreshed : []);
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold mb-2">Choose Menu</h3>
        <div className="flex gap-2 items-center">
          <label className="label m-0">Menu Key</label>
          <select className="input" value={key} onChange={(e) => setKey(e.target.value)}>
            {keyOptions.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Or type new key e.g. sidebar"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <button className="button button--primary ml-auto" onClick={save}>
            Save Menu
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-2">Add Parent Item</h3>
        <div className="mb-3 grid grid-cols-1 md:grid-cols-5 gap-2">
          <select
            className="input md:col-span-4"
            value={selectedParentPageId}
            onChange={(e) => setSelectedParentPageId(e.target.value)}
          >
            <option value="">Select page to add as parent link</option>
            {pages.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title || p.slug} (/{p.slug})
              </option>
            ))}
          </select>
          <button className="button button--secondary" onClick={addParentFromPage}>
            Add Parent Page
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <input
            className="input"
            placeholder="Label"
            value={newParentLabel}
            onChange={(e) => setNewParentLabel(e.target.value)}
          />
          <input
            className="input md:col-span-2"
            placeholder="Optional URL (leave blank for no link)"
            value={newParentUrl}
            onChange={(e) => setNewParentUrl(e.target.value)}
          />
          <select
            className="input"
            value={newParentTarget}
            onChange={(e) => setNewParentTarget(normalizeTarget(e.target.value))}
          >
            <option value="_self">Same tab</option>
            <option value="_blank">New tab</option>
          </select>
        </div>
        <div className="text-right mt-2">
          <button className="button button--secondary" onClick={addParent}>
            Add Parent
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-2">Add Child Item</h3>
        <div className="mb-3 grid grid-cols-1 md:grid-cols-5 gap-2">
          <select
            className="input"
            value={childParentId}
            onChange={(e) => setChildParentId(e.target.value)}
          >
            <option value="">Select parent</option>
            {tree.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.label || '(untitled parent)'}
              </option>
            ))}
          </select>
          <select
            className="input md:col-span-3"
            value={selectedChildPageId}
            onChange={(e) => setSelectedChildPageId(e.target.value)}
          >
            <option value="">Select page to add as child link</option>
            {pages.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title || p.slug} (/{p.slug})
              </option>
            ))}
          </select>
          <button className="button button--secondary" onClick={addChildFromPage}>
            Add Child Page
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <select
            className="input"
            value={childParentId}
            onChange={(e) => setChildParentId(e.target.value)}
          >
            <option value="">Select parent</option>
            {tree.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.label || '(untitled parent)'}
              </option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Child Label"
            value={newChildLabel}
            onChange={(e) => setNewChildLabel(e.target.value)}
          />
          <input
            className="input md:col-span-2"
            placeholder="Optional URL (leave blank for no link)"
            value={newChildUrl}
            onChange={(e) => setNewChildUrl(e.target.value)}
          />
          <select
            className="input"
            value={newChildTarget}
            onChange={(e) => setNewChildTarget(normalizeTarget(e.target.value))}
          >
            <option value="_self">Same tab</option>
            <option value="_blank">New tab</option>
          </select>
        </div>
        <div className="text-right mt-2">
          <button className="button button--secondary" onClick={addChild}>
            Add Child
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-2">Menu Structure</h3>
        <p className="text-sm text-gray-600 mb-3">
          Drag parents to reorder. Use arrows to reorder child items.
        </p>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="menu-parents">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3"
              >
                {tree.map((parent, pIdx) => (
                  <Draggable key={parent.id} draggableId={parent.id} index={pIdx}>
                    {(prov) => (
                      <li
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className="rounded-xl border bg-white shadow-sm p-3"
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                          <span
                            {...prov.dragHandleProps}
                            className="cursor-grab select-none px-2 py-1 border rounded-md text-xs w-fit"
                            title="Drag to reorder"
                          >
                            ⇅
                          </span>
                          <input
                            className="input flex-1"
                            value={parent.label || ''}
                            placeholder="Parent label"
                            onChange={(e) => updateItem(parent.id, { label: e.target.value })}
                          />
                          <input
                            className="input flex-1"
                            value={parent.url || ''}
                            placeholder="Optional URL"
                            onChange={(e) => updateItem(parent.id, { url: e.target.value })}
                          />
                          <select
                            className="input w-full md:w-32"
                            value={normalizeTarget(parent.target)}
                            onChange={(e) =>
                              updateItem(parent.id, { target: normalizeTarget(e.target.value) })
                            }
                          >
                            <option value="_self">_self</option>
                            <option value="_blank">_blank</option>
                          </select>
                          <button
                            className="button button--tertiary"
                            onClick={() => removeItem(parent.id)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-3 ml-2 pl-3 border-l-2 border-gray-100 space-y-2">
                          {parent.children.length === 0 && (
                            <p className="text-xs text-gray-500">No children</p>
                          )}
                          {parent.children.map((child, cIdx) => (
                            <div
                              key={child.id}
                              className="flex flex-col gap-2 md:flex-row md:items-center"
                            >
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  className="button button--tertiary text-[10px] px-2 py-1"
                                  disabled={cIdx === 0}
                                  onClick={() => moveChild(parent.id, cIdx, cIdx - 1)}
                                >
                                  ↑
                                </button>
                                <button
                                  type="button"
                                  className="button button--tertiary text-[10px] px-2 py-1"
                                  disabled={cIdx === parent.children.length - 1}
                                  onClick={() => moveChild(parent.id, cIdx, cIdx + 1)}
                                >
                                  ↓
                                </button>
                              </div>
                              <input
                                className="input flex-1"
                                value={child.label || ''}
                                placeholder="Child label"
                                onChange={(e) =>
                                  updateItem(child.id, { label: e.target.value })
                                }
                              />
                              <input
                                className="input flex-1"
                                value={child.url || ''}
                                placeholder="Optional URL"
                                onChange={(e) =>
                                  updateItem(child.id, { url: e.target.value })
                                }
                              />
                              <select
                                className="input w-full md:w-32"
                                value={normalizeTarget(child.target)}
                                onChange={(e) =>
                                  updateItem(child.id, {
                                    target: normalizeTarget(e.target.value),
                                  })
                                }
                              >
                                <option value="_self">_self</option>
                                <option value="_blank">_blank</option>
                              </select>
                              <button
                                className="button button--tertiary"
                                onClick={() => removeItem(child.id)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex justify-end mt-4">
          <button className="button button--primary" onClick={save}>
            Save Menu
          </button>
        </div>
      </div>
    </div>
  );
}
