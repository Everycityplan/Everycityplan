import Layout from '@/components/Layout';
import PlanCard from '@/components/PlanCard';
import { mockPlans } from '@/data/mockPlans';
import Link from 'next/link';

export default function PlansPage() {
  return (
    <Layout>
      <section className="relative overflow-hidden card-premium p-10 md:p-14">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-midnight/20 to-transparent" />
        <div className="relative max-w-3xl space-y-6 text-white drop-shadow-lg">
          <p className="uppercase text-sm tracking-[0.3em]">Members only</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Custom City Plans in Minutes</h1>
          <p className="text-lg text-slate-100">Ready-to-run itineraries, curated dining, pinned maps, and concierge tips that feel like a magazine spread.</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="px-4 py-2 rounded-full bg-white/15 border border-white/30">Restaurant shortlists & map pins</span>
            <span className="px-4 py-2 rounded-full bg-white/15 border border-white/30">Mood-based day plans</span>
            <span className="px-4 py-2 rounded-full bg-white/15 border border-white/30">Printable + offline friendly</span>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Link href="/signup" className="button-primary bg-white text-midnight shadow-2xl">Create my account</Link>
            <Link href="/login" className="px-6 py-3 rounded-full bg-transparent border border-white/60 text-white font-semibold hover:bg-white/10">Login to view plans</Link>
          </div>
        </div>
      </section>

      <section className="mt-12 grid md:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </section>
    </Layout>
  );
}
