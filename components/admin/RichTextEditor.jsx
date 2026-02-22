// components/admin/RichTextEditor.jsx
'use client';

import { useEffect, useState } from 'react';

export default function RichTextEditor({ value, onChange }) {
  const [CKEditorComponent, setCKEditorComponent] = useState(null);
  const [EditorClass, setEditorClass] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const [{ CKEditor }, ClassicEditorModule] = await Promise.all([
        import('@ckeditor/ckeditor5-react'),
        import('@ckeditor/ckeditor5-build-classic'),
      ]);

      if (!mounted) return;
      setCKEditorComponent(() => CKEditor);
      setEditorClass(() => ClassicEditorModule.default);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!CKEditorComponent || !EditorClass) {
    return (
      <div className="border rounded-md bg-white px-3 py-2 text-sm text-gray-500">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <CKEditorComponent
        editor={EditorClass}
        data={value || ''}
        onChange={(_, editor) => {
          const data = editor.getData();
          onChange?.(data);
        }}
        config={{
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'blockQuote',
            'undo',
            'redo',
          ],
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            ],
          },
        }}
      />
    </div>
  );
}
