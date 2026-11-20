import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import MetricCard from '../components/MetricCard';
import { SKILL_GROUPS } from '../data/projects';

export default function About() {
  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="01"
        title="ABOUT_&_ARCHITECTURE"
        rightLabel="ML PORTFOLIO — INTERACTIVE LABORATORY"
        accent="#22D3EE"
      />

      <div className="p-6 sm:p-8 border-b border-white/10 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Engineering Practical Machine Learning Workflows
        </h1>
        <p className="max-w-3xl text-sm sm:text-base text-zinc-400 leading-relaxed">
          Built as part of the Machine Learning internship at Happieloop Technologies (10 July – 9
          August 2026), this platform combines standalone Python implementations, saved model
          artifacts, Flask API blueprints, and interactive React visualizations across ten core
          assignments.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <MetricCard label="ML LABS" value="10" subtext="Tasks 01 to 10" accent="#22D3EE" />
          <MetricCard label="BACKEND" value="FLASK" subtext="Gunicorn WSGI" accent="#10B981" />
          <MetricCard label="FRONTEND" value="REACT" subtext="Vite + Tailwind" accent="#F59E0B" />
          <MetricCard label="REPORTING" value="LATEX" subtext="Industrial Report" accent="#A855F7" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-b border-white/10">
        {SKILL_GROUPS.map((group) => (
          <div key={group.title} className="p-6">
            <div className="font-mono text-xs font-bold mb-4" style={{ color: group.accent }}>
              {group.title}
            </div>
            <ul className="space-y-2 font-mono text-xs text-zinc-300">
              {group.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5" style={{ backgroundColor: group.accent }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <span className="text-zinc-400">Ready to inspect live ML experiments?</span>
        <Link
          to="/projects"
          className="px-4 py-2.5 bg-cyan-400 text-[#0A0A0C] font-bold hover:brightness-110 transition-all"
        >
          EXPLORE_ALL_10_PROJECTS -&gt;
        </Link>
      </div>
    </div>
  );
}