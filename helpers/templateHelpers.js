// helpers/templateHelpers.js

// Build an empty data shape given a template definition
export function buildEmptyData(template) {
  const data = {};
  const sections = Array.isArray(template) ? template : [];

  for (const section of sections) {
    const sec = {};
    for (const field of section.fields || []) {
      if (field.type === 'repeater') {
        sec[field.name] = [];
      } else {
        sec[field.name] = '';
      }
    }
    data[section.key] = sec;
  }
  return data;
}

// Merge whatever is in DB onto the full template shape
export function mergeData(template, existing) {
  const sections = Array.isArray(template) ? template : [];
  const base = buildEmptyData(sections);
  const result = { ...base };

  for (const section of sections) {
    const key = section.key;
    const existingSec = (existing && existing[key]) || {};
    result[key] = { ...base[key], ...existingSec };
  }

  return result;
}