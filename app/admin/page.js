'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, LogIn } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('firstahmadthahir@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Login gagal');
      localStorage.setItem('choco_token', data.token);
      localStorage.setItem('choco_email', data.email);
      toast.success('Login berhasil. Mengarahkan ke dashboard...');
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-cream-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-full bg-choco-dark text-choco-gold items-center justify-center font-display font-bold text-2xl mb-3">C</div>
          <h1 className="font-display text-3xl text-choco-dark">Admin Chocolicious</h1>
          <p className="text-choco-milk text-sm mt-1">Masuk untuk mengelola konten website</p>
        </div>
        <form onSubmit={submit} className="bg-white rounded-3xl p-8 shadow-xl border border-choco-cream space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-choco-dark">Email</span>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-choco-milk" size={16}/>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full pl-10 pr-3 py-3 rounded-xl border border-choco-cream focus:border-choco-gold focus:outline-none"/>
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-choco-dark">Password</span>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-choco-milk" size={16}/>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-3 py-3 rounded-xl border border-choco-cream focus:border-choco-gold focus:outline-none"/>
            </div>
          </label>
          <button disabled={loading} className="w-full btn-gold justify-center disabled:opacity-60"><LogIn size={16}/>{loading ? 'Memproses...' : 'Login'}</button>
          <p className="text-xs text-choco-milk text-center pt-2">Default: <code className="bg-choco-cream px-2 py-0.5 rounded">chocolicious2026</code></p>
        </form>
      </div>
    </div>
  );
}
