import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function ProjectCard({ lab }) {
  return (
    <article className="p-5 border border-white/10 bg-white/[0.015] hover:bg-white/[0.03] transition-colors flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-bold" style={{ color: lab.accent }}>
            TASK_{lab.code}
          </span>
          <span className="font-mono text-[10px] px-2 py-0.5 border border-white/15 text-zinc-300">
            {lab.status}
          </span>
        </div>

        <h3 className="font-mono text-sm font-bold text-white leading-snug">
          {lab.displayName}
        </h3>
        <p className="mt-1 font-mono text-[11px] text-zinc-400">{lab.algorithm}</p>
        <p className="mt-1 font-mono text-[10px] text-zinc-500">{lab.dataset}</p>

        <p className="mt-3 text-xs text-zinc-400 leading-relaxed">{lab.summary}</p>
      </div>

      <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-zinc-500 truncate">{lab.endpoint}</span>
        <Link
          to={lab.route}
          className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-white hover:text-cyan-300 transition-colors shrink-0"
        >
          OPEN LAB
          <ArrowUpRight className="w-3.5 h-3.5" style={{ color: lab.accent }} />
        </Link>
      </div>
    </article>
  );
}