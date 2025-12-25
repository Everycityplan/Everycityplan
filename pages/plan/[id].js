import Layout from '@/components/Layout';
import { mockPlans } from '@/data/mockPlans';
import { getUserFromRequest } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PlanPage({ plan, user }) {
  const [openSections, setOpenSections] = useState([0, 1]);
  const router = useRouter();
  const watermarkSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <text x="0" y="40" fill="rgba(15,23,42,0.05)" font-size="26" font-family="Inter, Arial" transform="rotate(-30 80 80)">
        everycityplan • ${user?.email || 'member'}
      </text>
    </svg>
  `);

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
      const tooltip = document.createElement('div');
      tooltip.innerText = 'Screenshotting is discouraged to protect this custom content.';
      tooltip.className = 'fixed z-50 px-3 py-2 bg-black text-white text-xs rounded-full shadow-lg';
      tooltip.style.left = `${e.clientX}px`;
      tooltip.style.top = `${e.clientY}px`;
      document.body.appendChild(tooltip);
      setTimeout(() => tooltip.remove(), 1600);
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  if (!plan) {
    return (
      <Layout>
        <div className="card-premium p-8">Plan not found.</div>
      </Layout>
    );
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => {
      const exists = prev.includes(index);
      let next = exists ? prev.filter((i) => i !== index) : [...prev, index];
      // keep only 2 sections open to reduce screenshot coverage
      if (next.length > 2) next = next.slice(next.length - 2);
      return next;
    });
  };

  return (
    <Layout>
      <div className="relative card-premium p-8 md:p-12 overflow-hidden">
        {/* Watermark layer using repeating diagonal gradient and user-specific text */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: `url("data:image/svg+xml,${watermarkSvg}")`,
            backgroundSize: '320px 320px'
          }}
        />
        <div className="absolute inset-0 pointer-events-none opacity-40 grid-watermark" style={{ backgroundSize: '320px 320px' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent 0, transparent 140px, rgba(15,23,42,0.03) 140px, rgba(15,23,42,0.03) 280px)`
        }} />

        <div className="relative">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Private plan</p>
          <h1 className="text-4xl font-extrabold text-midnight">{plan.title}</h1>
          <p className="text-slate-600 mt-2">for {user.name} ({user.email}) • {plan.days} day itinerary</p>
          <p className="text-sm text-slate-500 mt-2">This custom plan is licensed only for your personal trip. Please don’t share or redistribute.</p>

          <div className="mt-8 space-y-4">
            {plan.sections.map((section, index) => (
              <div key={section.title} className="bg-white/70 border border-slate-100 rounded-2xl shadow-inner overflow-hidden">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Day {index + 1}</p>
                    <h3 className="text-xl font-bold text-midnight">{section.title}</h3>
                  </div>
                  <span className="text-sm font-semibold text-accent">{openSections.includes(index) ? 'Collapse' : 'Expand'}</span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out px-5 pb-5 space-y-3 ${openSections.includes(index) ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  {section.stops.map((stop) => (
                    <div key={stop} className="p-4 rounded-xl bg-slate-50/80 text-slate-700 shadow-sm">
                      {stop}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-sm text-slate-500">Tip: only a couple of days stay expanded to keep sharing screenshots less appealing.</div>
          <button
            onClick={() => router.push('/dashboard')}
            className="button-primary mt-6 inline-flex items-center gap-2"
          >
            ← Back to dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req, params }) {
  // Protect route and hydrate user for watermark
  const user = getUserFromRequest(req);
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }
  const plan = mockPlans.find((p) => p.id === params.id) || null;
  return { props: { plan, user } };
}
