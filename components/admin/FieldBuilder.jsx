// components/admin/FieldBuilder.jsx
'use client';

import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

// Sortable wrapper that exposes handle props to children
function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // children is a render-prop: we pass handle props into the header
  return children({ setNodeRef, attributes, listeners, style });
}

export default function FieldBuilder({
  template,
  data,
  onChange,
  activeSection,
  setActiveSection,
}) {
  const sections = Array.isArray(template) ? template : [];

  const secData = (key) => data?.[key] || {};

  // DnD sensors with little distance threshold
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  function updateField(sectionKey, name, value) {
    onChange((prev) => ({
      ...(prev || {}),
      [sectionKey]: {
        ...(prev?.[sectionKey] || {}),
        [name]: value,
      },
    }));
  }

  function addRepeaterItem(sectionKey, fieldName, defaults = {}) {
    onChange((prev) => {
      const sec = prev?.[sectionKey] || {};
      const arr = Array.isArray(sec[fieldName]) ? sec[fieldName] : [];
      return {
        ...(prev || {}),
        [sectionKey]: {
          ...sec,
          [fieldName]: [...arr, defaults],
        },
      };
    });
  }

  function updateRepeaterItem(sectionKey, fieldName, index, patch) {
    onChange((prev) => {
      const sec = prev?.[sectionKey] || {};
      const arr = Array.isArray(sec[fieldName]) ? [...sec[fieldName]] : [];
      arr[index] = { ...(arr[index] || {}), ...patch };
      return {
        ...(prev || {}),
        [sectionKey]: {
          ...sec,
          [fieldName]: arr,
        },
      };
    });
  }

  function removeRepeaterItem(sectionKey, fieldName, index) {
    onChange((prev) => {
      const sec = prev?.[sectionKey] || {};
      const arr = Array.isArray(sec[fieldName]) ? [...sec[fieldName]] : [];
      arr.splice(index, 1);
      return {
        ...(prev || {}),
        [sectionKey]: {
          ...sec,
          [fieldName]: arr,
        },
      };
    });
  }

  // Move item up/down programmatically (for arrow buttons)
  function moveRepeaterItem(sectionKey, fieldName, from, to) {
    if (from === to || from < 0 || to < 0) return;
    onChange((prev) => {
      const sec = prev?.[sectionKey] || {};
      const arr = Array.isArray(sec[fieldName]) ? [...sec[fieldName]] : [];
      if (from >= arr.length || to >= arr.length) return prev;
      const reordered = arrayMove(arr, from, to);
      return {
        ...(prev || {}),
        [sectionKey]: {
          ...sec,
          [fieldName]: reordered,
        },
      };
    });
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {sections.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActiveSection(s.key)}
            className={`px-3 py-1 rounded-t-md text-sm ${
              activeSection === s.key
                ? 'bg-primary text-white'
                : 'bg-grey text-black'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Active section fields */}
      {sections.map((section) => {
        if (section.key !== activeSection) return null;
        const current = secData(section.key);

        return (
          <div key={section.key} className="space-y-3">
            {section.fields.map((field) => {
              const fVal = current[field.name];

              // TEXT
              if (field.type === 'text') {
                return (
                  <div key={field.name}>
                    <label className="label">{field.label}</label>
                    <input
                      className="input w-full"
                      value={fVal || ''}
                      onChange={(e) =>
                        updateField(section.key, field.name, e.target.value)
                      }
                    />
                  </div>
                );
              }

              // TEXTAREA
              if (field.type === 'textarea') {
                return (
                  <div key={field.name}>
                    <label className="label">{field.label}</label>
                    <textarea
                      className="input w-full"
                      rows={field.rows || 4}
                      value={fVal || ''}
                      onChange={(e) =>
                        updateField(section.key, field.name, e.target.value)
                      }
                    />
                  </div>
                );
              }

              // RICH (CKEditor)
              if (field.type === 'rich') {
                return (
                  <div key={field.name}>
                    <label className="label">{field.label}</label>
                    <RichTextEditor
                      value={fVal || ''}
                      onChange={(val) =>
                        updateField(section.key, field.name, val)
                      }
                    />
                  </div>
                );
              }

              // IMAGE
              if (field.type === 'image') {
                return (
                  <div key={field.name}>
                    <label className="label">{field.label}</label>
                    <CloudinaryUpload
                      value={fVal || ''}
                      onChange={(url) =>
                        updateField(section.key, field.name, url)
                      }
                    />
                  </div>
                );
              }

              // CHECKBOX
              if (field.type === 'checkbox') {
                return (
                  <label key={field.name} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!fVal}
                      onChange={(e) =>
                        updateField(section.key, field.name, e.target.checked)
                      }
                    />
                    <span className="text-sm">{field.label}</span>
                  </label>
                );
              }

              // REPEATER
              if (field.type === 'repeater') {
                const items = Array.isArray(fVal) ? fVal : [];

                const handleDragEnd = (event) => {
                  const { active, over } = event;
                  if (!over || active.id === over.id) return;

                  const oldIndex = active.id;
                  const newIndex = over.id;

                  onChange((prev) => {
                    const sec = prev?.[section.key] || {};
                    const arr = Array.isArray(sec[field.name]) ? [...sec[field.name]] : [];
                    if (
                      oldIndex < 0 ||
                      newIndex < 0 ||
                      oldIndex >= arr.length ||
                      newIndex >= arr.length
                    ) {
                      return prev;
                    }
                    const reordered = arrayMove(arr, oldIndex, newIndex);
                    return {
                      ...(prev || {}),
                      [section.key]: {
                        ...sec,
                        [field.name]: reordered,
                      },
                    };
                  });
                };

                return (
                  <div key={field.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="label mb-0">{field.label}</label>
                      <button
                        type="button"
                        className="button button--secondary text-xs"
                        onClick={() =>
                          addRepeaterItem(section.key, field.name, field.defaultItem || {})
                        }
                      >
                        + Add
                      </button>
                    </div>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={items.map((_, idx) => idx)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {items.map((item, idx) => (
                            <SortableItem id={idx} key={idx}>
                              {({ setNodeRef, attributes, listeners, style }) => (
                                <div
                                  ref={setNodeRef}
                                  style={style}
                                  className="border rounded-xl p-3 space-y-2 bg-white"
                                >
                                  {/* HEADER: drag + up/down + remove */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold">
                                      {/* Drag handle ONLY – rest of card is normal */}
                                      <button
                                        type="button"
                                        className="w-6 h-6 flex items-center justify-center rounded-full border cursor-grab active:cursor-grabbing"
                                        {...attributes}
                                        {...listeners}
                                        aria-label="Drag to reorder"
                                      >
                                        ☰
                                      </button>
                                      <span>Item {idx + 1}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {/* Move up */}
                                      <button
                                        type="button"
                                        className="button button--tertiary text-[10px] px-2 py-1"
                                        disabled={idx === 0}
                                        onClick={() =>
                                          moveRepeaterItem(
                                            section.key,
                                            field.name,
                                            idx,
                                            idx - 1
                                          )
                                        }
                                      >
                                        ↑
                                      </button>
                                      {/* Move down */}
                                      <button
                                        type="button"
                                        className="button button--tertiary text-[10px] px-2 py-1"
                                        disabled={idx === items.length - 1}
                                        onClick={() =>
                                          moveRepeaterItem(
                                            section.key,
                                            field.name,
                                            idx,
                                            idx + 1
                                          )
                                        }
                                      >
                                        ↓
                                      </button>
                                      {/* Remove */}
                                      <button
                                        type="button"
                                        className="button button--tertiary text-xs"
                                        onClick={() =>
                                          removeRepeaterItem(section.key, field.name, idx)
                                        }
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>

                                  {/* Inner fields */}
                                  {(field.of || []).map((sub) => {
                                    const subVal = item?.[sub.name] ?? '';
                                    const updateSub = (value) =>
                                      updateRepeaterItem(section.key, field.name, idx, {
                                        [sub.name]: value,
                                      });

                                    if (sub.type === 'text') {
                                      return (
                                        <div key={sub.name}>
                                          <label className="label">{sub.label}</label>
                                          <input
                                            className="input w-full"
                                            value={subVal}
                                            onChange={(e) => updateSub(e.target.value)}
                                          />
                                        </div>
                                      );
                                    }

                                    if (sub.type === 'image') {
                                      return (
                                        <div key={sub.name}>
                                          <label className="label">{sub.label}</label>
                                          <CloudinaryUpload
                                            value={subVal}
                                            onChange={(url) => updateSub(url)}
                                          />
                                        </div>
                                      );
                                    }

                                    if (sub.type === 'textarea') {
                                      return (
                                        <div key={sub.name}>
                                          <label className="label">{sub.label}</label>
                                          <textarea
                                            className="input w-full"
                                            rows={sub.rows || 3}
                                            value={subVal}
                                            onChange={(e) => updateSub(e.target.value)}
                                          />
                                        </div>
                                      );
                                    }

                                    if (sub.type === 'rich') {
                                      return (
                                        <div key={sub.name}>
                                          <label className="label">{sub.label}</label>
                                          <RichTextEditor
                                            value={subVal}
                                            onChange={(html) => updateSub(html)}
                                          />
                                        </div>
                                      );
                                    }

                                    return null;
                                  })}
                                </div>
                              )}
                            </SortableItem>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                );
              }

              return null;
            })}
          </div>
        );
      })}
    </div>
  );
}