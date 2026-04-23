'use client';
import { useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageUploader({ value, onChange, token, label = 'Gambar' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('File harus berupa gambar'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Ukuran maksimum 5MB'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd,
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Upload gagal');
      onChange(data.url);
      toast.success('Gambar berhasil diupload');
    } catch (e) {
      toast.error(e.message);
    } finally { setUploading(false); }
  }

  return (
    <div>
      <div className="flex gap-3 items-start">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-choco-cream border border-choco-cream shrink-0">
          {value ? (
            <>
              <img src={value} alt="preview" className="w-full h-full object-cover"/>
              <button type="button" onClick={() => onChange('')} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600" aria-label="Hapus"><X size={12}/></button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-choco-milk text-xs">No image</div>
          )}
        </div>
        <div className="flex-1">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0])} />
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 bg-choco-dark text-choco-cream hover:bg-choco-milk px-4 py-2 rounded-full text-sm disabled:opacity-60">
            {uploading ? <Loader2 size={14} className="animate-spin"/> : <Upload size={14}/>} {uploading ? 'Mengupload...' : 'Upload gambar'}
          </button>
          <p className="text-xs text-choco-milk mt-2">Format: JPG/PNG/WebP, maks 5MB. Atau tempel URL di bawah.</p>
          <input type="url" value={value || ''} onChange={e => onChange(e.target.value)} placeholder="https://..." className="mt-2 w-full px-3 py-2 rounded-lg border border-choco-cream focus:border-choco-gold focus:outline-none text-sm"/>
        </div>
      </div>
    </div>
  );
}
