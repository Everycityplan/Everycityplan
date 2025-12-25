import Link from 'next/link';

export default function PlanCard({ plan }) {
  return (
    <div className="card-premium overflow-hidden hover:-translate-y-1 hover:shadow-2xl transition relative">
      <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${plan.image})` }} />
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-midnight">{plan.title}</h3>
          <span className="text-sm px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold">{plan.duration}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          {plan.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-slate-100">{tag}</span>
          ))}
        </div>
        <div className="relative">
          <div className="blur-sm select-none bg-white/60 rounded-xl p-4 text-slate-500 text-sm min-h-[120px]">
            {plan.preview}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-midnight/60 bg-white/80 px-3 py-1 rounded-full shadow">Members see full plan</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href={`/plan/${plan.id}`} className="button-primary w-full text-center">See example plan</Link>
          <Link href="/signup" className="w-full px-5 py-3 rounded-full border border-accent/40 text-accent font-semibold hover:-translate-y-0.5 transition bg-white/70">Create my account</Link>
        </div>
      </div>
    </div>
  );
}
