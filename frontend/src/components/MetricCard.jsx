export default function MetricCard({ label, value, subtext = '', accent = '#22D3EE' }) {
  return (
    <div className="p-3.5 border border-white/10 bg-white/[0.02]">
      <div className="font-mono text-[10px] text-zinc-500 uppercase">{label}</div>
      <div className="mt-1 font-mono text-lg sm:text-xl font-bold" style={{ color: accent }}>
        {value}
      </div>
      {subtext && <div className="mt-0.5 font-mono text-[10px] text-zinc-400">{subtext}</div>}
    </div>
  );
}