import { Link } from 'react-router-dom';
import SectionHeading from '../components/SectionHeading';
import MetricCard from '../components/MetricCard';
import { ML_LABS } from '../data/projects';

export default function Internship() {
  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="03"
        title="HAPPIELOOP_TECHNOLOGIES_INTERNSHIP"
        rightLabel="10 JULY – 9 AUGUST 2026"
        accent="#F59E0B"
      />

      <div className="p-6 sm:p-8 border-b border-white/10 space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Machine Learning Internship — Happieloop Technologies
        </h1>
        <p className="max-w-3xl text-sm sm:text-base text-zinc-400 leading-relaxed">
          During the training program from 10 July to 9 August 2026, ten structured Machine
          Learning assignments were completed, covering exploratory data analysis, regression,
          image classification, clustering, decision trees, Naive Bayes, PCA, neural networks,
          ARIMA forecasting, and support vector machines.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <MetricCard label="DURATION" value="10 Jul – 9 Aug" subtext="2026 Training Term" accent="#F59E0B" />
          <MetricCard label="ASSIGNMENTS" value="10" subtext="End-to-End Labs" accent="#22D3EE" />
          <MetricCard label="API ROUTES" value="10" subtext="Flask Blueprints" accent="#10B981" />
          <MetricCard label="DELIVERABLES" value="FULL-STACK" subtext="Code + Report + PPT" accent="#A855F7" />
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <h2 className="font-mono text-xs font-bold text-amber-400 uppercase mb-4">
          COMPLETED_ASSIGNMENT_CHECKLIST
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ML_LABS.map((lab) => (
            <div
              key={lab.id}
              className="p-4 border border-white/10 bg-white/[0.015] flex items-center justify-between gap-4"
            >
              <div>
                <div className="font-mono text-xs font-bold" style={{ color: lab.accent }}>
                  TASK_{lab.code} — {lab.displayName}
                </div>
                <div className="font-mono text-[11px] text-zinc-400 mt-0.5">
                  {lab.algorithm} • {lab.dataset}
                </div>
              </div>
              <Link
                to={lab.route}
                className="px-3 py-1.5 border border-white/15 hover:border-cyan-400 font-mono text-[11px] text-zinc-200 hover:text-cyan-300 shrink-0"
              >
                OPEN
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}