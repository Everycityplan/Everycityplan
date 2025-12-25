import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="card-premium max-w-md w-full p-8 shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Welcome back</p>
          <h1 className="text-3xl font-bold mt-3 mb-6">Login to your plans</h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Email</label>
              <input
                className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/80 focus:ring-2 focus:ring-accent"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Password</label>
              <input
                className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-3 bg-white/80 focus:ring-2 focus:ring-accent"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" className="button-primary w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-sm text-slate-600 mt-4 text-center">
            New here? <Link href="/signup" className="text-accent font-semibold">Create an account</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
