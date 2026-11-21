import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import MetricCard from '../components/MetricCard';
import { ML_LABS } from '../data/projects';

const CREDENTIAL_ASSETS = [
  {
    id: 'offer-letter',
    code: 'DOC_01',
    title: 'INTERNSHIP_OFFER_LETTER',
    file: '/Offer-Letter.jpeg',
    accent: '#22D3EE',
    aspectClass: 'aspect-[3/4] max-w-md mx-auto',
    summary: 'Official internship offer record for the Happieloop Technologies training term.',
  },
  {
    id: 'certificate',
    code: 'DOC_02',
    title: 'INTERNSHIP_COMPLETION_CERTIFICATE',
    file: '/Certificate.jpeg',
    accent: '#10B981',
    aspectClass: 'aspect-[4/3] max-w-2xl mx-auto',
    summary: 'Completion certificate verifying the 10 July – 9 August 2026 ML internship.',
  },
];

const TASK_LIST_DOC = {
  code: 'DOC_03',
  title: 'OFFICIAL_INTERNSHIP_TASK_LIST',
  subtitle: 'Machine Learning-1.pdf — Assigned Program Tasks & Scope',
  file: '/Machine Learning-1.pdf',
  accent: '#F59E0B',
  summary:
    'Official internship task list received for the Happieloop Technologies program (10 July – 9 August 2026). Use the page flipper, length selector, or full-screen mode below.',
};

const HEIGHT_MODES = [
  { id: 'MD', label: '500PX', px: 500 },
  { id: 'LG', label: '720PX', px: 720 },
  { id: 'XL', label: '920PX', px: 920 },
];

function TaskListPdfFlipper({ doc }) {
  const containerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [heightPx, setHeightPx] = useState(500);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      } else {
        setIsFullscreen(document.fullscreenElement === containerRef.current);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } catch {
        // Fallback overlay remains active
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
      } catch {
        // Ignore if not in native fullscreen
      }
    }
  };

  const goToPage = (targetPage) => {
    const safePage = Math.max(1, Math.floor(Number(targetPage) || 1));
    setPage(safePage);
    setPageInput(String(safePage));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    goToPage(pageInput);
  };

  const viewerSrc = `${doc.file}#page=${page}&view=FitH&toolbar=1&navpanes=0`;

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#070709] flex flex-col justify-between p-3 sm:p-5'
          : 'border border-white/10 bg-[#070709] flex flex-col justify-between'
      }
    >
      <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.015] flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: doc.accent }}>
            {doc.code} // {doc.title}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{doc.subtitle}</h3>
          <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{doc.summary}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/15 hover:border-amber-400 font-mono text-[11px] text-zinc-200 hover:text-amber-300 transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>EXIT_FULL_SCREEN</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>FULL_SCREEN</span>
              </>
            )}
          </button>

          <a
            href={doc.file}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/15 hover:border-cyan-400 font-mono text-[11px] text-zinc-200 hover:text-cyan-300 transition-colors"
          >
            <span>OPEN_PDF</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-2.5 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page of task list PDF"
            className="inline-flex items-center gap-1 px-2.5 py-1 border border-white/15 text-zinc-200 hover:border-cyan-400 hover:text-cyan-300 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>PREV_PAGE</span>
          </button>

          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            aria-label="Next page of task list PDF"
            className="inline-flex items-center gap-1 px-2.5 py-1 border border-white/15 text-zinc-200 hover:border-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <span>NEXT_PAGE</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {!isFullscreen && (
            <div className="ml-2 flex items-center gap-1">
              <span className="text-[10px] text-zinc-500 hidden sm:inline">LENGTH:</span>
              {HEIGHT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setHeightPx(mode.px)}
                  className={`px-2 py-1 border text-[10px] transition-colors cursor-pointer ${
                    heightPx === mode.px
                      ? 'border-cyan-400 bg-cyan-400/15 text-cyan-200 font-semibold'
                      : 'border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400">PAGE</span>
          <input
            type="number"
            min={1}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            aria-label="Page number for task list PDF"
            className="w-16 px-2 py-1 bg-[#0A0A0C] border border-white/15 focus:border-cyan-400 outline-none text-center text-xs text-white"
          />
          <button
            type="submit"
            className="px-2.5 py-1 border border-white/15 hover:border-amber-400 text-[11px] text-zinc-300 hover:text-amber-300 cursor-pointer"
          >
            FLIP
          </button>
        </form>
      </div>

      <div
        key={`tasklist-page-${page}-${isFullscreen ? 'fs' : heightPx}`}
        style={{ height: isFullscreen ? 'calc(100vh - 155px)' : `${heightPx}px` }}
        className="relative w-full bg-[#090A0D] overflow-hidden transition-[height] duration-200"
      >
        <iframe
          src={viewerSrc}
          title={`${doc.title} - Page ${page}`}
          className="w-full h-full border-0"
        />

        <div className="pointer-events-none absolute top-3 right-3 px-2.5 py-1 bg-[#0A0A0C]/90 border border-white/15 font-mono text-[10px] text-zinc-300 flex items-center gap-1.5">
          <FileText className="w-3 h-3 text-amber-400" />
          <span>
            {doc.file} · P.{page}
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-zinc-500">
        <span>USE PREV_PAGE / NEXT_PAGE TO FLIP TASK LIST</span>
        <a href={doc.file} download className="text-zinc-400 hover:text-white underline">
          DOWNLOAD_FILE
        </a>
      </div>
    </div>
  );
}

export default function Internship() {
  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="03"
        title="HAPPIELOOP_TECHNOLOGIES_INTERNSHIP"
        rightLabel="10 JULY – 9 AUGUST 2026"
        accent="#F59E0B"
      />

      <div className="p-6 sm:p-8 border-b border-white/10 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Machine Learning Internship — Happieloop Technologies
          </h1>
          <p className="max-w-3xl text-sm sm:text-base text-zinc-400 leading-relaxed">
            During the training program from 10 July to 9 August 2026, ten structured Machine
            Learning assignments were completed, covering exploratory data analysis, regression,
            image classification, clustering, decision trees, Naive Bayes, PCA, neural networks,
            ARIMA forecasting, and support vector machines.
          </p>
        </div>

        {/* 01. Overview & 02. Objective / Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              01 // OVERVIEW
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Documents the four-week Machine Learning internship at{' '}
              <span className="text-white">Happieloop Technologies</span> (10 July – 9 August
              2026), pairing the official task list (<span className="text-white">Machine Learning-1.pdf</span>)
              and ten completed lab modules with official internship records (
              <span className="text-white">Offer-Letter.jpeg</span> and{' '}
              <span className="text-white">Certificate.jpeg</span>).
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Provide a structured record of program scope, received task specifications, completed
              assignments, API endpoints, and credential artifacts so reviewers can verify both
              technical execution and internship milestones in one place.
            </p>
          </div>
        </div>

        {/* 03. Program Artifacts & Datasets, 04. Engineering Scope & 05. Workflow / Methodology */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              03 // ARTIFACTS & LAB COVERAGE
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Includes the received task list (<span className="text-white">Machine Learning-1.pdf</span>),
              ten lab implementations (<span className="text-white">ML_LABS</span>), Flask API
              routes, presentation/report deliverables, and public credential assets (
              <span className="text-white">Offer-Letter.jpeg</span> and{' '}
              <span className="text-white">Certificate.jpeg</span>).
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // ENGINEERING & REPORTING SCOPE
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Each assignment spans Python modeling, backend inference endpoints, interactive React
              visualizations, and standardized academic report documentation.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Flip through the received task list PDF and inspect internship credentials below, or
              jump directly into any of the ten completed tasks via{' '}
              <span className="text-white">OPEN</span> to test live inputs, metrics, and
              visualizations.
            </p>
          </div>
        </div>

        {/* 08. Program Metrics */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
            08 // INTERNSHIP & DELIVERABLE METRICS
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="DURATION" value="10 Jul – 9 Aug" subtext="2026 Training Term" accent="#F59E0B" />
            <MetricCard label="ASSIGNMENTS" value="10" subtext="End-to-End Labs" accent="#22D3EE" />
            <MetricCard label="API ROUTES" value="10" subtext="Flask Blueprints" accent="#10B981" />
            <MetricCard label="DELIVERABLES" value="FULL-STACK" subtext="Code + Report + PPT" accent="#A855F7" />
          </div>
        </div>
      </div>

      {/* 06 & 07 // Task List PDF, Credentials & Completed Assignment Checklist */}
      <div className="p-6 sm:p-8 border-b border-white/10 space-y-6">
        <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
          06 & 07 // RECEIVED TASK LIST, INTERNSHIP CREDENTIALS & ASSIGNMENT CHECKLIST
        </div>

        <TaskListPdfFlipper doc={TASK_LIST_DOC} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {CREDENTIAL_ASSETS.map((doc) => (
            <div
              key={doc.id}
              className={`${
                doc.id === 'offer-letter' ? 'lg:col-span-5' : 'lg:col-span-7'
              } p-4 border border-white/10 bg-white/[0.02] space-y-3`}
            >
              <div className="flex items-center justify-between gap-2 font-mono text-xs">
                <span className="font-bold" style={{ color: doc.accent }}>
                  {doc.code} — {doc.title}
                </span>
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 border border-white/15 hover:border-cyan-400 text-[11px] text-zinc-200 hover:text-cyan-300"
                >
                  OPEN_ASSET
                </a>
              </div>
              <p className="font-mono text-[11px] text-zinc-400">{doc.summary}</p>
              <div className="border border-white/10 bg-[#070709] p-2">
                <div className={`${doc.aspectClass} w-full overflow-hidden`}>
                  <img
                    src={doc.file}
                    alt={doc.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-mono text-xs font-bold text-amber-400 uppercase pt-2">
          COMPLETED_ASSIGNMENT_CHECKLIST ({ML_LABS.length})
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

      {/* 09. Key Findings & 10. Conclusion */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            09 // KEY FINDINGS
          </div>
          <p className="font-mono text-xs text-zinc-300 leading-relaxed">
            Completing all ten labs across supervised, unsupervised, neural, and time-series
            workflows established end-to-end familiarity with model evaluation, API integration, and
            structured reporting within a focused four-week term.
          </p>
        </div>

        <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
            10 // CONCLUSION
          </div>
          <p className="font-mono text-xs text-zinc-300 leading-relaxed">
            The Happieloop Technologies internship milestones, received task list, credentials, and
            ten interactive lab modules are consolidated here as a complete record of the program.
          </p>
        </div>
      </div>
    </div>
  );
}