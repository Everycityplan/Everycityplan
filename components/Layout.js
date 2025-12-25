import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-soft-gradient">
      <header className="flex items-center justify-between px-6 md:px-12 py-6">
        <Link href="/plans" className="text-2xl font-bold text-midnight tracking-tight">
          every<span className="text-accent">city</span>plan
        </Link>
        <nav className="flex gap-3 text-sm font-semibold">
          <Link href="/plans" className="px-3 py-2 rounded-full hover:bg-white/70">Plans</Link>
          <Link href="/dashboard" className="px-3 py-2 rounded-full hover:bg-white/70">Dashboard</Link>
          <Link href="/login" className="button-primary text-sm px-4 py-2">Login</Link>
        </nav>
      </header>
      <main className="px-6 md:px-12 pb-16">{children}</main>
      <footer className="px-6 md:px-12 py-6 text-sm text-slate-500">Crafted for modern travelers ✈️</footer>
    </div>
  );
}
