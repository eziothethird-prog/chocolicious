'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef } from 'react';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Code } from 'lucide-react';
import { toast } from 'sonner';

export default function RichTextEditor({ value = '', onChange, token, placeholder = 'Tulis artikel...' }) {
  const fileRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { class: 'text-choco-gold underline' } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-xl my-4' } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: { attributes: { class: 'prose prose-sm md:prose-base max-w-none focus:outline-none min-h-[240px] px-4 py-3' } },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value || '', false);
    // eslint-disable-next-line
  }, [value]);

  if (!editor) return <div className="border border-choco-cream rounded-xl min-h-[240px]"/>;

  const Btn = ({ onClick, active, disabled, children, title }) => (
    <button type="button" onClick={onClick} disabled={disabled} title={title} className={`p-2 rounded-md hover:bg-choco-cream transition ${active ? 'bg-choco-cream text-choco-dark' : 'text-choco-milk'} disabled:opacity-40`}>{children}</button>
  );

  async function uploadImage(file) {
    if (!file || !token) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Upload gagal');
      editor.chain().focus().setImage({ src: data.url, alt: file.name }).run();
      toast.success('Gambar disisipkan');
    } catch (e) { toast.error(e.message); }
  }

  return (
    <div className="border border-choco-cream rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-choco-cream bg-[#FAF6EF] px-2 py-1">
        <Btn onClick={()=>editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={16}/></Btn>
        <Btn onClick={()=>editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={16}/></Btn>
        <span className="w-px h-5 bg-choco-cream mx-1"/>
        <Btn onClick={()=>editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading',{level:2})} title="H2"><Heading2 size={16}/></Btn>
        <Btn onClick={()=>editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading',{level:3})} title="H3"><Heading3 size={16}/></Btn>
        <span className="w-px h-5 bg-choco-cream mx-1"/>
        <Btn onClick={()=>editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><List size={16}/></Btn>
        <Btn onClick={()=>editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list"><ListOrdered size={16}/></Btn>
        <Btn onClick={()=>editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote"><Quote size={16}/></Btn>
        <Btn onClick={()=>editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code"><Code size={16}/></Btn>
        <span className="w-px h-5 bg-choco-cream mx-1"/>
        <Btn onClick={() => { const url = prompt('URL link:'); if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run(); }} active={editor.isActive('link')} title="Link"><LinkIcon size={16}/></Btn>
        <Btn onClick={() => fileRef.current?.click()} title="Insert image"><ImageIcon size={16}/></Btn>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => uploadImage(e.target.files?.[0])}/>
        <span className="ml-auto flex">
          <Btn onClick={()=>editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo size={16}/></Btn>
          <Btn onClick={()=>editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo size={16}/></Btn>
        </span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
