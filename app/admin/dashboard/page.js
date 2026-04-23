'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Package, FileText, Store, Star, Plus, Edit, Trash2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

const TABS = [
  { key: 'products', label: 'Produk', icon: Package },
  { key: 'articles', label: 'Artikel', icon: FileText },
  { key: 'branches', label: 'Cabang', icon: Store },
  { key: 'testimonials', label: 'Testimoni', icon: Star },
];

const FIELDS = {
  products: [
    { key: 'name', label: 'Nama produk', type: 'text', required: true },
    { key: 'slug', label: 'Slug (otomatis jika kosong)', type: 'text' },
    { key: 'category', label: 'Kategori (slug)', type: 'text', required: true, hint: 'cake, brownies, tiramisu, mini-cheese-cake, cheese-pie, snack, snack-tradisional, bread' },
    { key: 'price', label: 'Harga (Rp)', type: 'number', required: true },
    { key: 'image', label: 'URL Gambar', type: 'url', required: true },
    { key: 'description', label: 'Deskripsi', type: 'textarea' },
    { key: 'featured', label: 'Featured (unggulan)', type: 'checkbox' },
    { key: 'active', label: 'Aktif', type: 'checkbox' },
  ],
  articles: [
    { key: 'title', label: 'Judul', type: 'text', required: true },
    { key: 'slug', label: 'Slug (otomatis)', type: 'text' },
    { key: 'category', label: 'Kategori', type: 'text' },
    { key: 'thumbnail', label: 'URL Thumbnail', type: 'url' },
    { key: 'excerpt', label: 'Ringkasan', type: 'textarea' },
    { key: 'content', label: 'Konten', type: 'textarea', rows: 8 },
    { key: 'meta_title', label: 'Meta Title (SEO)', type: 'text' },
    { key: 'meta_description', label: 'Meta Description (SEO)', type: 'textarea' },
    { key: 'published', label: 'Publish', type: 'checkbox' },
  ],
  branches: [
    { key: 'name', label: 'Nama cabang', type: 'text', required: true },
    { key: 'address', label: 'Alamat', type: 'textarea', required: true },
    { key: 'hours', label: 'Jam operasional', type: 'text' },
    { key: 'whatsapp', label: 'WhatsApp (format: 6285...)', type: 'text' },
    { key: 'mapsUrl', label: 'Link Google Maps', type: 'url' },
    { key: 'lat', label: 'Latitude', type: 'number' },
    { key: 'lng', label: 'Longitude', type: 'number' },
  ],
  testimonials: [
    { key: 'name', label: 'Nama', type: 'text', required: true },
    { key: 'role', label: 'Profesi / Role', type: 'text' },
    { key: 'message', label: 'Pesan', type: 'textarea', required: true },
    { key: 'image', label: 'URL Foto', type: 'url' },
    { key: 'active', label: 'Aktif', type: 'checkbox' },
  ],
};

export default function Dashboard() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [tab, setTab] = useState('products');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // null | {} new | object edit
  const [form, setForm] = useState({});

  useEffect(() => {
    const t = localStorage.getItem('choco_token');
    if (!t) { router.push('/admin'); return; }
    setToken(t);
    setEmail(localStorage.getItem('choco_email') || '');
  }, [router]);

  useEffect(() => { if (token) load(); /* eslint-disable-next-line */ }, [token, tab]);

  async function apiCall(method, path, body) {
    const r = await fetch(`/api/${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Error');
    return data;
  }

  async function load() {
    setLoading(true);
    try {
      const { data } = await apiCall('GET', `admin/${tab}`);
      setItems(data || []);
    } catch (e) { toast.error(e.message); if (e.message === 'Unauthorized') logout(); }
    finally { setLoading(false); }
  }

  function logout() {
    localStorage.removeItem('choco_token');
    localStorage.removeItem('choco_email');
    router.push('/admin');
  }

  function openNew() { setForm({}); setEditing({}); }
  function openEdit(item) { setForm({ ...item }); setEditing(item); }
  function close() { setEditing(null); setForm({}); }

  async function save() {
    try {
      const payload = { ...form };
      if (payload.price) payload.price = Number(payload.price);
      if (payload.lat) payload.lat = Number(payload.lat);
      if (payload.lng) payload.lng = Number(payload.lng);
      if (editing?.id) await apiCall('PUT', `admin/${tab}/${editing.id}`, payload);
      else await apiCall('POST', `admin/${tab}`, payload);
      toast.success('Tersimpan');
      close(); load();
    } catch (e) { toast.error(e.message); }
  }

  async function remove(id) {
    if (!confirm('Yakin hapus item ini?')) return;
    try { await apiCall('DELETE', `admin/${tab}/${id}`); toast.success('Dihapus'); load(); }
    catch (e) { toast.error(e.message); }
  }

  if (!token) return null;

  const fields = FIELDS[tab] || [];

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <header className="bg-choco-dark text-choco-cream">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-choco-gold text-choco-dark font-display font-bold flex items-center justify-center">C</span>
            <div className="font-display text-lg">Admin Chocolicious</div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-choco-cream/70 hidden md:inline">{email}</span>
            <button onClick={logout} className="flex items-center gap-2 text-sm bg-choco-milk/30 hover:bg-choco-milk/50 px-4 py-2 rounded-full transition"><LogOut size={14}/> Keluar</button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={()=>setTab(t.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition whitespace-nowrap ${tab===t.key ? 'bg-choco-dark text-choco-cream' : 'bg-white border border-choco-cream text-choco-dark hover:border-choco-gold'}`}><Icon size={16}/>{t.label}</button>
            );
          })}
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-choco-cream overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-choco-cream">
            <h2 className="font-display text-xl text-choco-dark">Kelola {TABS.find(t=>t.key===tab)?.label}</h2>
            <button onClick={openNew} className="btn-gold text-sm py-2"><Plus size={16}/> Tambah</button>
          </div>
          {loading ? (
            <div className="p-10 text-center text-choco-milk">Memuat...</div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-choco-milk">Belum ada data. Klik “Tambah” untuk memulai.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-choco-cream/50 text-choco-dark text-left">
                  <tr>
                    <th className="px-4 py-3">Preview</th>
                    <th className="px-4 py-3">Nama / Judul</th>
                    <th className="px-4 py-3">Detail</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.id} className="border-t border-choco-cream/60 hover:bg-choco-cream/20">
                      <td className="px-4 py-3">
                        {(it.image || it.thumbnail) ? <img src={it.image || it.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover"/> : <div className="w-12 h-12 rounded-lg bg-choco-cream"/>}
                      </td>
                      <td className="px-4 py-3 font-medium text-choco-dark">{it.name || it.title}</td>
                      <td className="px-4 py-3 text-choco-milk">
                        {tab==='products' && <span>{it.category} • Rp {Number(it.price||0).toLocaleString('id-ID')}</span>}
                        {tab==='articles' && <span>{it.category} {it.published ? <span className="text-green-600">• Published</span> : <span className="text-red-600">• Draft</span>}</span>}
                        {tab==='branches' && <span className="line-clamp-1">{it.address}</span>}
                        {tab==='testimonials' && <span>{it.role}</span>}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={()=>openEdit(it)} className="inline-flex items-center gap-1 text-choco-dark hover:text-choco-gold px-2"><Edit size={14}/></button>
                        <button onClick={()=>remove(it.id)} className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 px-2"><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-choco-cream">
              <h3 className="font-display text-xl text-choco-dark">{editing?.id ? 'Edit' : 'Tambah'} {TABS.find(t=>t.key===tab)?.label}</h3>
              <button onClick={close} className="p-1 hover:bg-choco-cream rounded"><X/></button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {fields.map(f => (
                <div key={f.key}>
                  <label className="text-sm font-medium text-choco-dark">{f.label}{f.required && <span className="text-red-500"> *</span>}</label>
                  {f.type === 'textarea' ? (
                    <textarea rows={f.rows || 3} value={form[f.key] ?? ''} onChange={e=>setForm({...form, [f.key]: e.target.value})} className="mt-1 w-full px-3 py-2 rounded-lg border border-choco-cream focus:border-choco-gold focus:outline-none"/>
                  ) : f.type === 'checkbox' ? (
                    <label className="mt-1 flex items-center gap-2 text-sm text-choco-milk">
                      <input type="checkbox" checked={!!form[f.key]} onChange={e=>setForm({...form, [f.key]: e.target.checked})} className="w-4 h-4 accent-choco-gold"/> {form[f.key] ? 'Ya' : 'Tidak'}
                    </label>
                  ) : (
                    <input type={f.type} value={form[f.key] ?? ''} onChange={e=>setForm({...form, [f.key]: e.target.value})} className="mt-1 w-full px-3 py-2 rounded-lg border border-choco-cream focus:border-choco-gold focus:outline-none"/>
                  )}
                  {f.hint && <p className="text-xs text-choco-milk mt-1">{f.hint}</p>}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 p-5 border-t border-choco-cream">
              <button onClick={close} className="px-4 py-2 rounded-full text-choco-dark hover:bg-choco-cream">Batal</button>
              <button onClick={save} className="btn-gold"><Check size={16}/> Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
