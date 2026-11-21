import { useEffect, useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import ProjectCard from '../components/ProjectCard';
import { ML_LABS } from '../data/projects';
import { fetchTasks } from '../services/api';

const CATEGORIES = [
  'ALL',
  'DATA FOUNDATION',
  'SUPERVISED',
  'UNSUPERVISED',
  'DEEP LEARNING',
  'TIME SERIES',
];

export default function Projects() {
  const [labs, setLabs] = useState(ML_LABS);
  const [category, setCategory] = useState('ALL');
  const [query, setQuery] = useState('');
  const [apiSynced, setApiSynced] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchTasks()
      .then((apiTasks) => {
        if (!mounted || !Array.isArray(apiTasks) || apiTasks.length === 0) return;
        const mapById = Object.fromEntries(apiTasks.map((t) => [t.id, t]));
        setLabs((prev) =>
          prev.map((lab) => {
            const rawEndpoint = mapById[lab.id]?.endpoint;
            const normalizedEndpoint = rawEndpoint
              ? rawEndpoint.startsWith('/api')
                ? rawEndpoint
                : `/api${rawEndpoint.startsWith('/') ? rawEndpoint : `/${rawEndpoint}`}`
              : lab.endpoint;

            return {
              ...lab,
              status: mapById[lab.id]?.status || lab.status,
              endpoint: normalizedEndpoint,
            };
          })
        );
        setApiSynced(true);
      })
      .catch(() => {
        if (mounted) setApiSynced(false);
      });
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

  const activeCategoryCount = new Set(labs.map((l) => l.category)).size;
  const readyCount = labs.filter(
    (l) => String(l.status || '').toLowerCase() === 'ready' || String(l.status || '').toLowerCase() === 'active'
  ).length;

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="02"
        title="MACHINE_LEARNING_LABORATORY_INDEX"
        rightLabel={`${visibleLabs.length} / ${labs.length} MODULES`}
        accent="#10B981"
      />

      <div className="p-6 sm:p-8 border-b border-white/10 space-y-6">
        {/* 01. Overview & 02. Objective / Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              01 // OVERVIEW
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Central directory for all <span className="text-white">{labs.length}</span>{' '}
              interactive Machine Learning lab modules, syncing live task statuses and{' '}
              <span className="text-white">/api/taskXX/*</span> endpoint routes from the Flask
              registry while providing category and keyword filtering.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Enable fast discovery, side-by-side comparison, and direct launch across classical
              tabular models, unsupervised clustering/PCA, neural networks, and time-series
              forecasting labs.
            </p>
          </div>
        </div>

        {/* 03. Catalog Metadata, 04. Registry & Filter Mechanics & 05. Workflow / Methodology */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              03 // CATALOG METADATA & SCOPE
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Combines local metadata in <span className="text-white">ML_LABS</span> (module name,
              category, algorithm, dataset, and route path) with live backend task status from{' '}
              <span className="text-white">fetchTasks()</span>.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // FILTERING & REGISTRY SYNC
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Applies case-insensitive substring matching across{' '}
              <span className="text-white">displayName</span>,{' '}
              <span className="text-white">algorithm</span>, and{' '}
              <span className="text-white">dataset</span> composed with paradigm category filtering,
              falling back cleanly to static lab definitions if the API is offline.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Select a paradigm chip (<span className="text-white">SUPERVISED</span>,{' '}
              <span className="text-white">UNSUPERVISED</span>,{' '}
              <span className="text-white">DEEP LEARNING</span>,{' '}
              <span className="text-white">TIME SERIES</span>) or type a keyword, then open any{' '}
              <span className="text-white">ProjectCard</span> to inspect its interactive lab.
            </p>
          </div>
        </div>

        {/* 08. Index Metrics */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            08 // REGISTRY & FILTER METRICS
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 border border-white/10 bg-white/[0.02]">
              <div className="text-[10px] text-zinc-400">TOTAL LABS</div>
              <div className="text-white text-base font-bold mt-1">{labs.length}</div>
            </div>
            <div className="p-3 border border-white/10 bg-white/[0.02]">
              <div className="text-[10px] text-zinc-400">VISIBLE MATCHES</div>
              <div className="text-emerald-400 text-base font-bold mt-1">{visibleLabs.length}</div>
            </div>
            <div className="p-3 border border-white/10 bg-white/[0.02]">
              <div className="text-[10px] text-zinc-400">PARADIGM DOMAINS</div>
              <div className="text-cyan-400 text-base font-bold mt-1">{activeCategoryCount}</div>
            </div>
            <div className="p-3 border border-white/10 bg-white/[0.02]">
              <div className="text-[10px] text-zinc-400">BACKEND SYNC</div>
              <div className="text-amber-300 text-base font-bold mt-1">
                {apiSynced ? `LIVE (${readyCount || labs.length})` : 'LOCAL_FALLBACK'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 06. Interactive Demo — Category & Search Filter Controls */}
      <div className="p-4 sm:p-6 border-b border-white/10 space-y-3">
        <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
          06 // INTERACTIVE DEMO — PARADIGM & KEYWORD FILTERING
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter algorithm or dataset..."
              className="px-3 py-1.5 bg-white/[0.02] border border-white/15 focus:border-cyan-400 outline-none font-mono text-xs text-white placeholder:text-zinc-600 w-full sm:w-64"
            />
            {(category !== 'ALL' || query.trim() !== '') && (
              <button
                type="button"
                onClick={() => {
                  setCategory('ALL');
                  setQuery('');
                }}
                className="px-2.5 py-1.5 border border-white/15 font-mono text-[11px] text-zinc-300 hover:border-amber-400 hover:text-amber-200 cursor-pointer shrink-0"
              >
                RESET
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 07. Visualizations — Module Card Grid */}
      <div className="p-4 sm:p-6 border-b border-white/10 space-y-4">
        <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
          07 // VISUALIZATIONS — LABORATORY MODULE MATRIX
        </div>

        {visibleLabs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleLabs.map((lab) => (
              <ProjectCard key={lab.id} lab={lab} />
            ))}
          </div>
        ) : (
          <div className="p-8 border border-white/10 bg-white/[0.02] text-center font-mono text-xs text-zinc-400 space-y-3">
            <div>
              No laboratory modules match category <span className="text-white">{category}</span>
              {query.trim() ? (
                <>
                  {' '}
                  and query <span className="text-white">&quot;{query.trim()}&quot;</span>
                </>
              ) : null}
              .
            </div>
            <button
              type="button"
              onClick={() => {
                setCategory('ALL');
                setQuery('');
              }}
              className="px-3.5 py-1.5 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/10 cursor-pointer"
            >
              CLEAR_FILTERS
            </button>
          </div>
        )}
      </div>

      {/* 09. Key Findings & 10. Conclusion */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            09 // KEY FINDINGS
          </div>
          <p className="font-mono text-xs text-zinc-300 leading-relaxed">
            Organizing the ten assignments across five modeling paradigms with graceful offline
            fallback keeps the laboratory index responsive even when backend workers are cold or
            unavailable, while avoiding duplicate <span className="text-white">/api/api</span>{' '}
            endpoint prefixes during live sync.
          </p>
        </div>

        <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
            10 // CONCLUSION
          </div>
          <p className="font-mono text-xs text-zinc-300 leading-relaxed">
            The laboratory index serves as a unified entry point for navigating, filtering, and
            launching every ML task in the portfolio.
          </p>
        </div>
      </div>
    </div>
  );
}