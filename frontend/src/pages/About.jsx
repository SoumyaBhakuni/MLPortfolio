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

      <div className="p-6 sm:p-8 border-b border-white/10 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Engineering Practical Machine Learning Workflows
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-zinc-400 leading-relaxed">
            Built as part of the Machine Learning internship at Happieloop Technologies (10 July – 9
            August 2026), this platform combines standalone Python implementations, saved model
            artifacts, Flask API blueprints, and interactive React visualizations across ten core
            assignments.
          </p>
        </div>

        {/* 01. Overview & 02. Objective / Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
              01 // OVERVIEW
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Centralizes ten end-to-end machine learning laboratory modules inside a unified
              Swiss-brutalist React interface backed by Flask API endpoints, saved model weights,
              and reproducible Python pipelines.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Bridge standalone ML experimentation with interactive web inspection so each model&apos;s
              data assumptions, algorithmic mechanics, evaluation metrics, and live predictions can
              be audited transparently in one workspace.
            </p>
          </div>
        </div>

        {/* 03. Dataset Description, 04. Algorithm Explanation & 05. Workflow / Methodology */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              03 // DATASET DESCRIPTION & SOURCES
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Spans tabular datasets, text corpora, image/digit matrices, and time-series data
              across Tasks 01–10—combining standard ML datasets, external/domain files, and
              seeded synthetic demonstrations where noted per lab.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // ALGORITHMIC & SYSTEM ARCHITECTURE
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Pairs React 19 + Vite + Tailwind CSS clients with Flask blueprints served via
              Gunicorn, delegating statistical, classical ML, neural, and time-series computations
              to dedicated backend endpoints.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Each lab follows a consistent contract: validate user parameters, query its{' '}
              <span className="text-white">/api/taskXX/*</span> route, surface evaluation metrics and
              visualizations, and document dataset provenance and limitations.
            </p>
          </div>
        </div>

        {/* 08. Platform Stack & Lab Summary Metrics */}
        <div className="space-y-2 pt-1">
          <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
            08 // SYSTEM METRICS & CORE STACK
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="ML LABS" value="10" subtext="Tasks 01 to 10" accent="#22D3EE" />
            <MetricCard label="BACKEND" value="FLASK" subtext="Gunicorn WSGI" accent="#10B981" />
            <MetricCard label="FRONTEND" value="REACT" subtext="Vite + Tailwind" accent="#F59E0B" />
            <MetricCard label="REPORTING" value="LATEX" subtext="Industrial Report" accent="#A855F7" />
          </div>
        </div>
      </div>

      {/* 06 & 07 // Interactive Navigation & Capability Matrix */}
      <div className="border-b border-white/10">
        <div className="px-6 sm:px-8 pt-6 font-mono text-[10px] uppercase tracking-wider text-cyan-400">
          06 & 07 // SKILL GROUPS & INTERACTIVE LAB DIRECTORY
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
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
      </div>

      {/* 09. Key Findings & 10. Conclusion */}
      <div className="p-6 sm:p-8 border-b border-white/10 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            09 // KEY FINDINGS
          </div>
          <p className="font-mono text-xs text-zinc-300 leading-relaxed">
            Standardizing report structure, metric cards, loading/error states, and synthetic-data
            disclosures across all ten labs makes model trade-offs—interpretability vs.
            nonlinearity, variance vs. bias, and stationarity—easier to compare side by side.
          </p>
        </div>

        <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
            10 // CONCLUSION
          </div>
          <p className="font-mono text-xs text-zinc-300 leading-relaxed">
            The laboratory demonstrates an end-to-end engineering workflow from data preparation and
            model training to interactive API-driven inspection and formal internship reporting.
          </p>
        </div>
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