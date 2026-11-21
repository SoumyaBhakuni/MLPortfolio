import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  FileCheck2,
  FileText,
  Mail,
  Maximize2,
  Minimize2,
  Presentation,
  Sparkles,
  Terminal,
  X
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { ML_LABS, SKILL_GROUPS } from '../data/projects';
import { fetchTasks } from '../services/api';

const PDF_DOCUMENTS = [
  {
    id: 'presentation',
    code: 'DOC_01',
    title: 'INTERNSHIP_PRESENTATION_DECK',
    subtitle: 'Slides & Visual Walkthrough — Happieloop Technologies ML Track',
    file: '/Presentation.pdf',
    accent: '#22D3EE',
    icon: Presentation,
    description:
      'Flip through presentation slides covering the ten Machine Learning assignments, model architectures, evaluation outcomes, and full-stack Flask + React implementation.'
  },
  {
    id: 'report',
    code: 'DOC_02',
    title: 'INDUSTRIAL_TRAINING_REPORT',
    subtitle: 'Comprehensive Technical Report — Tasks 01 to 10',
    file: '/Report-File.pdf',
    accent: '#A855F7',
    icon: BookOpen,
    description:
      'Flip through the detailed internship report documenting problem formulations, dataset characteristics, experimental results, and system architecture.'
  }
];

const HEIGHT_MODES = [
  { id: 'MD', label: '500PX', px: 500 },
  { id: 'LG', label: '720PX', px: 720 },
  { id: 'XL', label: '920PX', px: 920 }
];

function PdfFlipViewer({ doc }) {
  const containerRef = useRef(null);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [flipDirection, setFlipDirection] = useState('next');
  const [heightPx, setHeightPx] = useState(500);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const IconComponent = doc.icon || FileText;

  useEffect(() => {
    const onFullscreenChange = () => {
      const active = document.fullscreenElement === containerRef.current;
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      } else {
        setIsFullscreen(active);
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
        // Fallback overlay state remains active
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

  const goToPage = (targetPage, direction = 'next') => {
    const safePage = Math.max(1, Math.floor(Number(targetPage) || 1));
    setFlipDirection(direction);
    setPage(safePage);
    setPageInput(String(safePage));
  };

  const handlePageInputSubmit = (e) => {
    e.preventDefault();
    goToPage(pageInput, Number(pageInput) >= page ? 'next' : 'prev');
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
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.015] flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: doc.accent }}>
            {doc.code} // {doc.title}
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">{doc.subtitle}</h3>
          <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{doc.description}</p>
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

      {/* Page-flipping & vertical length controls */}
      <div className="px-4 sm:px-5 py-2.5 border-b border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => goToPage(page - 1, 'prev')}
            disabled={page <= 1}
            aria-label={`Previous page of ${doc.title}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 border border-white/15 text-zinc-200 hover:border-cyan-400 hover:text-cyan-300 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>PREV_PAGE</span>
          </button>

          <button
            type="button"
            onClick={() => goToPage(page + 1, 'next')}
            aria-label={`Next page of ${doc.title}`}
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

        <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400">PAGE</span>
          <input
            type="number"
            min={1}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            aria-label={`Page number for ${doc.title}`}
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

      {/* Embedded PDF Viewport */}
      <div
        key={`${doc.id}-page-${page}-${flipDirection}-${isFullscreen ? 'fs' : heightPx}`}
        style={{ height: isFullscreen ? 'calc(100vh - 155px)' : `${heightPx}px` }}
        className="relative w-full bg-[#090A0D] overflow-hidden transition-[height] duration-200"
      >
        <iframe
          src={viewerSrc}
          title={`${doc.title} - Page ${page}`}
          className="w-full h-full border-0"
        />

        <div className="pointer-events-none absolute top-3 right-3 px-2.5 py-1 bg-[#0A0A0C]/90 border border-white/15 font-mono text-[10px] text-zinc-300 flex items-center gap-1.5">
          <IconComponent className="w-3 h-3" style={{ color: doc.accent }} />
          <span>
            {doc.file} · P.{page}
          </span>
        </div>
      </div>

      {/* Footer note */}
      <div className="px-4 sm:px-5 py-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-zinc-500">
        <span>USE PREV_PAGE / NEXT_PAGE TO FLIP VIEWPORT</span>
        <a href={doc.file} download className="text-zinc-400 hover:text-white underline">
          DOWNLOAD_FILE
        </a>
      </div>
    </div>
  );
}

function MultiColorScatterSVG({ compact = false }) {
  const setosaPoints = [
    [18, 72], [24, 66], [30, 76], [21, 61], [35, 68], [28, 58], [40, 63], [16, 68], [33, 73], [26, 70]
  ];
  const versicolorPoints = [
    [48, 48], [55, 42], [62, 52], [52, 38], [67, 45], [58, 56], [72, 39], [64, 49], [50, 45], [75, 44]
  ];
  const virginicaPoints = [
    [70, 26], [78, 20], [85, 29], [82, 16], [90, 23], [75, 31], [88, 18], [92, 27], [80, 24], [86, 14]
  ];

  return (
    <svg
      viewBox="0 0 110 86"
      className={compact ? 'w-28 h-16 overflow-visible' : 'w-full h-36 overflow-visible'}
      role="img"
      aria-label="Multi-color Iris scatter plot visualization"
    >
      <line x1="10" y1="78" x2="104" y2="78" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
      <line x1="10" y1="8" x2="10" y2="78" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
      <line x1="10" y1="54" x2="104" y2="54" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="10" y1="30" x2="104" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 2" />

      {setosaPoints.map(([cx, cy], idx) => (
        <circle key={`s-${idx}`} cx={cx} cy={cy} r="2.2" fill="#22D3EE" fillOpacity="0.9" />
      ))}
      {versicolorPoints.map(([cx, cy], idx) => (
        <circle key={`ve-${idx}`} cx={cx} cy={cy} r="2.2" fill="#10B981" fillOpacity="0.9" />
      ))}
      {virginicaPoints.map(([cx, cy], idx) => (
        <circle
          key={`vi-${idx}`}
          cx={cx}
          cy={cy}
          r="2.2"
          fill={idx % 2 === 0 ? '#F59E0B' : '#A855F7'}
          fillOpacity="0.92"
        />
      ))}
    </svg>
  );
}

function MultiColorRegressionSVG({ compact = false }) {
  const points = [
    [16, 68, '#22D3EE'],
    [25, 63, '#10B981'],
    [34, 54, '#22D3EE'],
    [43, 52, '#F59E0B'],
    [52, 41, '#10B981'],
    [61, 37, '#A855F7'],
    [70, 29, '#F59E0B'],
    [79, 25, '#10B981'],
    [88, 18, '#22D3EE'],
    [96, 13, '#A855F7']
  ];

  return (
    <svg
      viewBox="0 0 110 86"
      className={compact ? 'w-28 h-16 overflow-visible' : 'w-full h-36 overflow-visible'}
      role="img"
      aria-label="Multi-color linear regression fit plot"
    >
      <defs>
        <linearGradient id="regLineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="38%" stopColor="#10B981" />
          <stop offset="72%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>

      <line x1="10" y1="78" x2="104" y2="78" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
      <line x1="10" y1="8" x2="10" y2="78" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />

      {points.map(([cx, cy], idx) => {
        const fittedY = 72 - ((cx - 12) / 88) * 58;
        return (
          <line
            key={`res-${idx}`}
            x1={cx}
            y1={cy}
            x2={cx}
            y2={fittedY}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.6"
            strokeDasharray="1.5 1.5"
          />
        );
      })}

      <line x1="12" y1="72" x2="100" y2="14" stroke="url(#regLineGrad)" strokeWidth="1.8" />

      {points.map(([cx, cy, color], idx) => (
        <circle key={`pt-${idx}`} cx={cx} cy={cy} r="2.2" fill={color} />
      ))}
    </svg>
  );
}

function IridescentHeroSculpture() {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setTilt({ x: normX, y: normY });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[340px] lg:min-h-[460px] flex items-center justify-center overflow-hidden select-none"
    >
      <div
        className="pointer-events-none absolute w-72 h-72 rounded-full blur-[90px] opacity-30 transition-transform duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)',
          transform: `translate(${tilt.x * -24}px, ${tilt.y * -20}px)`
        }}
      />
      <div
        className="pointer-events-none absolute w-72 h-72 rounded-full blur-[95px] opacity-30 transition-transform duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, #F59E0B 0%, #A855F7 65%, transparent 80%)',
          transform: `translate(${tilt.x * 26 + 24}px, ${tilt.y * 18 - 12}px)`
        }}
      />

      <svg
        viewBox="0 0 600 460"
        className="w-full max-w-[580px] h-auto transition-transform duration-200 ease-out drop-shadow-[0_24px_60px_rgba(0,0,0,0.75)]"
        style={{
          transform: `perspective(900px) rotateY(${tilt.x * 8}deg) rotateX(${-tilt.y * 7}deg) translate3d(${tilt.x * 10}px, ${tilt.y * 8}px, 0)`
        }}
        role="img"
        aria-label="Iridescent multi-color 3D sculptural wave"
      >
        <defs>
          <linearGradient id="ribbonSpectrumMain" x1="5%" y1="15%" x2="95%" y2="85%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="22%" stopColor="#F59E0B" />
            <stop offset="48%" stopColor="#22D3EE" />
            <stop offset="74%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          <linearGradient id="ribbonHighlight" x1="100%" y1="10%" x2="0%" y2="90%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.95" />
            <stop offset="32%" stopColor="#FDE68A" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#6EE7B7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="ribbonDepthShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#090B10" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#06070A" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.45" />
          </linearGradient>

          <pattern id="latentGridDots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="rgba(255,255,255,0.16)" />
          </pattern>
        </defs>

        <rect x="230" y="70" width="240" height="220" fill="url(#latentGridDots)" opacity="0.65" />

        <path
          d="M 40 390 C 160 360, 230 220, 355 150 C 445 100, 525 140, 565 75"
          fill="none"
          stroke="url(#ribbonSpectrumMain)"
          strokeWidth="34"
          strokeLinecap="round"
          opacity="0.35"
        />
        <path
          d="M 185 375 C 255 315, 290 140, 395 105 C 485 75, 535 165, 455 245 C 385 315, 275 235, 345 155 C 405 88, 525 125, 575 45"
          fill="none"
          stroke="url(#ribbonSpectrumMain)"
          strokeWidth="44"
          strokeLinecap="round"
        />
        <path
          d="M 185 375 C 255 315, 290 140, 395 105 C 485 75, 535 165, 455 245 C 385 315, 275 235, 345 155 C 405 88, 525 125, 575 45"
          fill="none"
          stroke="url(#ribbonDepthShadow)"
          strokeWidth="44"
          strokeLinecap="round"
        />
        <path
          d="M 192 368 C 260 310, 295 145, 398 111 C 480 83, 526 166, 450 240 C 384 305, 282 232, 350 158 C 408 96, 522 130, 570 52"
          fill="none"
          stroke="url(#ribbonHighlight)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 215 395 C 310 340, 350 265, 445 275 C 515 282, 545 205, 585 165"
          fill="none"
          stroke="#22D3EE"
          strokeWidth="2.2"
          strokeOpacity="0.65"
        />
        <path
          d="M 235 408 C 325 355, 365 282, 460 292"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="1.6"
          strokeOpacity="0.7"
        />

        <g stroke="rgba(255,255,255,0.22)" strokeWidth="1">
          <line x1="472" y1="82" x2="472" y2="104" />
          <line x1="461" y1="93" x2="483" y2="93" />
          <line x1="145" y1="165" x2="145" y2="181" />
          <line x1="137" y1="173" x2="153" y2="173" />
        </g>
        <text
          x="488"
          y="116"
          fill="rgba(255,255,255,0.45)"
          fontSize="10"
          fontFamily="JetBrains Mono, monospace"
        >
          [LATENT_SPACE // 04]
        </text>
      </svg>
    </div>
  );
}

export default function Home() {
  const [labs, setLabs] = useState(ML_LABS);
  const [activeLabIndex, setActiveLabIndex] = useState(0);
  const [selectedLabModal, setSelectedLabModal] = useState(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    const linkId = 'ml-portfolio-google-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    fetchTasks()
      .then((apiTasks) => {
        if (!mounted || !Array.isArray(apiTasks) || apiTasks.length === 0) return;
        const statusById = Object.fromEntries(apiTasks.map((t) => [t.id, t.status]));
        setLabs((prev) =>
          prev.map((item) =>
            statusById[item.id] ? { ...item, status: statusById[item.id] } : item
          )
        );
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const primaryFeaturedLab = labs[activeLabIndex] || labs[0];
  const secondaryFeaturedLab = labs[(activeLabIndex + 1) % labs.length] || labs[1];

  const filteredLabs =
    activeCategoryFilter === 'ALL'
      ? labs
      : labs.filter((lab) => lab.category.toUpperCase() === activeCategoryFilter);

  const handleCopyEmail = async () => {
    const email = 'soumyabhakuni456@gmail.com';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      }
    } catch {
      // Clipboard fallback
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleCycleLabs = (direction) => {
    setActiveLabIndex((prev) => {
      if (direction === 'next') return (prev + 1) % labs.length;
      return (prev - 1 + labs.length) % labs.length;
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim()) return;
    setContactSent(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setContactSent(false), 3500);
  };

  const renderMiniChart = (chartType, compact = true) => {
    if (chartType === 'regression-line') {
      return <MultiColorRegressionSVG compact={compact} />;
    }
    return <MultiColorScatterSVG compact={compact} />;
  };

  return (
    <div className="relative z-10">
      <section id="top" className="max-w-[1440px] mx-auto border-x border-b border-white/10">
        <div className="flex items-center justify-between px-4 sm:px-8 pt-3 font-mono text-[11px] text-zinc-500">
          <span>[80, 19, 0]</span>
          <span>[04 / MULTI_SPECTRUM]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 px-4 sm:px-8 py-8 lg:py-14 lg:border-r border-white/10">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 border border-white/15 bg-white/[0.02] font-mono text-[11px] tracking-widest text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400" />
              INTERACTIVE MACHINE LEARNING LABORATORY
            </div>

            <h1 className="font-extrabold uppercase tracking-[-0.03em] leading-[0.98] text-4xl sm:text-6xl xl:text-[68px] text-white">
              EXPLORING
              <br />
              INTELLIGENCE
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 via-amber-400 to-purple-400 bg-clip-text text-transparent">
                THROUGH MACHINE
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 via-amber-300 to-purple-400 bg-clip-text text-transparent">
                LEARNING
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base sm:text-lg text-zinc-400 leading-relaxed">
              Building practical Machine Learning solutions through data exploration, predictive
              modelling, deep learning, and intelligent systems during the Happieloop Technologies
              internship (10 July – 9 August 2026).
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 font-mono text-xs sm:text-sm font-bold tracking-wider text-[#0A0A0C] bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)]"
              >
                Explore 10 Labs
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/internship"
                className="inline-flex items-center gap-2 px-5 py-3.5 font-mono text-xs sm:text-sm font-medium tracking-wider text-zinc-200 border border-white/15 hover:border-amber-400/60 hover:text-amber-300 bg-white/[0.02] transition-colors"
              >
                View Internship
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative px-2 sm:px-4 py-4 lg:py-8">
            <IridescentHeroSculpture />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 sm:px-8 py-2.5 border-t border-white/10 font-mono text-[11px] text-zinc-500">
          <span>[80, 19, 0]</span>
          <span>REACT + VITE + FLASK + SCIKIT-LEARN + STATSMODELS</span>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between min-h-[240px]">
            <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
              <span>CURRICULUM_INDEX</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCycleLabs('prev')}
                  aria-label="Previous featured lab"
                  className="p-1.5 border border-white/15 hover:border-cyan-400 text-zinc-300 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCycleLabs('next')}
                  aria-label="Next featured lab"
                  className="p-1.5 border border-white/15 hover:border-emerald-400 text-zinc-300 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="my-4">
              <div className="font-extrabold uppercase tracking-[-0.04em] leading-none text-5xl sm:text-6xl xl:text-7xl bg-gradient-to-r from-cyan-400/75 via-emerald-400/75 via-amber-400/75 to-purple-400/75 bg-clip-text text-transparent select-none">
                10 LABS
              </div>
              <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xs">
                Ten hands-on Machine Learning implementations spanning EDA, supervised models,
                clustering, dimensionality reduction, neural networks, and time series.
              </p>
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 pt-2 border-t border-white/10">
              <span>SHOWING_{primaryFeaturedLab.code}_&amp;_{secondaryFeaturedLab.code}</span>
              <button
                type="button"
                onClick={() => handleCycleLabs('next')}
                className="text-cyan-400 hover:underline cursor-pointer"
              >
                CYCLE_PAIR -&gt;
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 sm:p-7 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between group hover:bg-white/[0.02] transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-mono text-2xl font-bold text-cyan-400">
                  {primaryFeaturedLab.code}
                </span>
                <span className="px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase border border-emerald-400/40 text-emerald-300 bg-emerald-400/10">
                  {primaryFeaturedLab.status}
                </span>
              </div>

              <h2 className="font-mono text-base sm:text-lg font-bold tracking-tight text-white">
                {primaryFeaturedLab.title}
              </h2>
              <p className="mt-1 text-xs font-mono text-zinc-400">
                {primaryFeaturedLab.dataset}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px]">
                {primaryFeaturedLab.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 border border-white/10 text-zinc-300 bg-white/[0.02]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs text-zinc-400 line-clamp-2 max-w-[190px]">
                  {primaryFeaturedLab.summary}
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    to={primaryFeaturedLab.route}
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    LAUNCH_LAB
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedLabModal(primaryFeaturedLab)}
                    className="font-mono text-[11px] text-zinc-400 hover:text-white cursor-pointer"
                  >
                    SPEC
                  </button>
                </div>
              </div>

              <div className="shrink-0 bg-[#070709] border border-white/10 p-2">
                {renderMiniChart(primaryFeaturedLab.chartType, true)}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 sm:p-7 flex flex-col justify-between group hover:bg-white/[0.02] transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-mono text-2xl font-bold text-amber-400">
                  {secondaryFeaturedLab.code}
                </span>
                <span className="px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase border border-amber-400/40 text-amber-300 bg-amber-400/10">
                  {secondaryFeaturedLab.category}
                </span>
              </div>

              <h2 className="font-mono text-base sm:text-lg font-bold tracking-tight text-white">
                {secondaryFeaturedLab.title}
              </h2>
              <p className="mt-1 text-xs font-mono text-zinc-400">
                {secondaryFeaturedLab.algorithm}
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[11px] bg-white/[0.02] border border-white/10 p-2.5">
                {secondaryFeaturedLab.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-[10px] text-zinc-500">{m.label}</div>
                    <div className="font-semibold text-zinc-200">{m.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs text-zinc-400 line-clamp-2 max-w-[190px]">
                  {secondaryFeaturedLab.summary}
                </p>
                <div className="flex items-center gap-3">
                  <Link
                    to={secondaryFeaturedLab.route}
                    className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    LAUNCH_LAB
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedLabModal(secondaryFeaturedLab)}
                    className="font-mono text-[11px] text-zinc-400 hover:text-white cursor-pointer"
                  >
                    SPEC
                  </button>
                </div>
              </div>

              <div className="shrink-0 bg-[#070709] border border-white/10 p-2">
                {renderMiniChart(secondaryFeaturedLab.chartType, true)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
        <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between font-mono text-xs">
          <span className="text-cyan-400 font-semibold">01 // ABOUT &amp; TECHNICAL_STACK</span>
          <span className="text-zinc-500 hidden sm:inline">[ARCHITECTURE: REACT + FLASK + PYTHON_ML]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Bridging Statistical Rigor &amp; Interactive Web Engineering
            </h2>
            <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
              Each assignment is implemented as a standalone Python script, trained and saved where
              applicable, exposed through Flask blueprints on port 5000, and paired with a dedicated
              interactive route in React.
            </p>
            <div className="mt-5 flex items-center gap-4 font-mono text-xs">
              <Link to="/about" className="text-cyan-400 hover:underline">
                FULL_PROFILE -&gt;
              </Link>
              <Link to="/projects/eda" className="text-emerald-400 hover:underline inline-flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                OPEN_EDA_LAB
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {SKILL_GROUPS.map((group) => (
              <div key={group.title} className="p-6 flex flex-col justify-between">
                <div>
                  <div
                    className="font-mono text-xs font-bold tracking-wider mb-4"
                    style={{ color: group.accent }}
                  >
                    {group.title}
                  </div>
                  <ul className="space-y-2 font-mono text-xs text-zinc-300">
                    {group.items.map((skill) => (
                      <li key={skill} className="flex items-center gap-2">
                        <span
                          className="w-1.5 h-1.5 shrink-0"
                          style={{ backgroundColor: group.accent }}
                        />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 font-mono text-[10px] text-zinc-500">
                  {group.items.length} MODULES
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
        <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-xs">
            <span className="text-emerald-400 font-semibold">02 // ALL_10_MACHINE_LEARNING_LABS</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
            {['ALL', 'DATA FOUNDATION', 'SUPERVISED', 'UNSUPERVISED', 'DEEP LEARNING', 'TIME SERIES'].map(
              (cat) => {
                const active = activeCategoryFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-2.5 py-1 border transition-colors cursor-pointer ${
                      active
                        ? 'border-cyan-400 bg-cyan-400/15 text-cyan-200 font-semibold'
                        : 'border-white/10 text-zinc-400 hover:border-white/25 hover:text-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {filteredLabs.map((lab, idx) => (
            <article
              key={lab.id}
              className={`p-5 flex flex-col justify-between hover:bg-white/[0.025] transition-colors ${
                idx >= 5 ? 'md:border-t border-white/10' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-bold" style={{ color: lab.accent }}>
                    TASK_{lab.code}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 border border-white/10 text-zinc-400">
                    {lab.status}
                  </span>
                </div>

                <h3 className="font-mono text-sm font-bold text-white leading-snug">
                  {lab.displayName}
                </h3>
                <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {lab.summary}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  to={lab.route}
                  className="font-mono text-[10px] text-zinc-400 hover:text-cyan-300 truncate max-w-[125px]"
                >
                  {lab.route}
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedLabModal(lab)}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  SPEC
                  <ArrowUpRight className="w-3.5 h-3.5" style={{ color: lab.accent }} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Dedicated Presentation & Report Section with PDF Page-Flipping, Length & Full-Screen Support */}
      <section
        id="deliverables"
        className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90"
      >
        <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <span className="text-cyan-400 font-semibold">
            02.5 // PRESENTATION_&_REPORT_DECKS
          </span>
          <span className="text-zinc-500">[PDF_PAGE_FLIPPER // PRESENTATION.PDF + REPORT-FILE.PDF]</span>
        </div>

        <div className="p-6 sm:p-8 border-b border-white/10 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Internship Presentation &amp; Technical Report
          </h2>
          <p className="max-w-3xl text-sm sm:text-base text-zinc-400 leading-relaxed">
            Dedicated inspection space for both the presentation deck (
            <span className="text-white">Presentation.pdf</span>) and the full training report (
            <span className="text-white">Report-File.pdf</span>) with page-by-page navigation,
            adjustable vertical length, and full-screen viewing.
          </p>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {PDF_DOCUMENTS.map((doc) => (
            <PdfFlipViewer key={doc.id} doc={doc} />
          ))}
        </div>
      </section>

      <section id="internship" className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
        <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between font-mono text-xs">
          <span className="text-amber-400 font-semibold">03 // INTERNSHIP_&_CERTIFICATION</span>
          <span className="text-zinc-500">HAPPIELOOP_TECHNOLOGIES</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-amber-300 mb-2">
              <Award className="w-4 h-4" />
              INDUSTRIAL MACHINE LEARNING TRAINING (10 JULY – 9 AUGUST 2026)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Happieloop Technologies — Machine Learning Track
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl">
              Covers ten practical laboratory assignments across EDA, linear regression, image
              classification, K-means clustering, decision trees, Naive Bayes text classification,
              PCA, neural networks, ARIMA forecasting, and support vector machines.
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 border border-white/10 bg-white/[0.02]">
                <div className="text-[10px] text-zinc-500">LAB ASSIGNMENTS</div>
                <div className="text-lg font-bold text-cyan-400">10 / 10</div>
              </div>
              <div className="p-3 border border-white/10 bg-white/[0.02]">
                <div className="text-[10px] text-zinc-500">BACKEND SERVER</div>
                <div className="text-lg font-bold text-emerald-400">GUNICORN</div>
              </div>
              <div className="p-3 border border-white/10 bg-white/[0.02]">
                <div className="text-[10px] text-zinc-500">API LAYER</div>
                <div className="text-lg font-bold text-amber-400">FLASK REST</div>
              </div>
              <div className="p-3 border border-white/10 bg-white/[0.02]">
                <div className="text-[10px] text-zinc-500">DOCUMENTATION</div>
                <div className="text-lg font-bold text-purple-400">LATEX + PPTX</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-amber-500/[0.05] via-transparent to-purple-500/[0.05]">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-zinc-300 mb-3">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                COMPLETION CERTIFICATE RECORD
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Preview the structured internship completion summary and deliverable checklist for
                Happieloop Technologies.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCertificateModalOpen(true)}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 font-mono text-xs font-semibold tracking-wider text-amber-200 border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 transition-colors cursor-pointer"
            >
              INSPECT CERTIFICATE SUMMARY
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="max-w-[1440px] mx-auto border-x border-white/10 bg-[#0A0A0C]">
        <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between font-mono text-xs">
          <span className="text-purple-400 font-semibold">04 // CONTACT_&_CONNECT</span>
          <span className="text-zinc-500">[STATUS: READY]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Let&apos;s Discuss Machine Learning &amp; Intelligent Systems
              </h2>
              <p className="mt-3 text-sm text-zinc-400 max-w-md leading-relaxed">
                Explore all ten interactive laboratory routes, inspect API endpoints, or get in touch.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="px-3.5 py-2.5 border border-white/15 bg-white/[0.02] font-mono text-xs text-zinc-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>soumyabhakuni456@gmail.com</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 font-mono text-xs font-semibold border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/10 transition-colors cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedEmail ? 'COPIED' : 'COPY_EMAIL'}
                </button>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4 font-mono text-xs">
              <a
                href="https://github.com/SoumyaBhakuni"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-white/15 text-zinc-300 hover:border-white/40 hover:text-white transition-colors"
              >
                <FaGithub className="w-4 h-4" />
                GITHUB
              </a>
              <a
                href="https://www.linkedin.com/in/soumya-bhakuni-b080162b0"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-white/15 text-zinc-300 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors"
              >
                <FaLinkedin className="w-4 h-4" />
                LINKEDIN
              </a>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="lg:col-span-6 p-6 sm:p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1.5">YOUR_NAME</label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/15 focus:border-cyan-400 outline-none text-sm text-white placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1.5">EMAIL_ADDRESS</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/15 focus:border-cyan-400 outline-none text-sm text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-zinc-400 mb-1.5">MESSAGE_PAYLOAD</label>
              <textarea
                rows={3}
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Ask about any of the 10 ML labs or Flask API routes..."
                className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/15 focus:border-emerald-400 outline-none text-sm text-white placeholder:text-zinc-600 resize-none"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-bold tracking-wider text-[#0A0A0C] bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 hover:brightness-110 transition-all cursor-pointer"
              >
                TRANSMIT_MESSAGE
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {contactSent && (
                <span className="font-mono text-xs text-emerald-400">[DISPATCHED // LOGGED_LOCALLY]</span>
              )}
            </div>
          </form>
        </div>
      </section>

      {selectedLabModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedLabModal(null)}
        >
          <div
            className="w-full max-w-2xl bg-[#0D0E12] border border-white/15 p-6 sm:p-7 relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="font-mono text-xs" style={{ color: selectedLabModal.accent }}>
                  LAB_MODULE // TASK_{selectedLabModal.code}
                </div>
                <h3 className="mt-1 text-xl sm:text-2xl font-bold text-white">
                  {selectedLabModal.displayName}
                </h3>
                <p className="font-mono text-xs text-zinc-400 mt-1">
                  {selectedLabModal.algorithm} • {selectedLabModal.dataset}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLabModal(null)}
                aria-label="Close lab modal"
                className="p-2 border border-white/15 text-zinc-400 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-7 space-y-4">
                <p className="text-sm text-zinc-300 leading-relaxed">{selectedLabModal.summary}</p>
                <div className="grid grid-cols-3 gap-2 font-mono">
                  {selectedLabModal.metrics.map((metric) => (
                    <div key={metric.label} className="p-2.5 border border-white/10 bg-white/[0.02]">
                      <div className="text-[10px] text-zinc-500">{metric.label}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-5 bg-[#070709] border border-white/10 p-3">
                <div className="font-mono text-[10px] text-zinc-500 mb-2 flex items-center justify-between">
                  <span>MULTI_COLOR_PLOT</span>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </div>
                {renderMiniChart(selectedLabModal.chartType, false)}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <span className="text-zinc-500">ENDPOINT: {selectedLabModal.endpoint}</span>
              <div className="flex items-center gap-2">
                <Link
                  to={selectedLabModal.route}
                  onClick={() => setSelectedLabModal(null)}
                  className="px-4 py-2 bg-cyan-400 text-[#0A0A0C] font-bold hover:brightness-110 transition-all"
                >
                  OPEN_INTERACTIVE_LAB
                </Link>
                <button
                  type="button"
                  onClick={() => setSelectedLabModal(null)}
                  className="px-4 py-2 border border-white/15 text-zinc-300 hover:text-white cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {certificateModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setCertificateModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#0D0E12] border border-amber-400/40 p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="font-mono text-xs text-amber-400 flex items-center gap-2">
                <Award className="w-4 h-4" />
                HAPPIELOOP TECHNOLOGIES // TRAINING RECORD
              </div>
              <button
                type="button"
                onClick={() => setCertificateModalOpen(false)}
                aria-label="Close certificate modal"
                className="p-1.5 border border-white/15 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <h3 className="text-xl font-bold text-white">
                Machine Learning &amp; Data Science Laboratory Program
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Documents hands-on completion of ten Machine Learning assignments during 10 July – 9
                August 2026, integrated with a Flask REST backend and interactive React laboratory.
              </p>
              <div className="p-3.5 border border-white/10 bg-white/[0.02] font-mono text-xs text-zinc-300 space-y-1">
                <div>ORGANIZATION: Happieloop Technologies</div>
                <div>DURATION: 10 July – 9 August 2026</div>
                <div>ARCHIVE_SLOT: report/certificates/</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end font-mono text-xs">
              <button
                type="button"
                onClick={() => setCertificateModalOpen(false)}
                className="px-4 py-2 border border-amber-400/50 text-amber-300 hover:bg-amber-400/10 transition-colors cursor-pointer"
              >
                CLOSE_PREVIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}