import Layout from '@/components/Layout';
import { mockPlans } from '@/data/mockPlans';
import { getUserFromRequest } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Dashboard({ user }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <Layout>
      <div className="card-premium p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Welcome</p>
            <h1 className="text-3xl font-extrabold text-midnight">{user.name}, your curated city blueprints await</h1>
            <p className="text-slate-600 mt-2">Unlock fresh itineraries, map pins, and concierge-grade notes.</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:border-accent hover:text-accent" disabled={loggingOut}>
            {loggingOut ? 'Leaving...' : 'Logout'}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {mockPlans.map((plan) => (
            <div key={plan.id} className="card-premium p-5 hover:-translate-y-1 hover:shadow-2xl transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-midnight">{plan.title}</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold">{plan.duration}</span>
              </div>
              <p className="text-sm text-slate-600">{plan.city} • {plan.tags.join(' • ')}</p>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-slate-500">{plan.days} day itinerary</div>
                <Link href={`/plan/${plan.id}`} className="button-primary text-sm px-4 py-2">Open plan</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  // Route protection example using the token cookie
  const user = getUserFromRequest(req);
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }
  return { props: { user } };
}
