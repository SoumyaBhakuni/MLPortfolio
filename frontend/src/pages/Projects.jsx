import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import { ML_LABS } from '../data/projects';
import { fetchTasks } from '../services/api';

const CATEGORIES = ['ALL', 'DATA FOUNDATION', 'SUPERVISED', 'UNSUPERVISED', 'DEEP LEARNING', 'TIME SERIES'];

export default function Projects() {
  const [labs, setLabs] = useState(ML_LABS);
  const [category, setCategory] = useState('ALL');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    fetchTasks()
      .then((apiTasks) => {
        if (!mounted || !Array.isArray(apiTasks) || apiTasks.length === 0) return;
        const mapById = Object.fromEntries(apiTasks.map((t) => [t.id, t]));
        setLabs((prev) =>
          prev.map((lab) => ({
            ...lab,
            status: mapById[lab.id]?.status || lab.status,
            endpoint: mapById[lab.id]?.endpoint ? `/api${mapById[lab.id].endpoint}` : lab.endpoint
          }))
        );
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const visibleLabs = labs.filter((lab) => {
    const matchesCategory = category === 'ALL' || lab.category.toUpperCase() === category;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      lab.displayName.toLowerCase().includes(q) ||
      lab.algorithm.toLowerCase().includes(q) ||
      lab.dataset.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="02"
        title="MACHINE_LEARNING_LABORATORY_INDEX"
        rightLabel={`${visibleLabs.length} / ${labs.length} MODULES`}
        accent="#10B981"
      />

      <div className="p-4 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-2.5 py-1 border transition-colors cursor-pointer ${
                category === cat
                  ? 'border-emerald-400 bg-emerald-400/15 text-emerald-200 font-semibold'
                  : 'border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter algorithm or dataset..."
          className="px-3 py-1.5 bg-white/[0.02] border border-white/15 focus:border-cyan-400 outline-none font-mono text-xs text-white placeholder:text-zinc-600 w-full sm:w-64"
        />
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleLabs.map((lab) => (
          <ProjectCard key={lab.id} lab={lab} />
        ))}
      </div>
    </div>
  );
}