import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Terminal,
  Cpu,
  Database,
  Layers,
  Code2,
  Award,
  Mail,
  Copy,
  Check,
  X,
  Sparkles,
  Activity,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileCheck2
} from 'lucide-react';

import { FaGithub, FaLinkedin } from "react-icons/fa";

/**
 * Complete dataset of all 10 Machine Learning assignments for the laboratory.
 * Each project includes metadata, algorithm type, status, preview metrics, and chart series.
 */
const ML_LABS = [
  {
    id: '01',
    slug: 'exploratory-data-analysis',
    code: '01',
    title: 'EXPLORATORY_DATA_ANALYSIS',
    displayName: 'Exploratory Data Analysis',
    algorithm: 'Statistical Profiling & Multi-Variate EDA',
    category: 'Data Foundation',
    status: 'ACTIVE',
    dataset: 'Iris Flower Dataset (150 × 5)',
    accent: '#22D3EE',
    summary:
      'Loads and profiles feature distributions, quartiles, correlations, and class separability across Setosa, Versicolor, and Virginica.',
    tags: ['Pandas', 'NumPy', 'Plotly', 'Flask'],
    metrics: [
      { label: 'Samples', value: '150' },
      { label: 'Features', value: '4' },
      { label: 'Nulls', value: '0' }
    ],
    chartType: 'scatter-iris'
  },
  {
    id: '02',
    slug: 'linear-regression',
    code: '02',
    title: 'LINEAR_REGRESSION',
    displayName: 'Linear Regression',
    algorithm: 'Ordinary Least Squares & Ridge Regularization',
    category: 'Supervised',
    status: 'READY',
    dataset: 'Continuous Predictive Benchmark',
    accent: '#10B981',
    summary:
      'Fits linear hyperplanes with residual diagnostics, R² scoring, MAE/RMSE evaluation, and interactive slope/intercept inspection.',
    tags: ['Scikit-Learn', 'NumPy', 'Matplotlib'],
    metrics: [
      { label: 'R² Score', value: '0.942' },
      { label: 'RMSE', value: '0.318' },
      { label: 'Features', value: '6' }
    ],
    chartType: 'regression-line'
  },
  {
    id: '03',
    slug: 'image-classification',
    code: '03',
    title: 'IMAGE_CLASSIFICATION',
    displayName: 'Image Classification',
    algorithm: 'Convolutional Neural Network (CNN)',
    category: 'Deep Learning',
    status: 'PLANNED',
    dataset: 'Vision Benchmark (28×28 / RGB)',
    accent: '#F59E0B',
    summary:
      'Extracts spatial feature hierarchies using convolutional layers, max-pooling, dropout regularization, and confusion matrix analysis.',
    tags: ['TensorFlow', 'Keras', 'NumPy'],
    metrics: [
      { label: 'Val Acc', value: '98.4%' },
      { label: 'Conv Blocks', value: '3' },
      { label: 'Optimizer', value: 'Adam' }
    ],
    chartType: 'bar-metrics'
  },
  {
    id: '04',
    slug: 'kmeans-clustering',
    code: '04',
    title: 'KMEANS_CLUSTERING',
    displayName: 'K-Means Clustering',
    algorithm: 'Centroid Partitioning & Elbow / Silhouette',
    category: 'Unsupervised',
    status: 'PLANNED',
    dataset: 'Multi-Dimensional Feature Space',
    accent: '#A855F7',
    summary:
      'Groups unlabeled observations into optimal K clusters via iterative centroid updates, inertia curves, and silhouette scoring.',
    tags: ['Scikit-Learn', 'Pandas', 'Plotly'],
    metrics: [
      { label: 'Clusters K', value: '3' },
      { label: 'Silhouette', value: '0.74' },
      { label: 'Iterations', value: '18' }
    ],
    chartType: 'scatter-iris'
  },
  {
    id: '05',
    slug: 'decision-tree',
    code: '05',
    title: 'DECISION_TREE',
    displayName: 'Decision Tree Classifier',
    algorithm: 'Gini Impurity & Entropy Recursive Splits',
    category: 'Supervised',
    status: 'PLANNED',
    dataset: 'Tabular Classification Dataset',
    accent: '#22D3EE',
    summary:
      'Constructs transparent rule-based decision paths with post-pruning controls, feature importance rankings, and depth tuning.',
    tags: ['Scikit-Learn', 'Graphviz', 'Pandas'],
    metrics: [
      { label: 'Max Depth', value: '5' },
      { label: 'F1 Score', value: '0.96' },
      { label: 'Criterion', value: 'Gini' }
    ],
    chartType: 'bar-metrics'
  },
  {
    id: '06',
    slug: 'naive-bayes',
    code: '06',
    title: 'NAIVE_BAYES',
    displayName: 'Gaussian Naive Bayes',
    algorithm: 'Bayes Theorem & Conditional Likelihood',
    category: 'Supervised',
    status: 'PLANNED',
    dataset: 'Probabilistic Feature Set',
    accent: '#10B981',
    summary:
      'Computes posterior class probabilities assuming feature conditional independence with fast training and log-likelihood calibration.',
    tags: ['Scikit-Learn', 'NumPy', 'SciPy'],
    metrics: [
      { label: 'Accuracy', value: '95.3%' },
      { label: 'Priors', value: 'Empirical' },
      { label: 'Latency', value: '<2ms' }
    ],
    chartType: 'regression-line'
  },
  {
    id: '07',
    slug: 'pca',
    code: '07',
    title: 'PRINCIPAL_COMPONENT_ANALYSIS',
    displayName: 'Principal Component Analysis',
    algorithm: 'Eigen-Decomposition & Variance Projection',
    category: 'Unsupervised',
    status: 'PLANNED',
    dataset: 'High-Dimensional Feature Matrix',
    accent: '#F59E0B',
    summary:
      'Projects correlated dimensions onto orthogonal principal components while tracking explained and cumulative variance ratios.',
    tags: ['Scikit-Learn', 'NumPy', 'Plotly'],
    metrics: [
      { label: 'PC1 + PC2', value: '95.8%' },
      { label: 'Components', value: '2D/3D' },
      { label: 'Scaling', value: 'Standard' }
    ],
    chartType: 'scatter-iris'
  },
  {
    id: '08',
    slug: 'neural-network',
    code: '08',
    title: 'ARTIFICIAL_NEURAL_NETWORK',
    displayName: 'Neural Network (MLP)',
    algorithm: 'Backpropagation, ReLU & Softmax Layers',
    category: 'Deep Learning',
    status: 'PLANNED',
    dataset: 'Non-Linear Classification / Regression',
    accent: '#A855F7',
    summary:
      'Trains dense multi-layer perceptrons with batch normalization, learning rate schedules, and loss/accuracy convergence curves.',
    tags: ['TensorFlow', 'Keras', 'NumPy'],
    metrics: [
      { label: 'Hidden Units', value: '128-64' },
      { label: 'Accuracy', value: '97.8%' },
      { label: 'Epochs', value: '50' }
    ],
    chartType: 'regression-line'
  },
  {
    id: '09',
    slug: 'arima',
    code: '09',
    title: 'ARIMA_TIME_SERIES',
    displayName: 'ARIMA Time Series Forecasting',
    algorithm: 'Autoregressive Integrated Moving Average',
    category: 'Time Series',
    status: 'PLANNED',
    dataset: 'Temporal Sequential Observations',
    accent: '#22D3EE',
    summary:
      'Models stationarity, differencing order (d), autoregressive lags (p), and moving average windows (q) for multi-step forecasting.',
    tags: ['Statsmodels', 'Pandas', 'Plotly'],
    metrics: [
      { label: 'Order (p,d,q)', value: '(2,1,2)' },
      { label: 'MAPE', value: '3.4%' },
      { label: 'Horizon', value: '30 Steps' }
    ],
    chartType: 'regression-line'
  },
  {
    id: '10',
    slug: 'svm',
    code: '10',
    title: 'SUPPORT_VECTOR_MACHINE',
    displayName: 'Support Vector Machine',
    algorithm: 'Maximum-Margin Hyperplane & RBF Kernel',
    category: 'Supervised',
    status: 'PLANNED',
    dataset: 'Margin-Sensitive Classification Set',
    accent: '#10B981',
    summary:
      'Finds optimal separating hyperplanes and non-linear kernel boundaries (RBF, Polynomial, Linear) with C and gamma tuning.',
    tags: ['Scikit-Learn', 'NumPy', 'Matplotlib'],
    metrics: [
      { label: 'Kernel', value: 'RBF' },
      { label: 'Accuracy', value: '98.0%' },
      { label: 'Support Vecs', value: '24' }
    ],
    chartType: 'scatter-iris'
  }
];

/**
 * Technical skill categories for the About & Architecture section.
 */
const SKILL_GROUPS = [
  {
    title: 'MACHINE_LEARNING & DL',
    accent: '#22D3EE',
    items: ['Scikit-Learn', 'TensorFlow', 'Keras', 'Regression & SVM', 'CNN & MLP', 'PCA & K-Means', 'ARIMA']
  },
  {
    title: 'DATA & VISUALIZATION',
    accent: '#10B981',
    items: ['Pandas', 'NumPy', 'Plotly', 'Matplotlib', 'Seaborn', 'Statistical EDA']
  },
  {
    title: 'FULL-STACK & TOOLING',
    accent: '#F59E0B',
    items: ['Python 3.11+', 'Flask REST API', 'React + Vite', 'Tailwind CSS', 'Git & GitHub', 'Jupyter / LaTeX']
  }
];

/**
 * Multi-color scatter plot SVG visualizing Setosa (Cyan), Versicolor (Emerald), and Virginica (Amber/Violet).
 */
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
      {/* Subtle architectural plot grid */}
      <line x1="10" y1="78" x2="104" y2="78" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
      <line x1="10" y1="8" x2="10" y2="78" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
      <line x1="10" y1="54" x2="104" y2="54" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="10" y1="30" x2="104" y2="30" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2 2" />

      {/* Setosa - Electric Cyan */}
      {setosaPoints.map(([cx, cy], idx) => (
        <circle key={`s-${idx}`} cx={cx} cy={cy} r="2.2" fill="#22D3EE" fillOpacity="0.9" />
      ))}

      {/* Versicolor - Emerald Mint */}
      {versicolorPoints.map(([cx, cy], idx) => (
        <circle key={`ve-${idx}`} cx={cx} cy={cy} r="2.2" fill="#10B981" fillOpacity="0.9" />
      ))}

      {/* Virginica - Solar Amber & Cyber Violet */}
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

/**
 * Multi-color regression line + observations SVG for Task 02 preview.
 */
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

      {/* Axes & grid */}
      <line x1="10" y1="78" x2="104" y2="78" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />
      <line x1="10" y1="8" x2="10" y2="78" stroke="rgba(255,255,255,0.16)" strokeWidth="0.7" />

      {/* Residual drop lines */}
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

      {/* Fitted regression line */}
      <line
        x1="12"
        y1="72"
        x2="100"
        y2="14"
        stroke="url(#regLineGrad)"
        strokeWidth="1.8"
      />

      {/* Data points */}
      {points.map(([cx, cy, color], idx) => (
        <circle key={`pt-${idx}`} cx={cx} cy={cy} r="2.2" fill={color} />
      ))}
    </svg>
  );
}

/**
 * Interactive multi-color iridescent 3D sculptural ribbon visual for the Hero right column.
 * Responds smoothly to pointer movement with subtle parallax and multi-spectral sheen.
 */
function IridescentHeroSculpture() {
  const containerRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setTilt({ x: normX, y: normY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[340px] lg:min-h-[460px] flex items-center justify-center overflow-hidden select-none"
    >
      {/* Ambient multi-color radial glow layers */}
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

      {/* Sculptural Iridescent 3D Ribbon SVG */}
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
          {/* Primary iridescent spectrum gradient (Gold -> Cyan -> Emerald -> Violet) */}
          <linearGradient id="ribbonSpectrumMain" x1="5%" y1="15%" x2="95%" y2="85%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="22%" stopColor="#F59E0B" />
            <stop offset="48%" stopColor="#22D3EE" />
            <stop offset="74%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Secondary metallic highlight ribbon */}
          <linearGradient id="ribbonHighlight" x1="100%" y1="10%" x2="0%" y2="90%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.95" />
            <stop offset="32%" stopColor="#FDE68A" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#6EE7B7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#D8B4FE" stopOpacity="0.85" />
          </linearGradient>

          {/* Deep shadow core for 3D cylindrical volume */}
          <linearGradient id="ribbonDepthShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#090B10" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#06070A" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0.45" />
          </linearGradient>

          {/* Fine particle dot pattern */}
          <pattern id="latentGridDots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.8" fill="rgba(255,255,255,0.16)" />
          </pattern>
        </defs>

        {/* Subtle background latent space dot matrix */}
        <rect x="230" y="70" width="240" height="220" fill="url(#latentGridDots)" opacity="0.65" />

        {/* Back sweeping ribbon tail */}
        <path
          d="M 40 390 C 160 360, 230 220, 355 150 C 445 100, 525 140, 565 75"
          fill="none"
          stroke="url(#ribbonSpectrumMain)"
          strokeWidth="34"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* Main sculptural twist loop (outer volume) */}
        <path
          d="M 185 375 C 255 315, 290 140, 395 105 C 485 75, 535 165, 455 245 C 385 315, 275 235, 345 155 C 405 88, 525 125, 575 45"
          fill="none"
          stroke="url(#ribbonSpectrumMain)"
          strokeWidth="44"
          strokeLinecap="round"
        />

        {/* Cylindrical volume shading pass */}
        <path
          d="M 185 375 C 255 315, 290 140, 395 105 C 485 75, 535 165, 455 245 C 385 315, 275 235, 345 155 C 405 88, 525 125, 575 45"
          fill="none"
          stroke="url(#ribbonDepthShadow)"
          strokeWidth="44"
          strokeLinecap="round"
        />

        {/* Specular iridescent ridge along the twist */}
        <path
          d="M 192 368 C 260 310, 295 145, 398 111 C 480 83, 526 166, 450 240 C 384 305, 282 232, 350 158 C 408 96, 522 130, 570 52"
          fill="none"
          stroke="url(#ribbonHighlight)"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Secondary fine multi-color filament wrapping the form */}
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

        {/* Architectural crosshairs & coordinate callouts */}
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

/**
 * Main Homepage & Interactive ML Portfolio Application.
 */
export function App() {
  const [activeLabIndex, setActiveLabIndex] = useState(0);
  const [selectedLabModal, setSelectedLabModal] = useState(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  // Ensure Google Fonts ('Plus Jakarta Sans', 'Inter', 'JetBrains Mono') are loaded
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

  const primaryFeaturedLab = ML_LABS[activeLabIndex] || ML_LABS[0];
  const secondaryFeaturedLab = ML_LABS[(activeLabIndex + 1) % ML_LABS.length] || ML_LABS[1];

  const filteredLabs =
    activeCategoryFilter === 'ALL'
      ? ML_LABS
      : ML_LABS.filter((lab) => lab.category.toUpperCase() === activeCategoryFilter);

  const handleCopyEmail = async () => {
    const email = 'ml.portfolio@happieloop-labs.dev';
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      }
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    }
  };

  const handleCycleLabs = (direction) => {
    setActiveLabIndex((prev) => {
      if (direction === 'next') return (prev + 1) % ML_LABS.length;
      return (prev - 1 + ML_LABS.length) % ML_LABS.length;
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
    <div
      className="min-h-screen bg-[#0A0A0C] text-white selection:bg-cyan-400/20 selection:text-cyan-200 relative overflow-x-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
    >
      {/* Subtle full-page architectural hairline grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '120px 120px'
        }}
      />

      {/* Top Telemetry Bar */}
      <div className="relative z-20 border-b border-white/10 bg-[#0A0A0C]/95 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-7 flex items-center justify-between text-[11px] tracking-wider text-zinc-400 font-mono">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400">[SYS_OK]</span>
            <span className="hidden sm:inline text-zinc-600">//</span>
            <span className="hidden sm:inline">FLASK_ML_LAB: READY</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 hidden md:inline">SPECTRUM: MULTI_COLOR</span>
            <span className="text-zinc-400">[SYS_OK]</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0A0A0C]/85 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo Mark */}
          <a
            href="#top"
            className="font-mono text-lg sm:text-xl font-bold tracking-tight flex items-center gap-1 group"
          >
            <span className="text-white">&lt;ML.</span>
            <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
              Lab/&gt;
            </span>
          </a>

          {/* Numbered Monospace Navigation */}
          <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7 font-mono text-xs tracking-widest">
            <a href="#about" className="text-zinc-300 hover:text-cyan-400 transition-colors">
              01_ABOUT
            </a>
            <a href="#projects" className="text-zinc-300 hover:text-emerald-400 transition-colors">
              02_PROJECTS
            </a>
            <a href="#internship" className="text-zinc-300 hover:text-amber-400 transition-colors">
              03_INTERNSHIP
            </a>
            <a href="#contact" className="text-zinc-300 hover:text-purple-400 transition-colors">
              04_CONTACT
            </a>
          </nav>

          {/* Right CTA & Quick Lab Drawer Trigger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedLabModal(ML_LABS[0])}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 font-mono text-[11px] tracking-wider text-zinc-300 border border-white/15 hover:border-cyan-400/60 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              TASK_01_EDA
            </button>

            <a
              href="#contact"
              className="relative inline-flex items-center justify-center px-4 py-2 font-mono text-xs font-semibold tracking-wider text-white bg-[#0A0A0C] hover:bg-white/5 transition-all"
              style={{
                border: '1px solid transparent',
                backgroundImage:
                  'linear-gradient(#0A0A0C, #0A0A0C), linear-gradient(90deg, #22D3EE, #10B981, #F59E0B, #A855F7)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              GET IN TOUCH
            </a>
          </div>
        </div>

        {/* Mobile Numbered Nav Strip */}
        <div className="flex md:hidden items-center justify-around border-t border-white/10 py-2 px-2 font-mono text-[10px] tracking-wider bg-[#0A0A0C]">
          <a href="#about" className="text-zinc-400 hover:text-cyan-400">01_ABOUT</a>
          <a href="#projects" className="text-zinc-400 hover:text-emerald-400">02_PROJECTS</a>
          <a href="#internship" className="text-zinc-400 hover:text-amber-400">03_INTERN</a>
          <a href="#contact" className="text-zinc-400 hover:text-purple-400">04_CONTACT</a>
        </div>
      </header>

      {/* HERO SECTION (Split Swiss-Brutalist Grid) */}
      <section id="top" className="relative z-10 max-w-[1440px] mx-auto border-x border-b border-white/10">
        {/* Coordinate corner markers */}
        <div className="flex items-center justify-between px-4 sm:px-8 pt-3 font-mono text-[11px] text-zinc-500">
          <span>[80, 19, 0]</span>
          <span>[04 / MULTI_SPECTRUM]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Column: Oversized Swiss Typography & Actions */}
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
              modelling, deep learning, and intelligent systems.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 font-mono text-xs sm:text-sm font-bold tracking-wider text-[#0A0A0C] bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 hover:brightness-110 transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)]"
              >
                Explore 10 Labs
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#internship"
                className="inline-flex items-center gap-2 px-5 py-3.5 font-mono text-xs sm:text-sm font-medium tracking-wider text-zinc-200 border border-white/15 hover:border-amber-400/60 hover:text-amber-300 bg-white/[0.02] transition-colors"
              >
                View Internship
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Multi-Color 3D Sculptural Wave */}
          <div className="lg:col-span-5 relative px-2 sm:px-4 py-4 lg:py-8">
            <IridescentHeroSculpture />
          </div>
        </div>

        {/* Bottom coordinate strip */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-2.5 border-t border-white/10 font-mono text-[11px] text-zinc-500">
          <span>[80, 19, 0]</span>
          <span>REACT + VITE + FLASK + SCIKIT-LEARN + TENSORFLOW</span>
        </div>
      </section>

      {/* LOWER ARCHITECTURAL HAIRLINE GRID SECTION ("10 LABS" + FEATURED EXPERIMENTS) */}
      <section className="relative z-10 max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left "10 LABS" Architectural Block */}
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

          {/* Center Cell: Primary Featured Lab (Defaults to 01 EXPLORATORY_DATA_ANALYSIS) */}
          <div className="lg:col-span-4 p-6 sm:p-7 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between group hover:bg-white/[0.02] transition-colors">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-mono text-2xl font-bold text-cyan-400">
                  {primaryFeaturedLab.code}
                </span>
                <span className="px-2.5 py-1 font-mono text-[10px] tracking-widest uppercase border border-emerald-400/40 text-emerald-300 bg-emerald-400/10">
                  STATUS: {primaryFeaturedLab.status}
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
                <button
                  type="button"
                  onClick={() => setSelectedLabModal(primaryFeaturedLab)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  OPEN_LAB_SPEC
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="shrink-0 bg-[#070709] border border-white/10 p-2">
                {renderMiniChart(primaryFeaturedLab.chartType, true)}
              </div>
            </div>
          </div>

          {/* Right Cell: Secondary Featured Lab (Defaults to 02 LINEAR_REGRESSION) */}
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

              {/* Compact statistical telemetry readout */}
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
                <button
                  type="button"
                  onClick={() => setSelectedLabModal(secondaryFeaturedLab)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  INSPECT_MODEL
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="shrink-0 bg-[#070709] border border-white/10 p-2">
                {renderMiniChart(secondaryFeaturedLab.chartType, true)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 01: ABOUT & TECHNICAL STACK */}
      <section id="about" className="relative z-10 max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
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
              This portfolio serves as a unified Machine Learning workbench where each assignment is
              implemented as a standalone Python/Scikit-learn or TensorFlow pipeline, exposed through
              Flask endpoints, and paired with interactive visual exploration.
            </p>
            <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
              Starting with <span className="text-cyan-300 font-mono">Task 01: Exploratory Data Analysis</span> on
              the Iris dataset, the platform scales cleanly across all ten core ML and deep learning
              modules.
            </p>
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

      {/* SECTION 02: COMPLETE 10 ML PROJECTS MATRIX */}
      <section id="projects" className="relative z-10 max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
        <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-xs">
            <span className="text-emerald-400 font-semibold">02 // ALL_10_MACHINE_LEARNING_LABS</span>
          </div>

          {/* Category Filter Tabs */}
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
                  <span
                    className="font-mono text-sm font-bold"
                    style={{ color: lab.accent }}
                  >
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
                <span className="font-mono text-[10px] text-zinc-500 truncate max-w-[120px]">
                  {lab.tags[0]} • {lab.tags[1]}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedLabModal(lab)}
                  className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  VIEW
                  <ArrowUpRight className="w-3.5 h-3.5" style={{ color: lab.accent }} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 03: INTERNSHIP SPOTLIGHT (HAPPIELOOP TECHNOLOGIES) */}
      <section id="internship" className="relative z-10 max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
        <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between font-mono text-xs">
          <span className="text-amber-400 font-semibold">03 // INTERNSHIP_&_CERTIFICATION</span>
          <span className="text-zinc-500">HAPPIELOOP_TECHNOLOGIES</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-amber-300 mb-2">
              <Award className="w-4 h-4" />
              INDUSTRIAL MACHINE LEARNING TRAINING
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Happieloop Technologies — Machine Learning Track
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl">
              Structured around ten practical laboratory assignments covering dataset exploration,
              statistical inference, supervised classification and regression, clustering,
              dimensionality reduction, neural networks, and time-series forecasting—culminating in
              an interactive full-stack showcase and technical report.
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 border border-white/10 bg-white/[0.02]">
                <div className="text-[10px] text-zinc-500">LAB ASSIGNMENTS</div>
                <div className="text-lg font-bold text-cyan-400">10 / 10</div>
              </div>
              <div className="p-3 border border-white/10 bg-white/[0.02]">
                <div className="text-[10px] text-zinc-500">CURRENT MILESTONE</div>
                <div className="text-lg font-bold text-emerald-400">TASK_01 EDA</div>
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
                Preview the structured internship completion summary, deliverable checklist, and
                evaluation record for Happieloop Technologies.
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

      {/* SECTION 04: CONTACT & FOOTER */}
      <footer id="contact" className="relative z-10 max-w-[1440px] mx-auto border-x border-white/10 bg-[#0A0A0C]">
        <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between font-mono text-xs">
          <span className="text-purple-400 font-semibold">04 // CONTACT_&_CONNECT</span>
          <span className="text-zinc-500">[STATUS: OPEN_FOR_COLLABORATION]</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10">
          <div className="lg:col-span-6 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Let&apos;s Discuss Machine Learning &amp; Intelligent Systems
              </h2>
              <p className="mt-3 text-sm text-zinc-400 max-w-md leading-relaxed">
                Reach out regarding the ten laboratory implementations, dataset experiments, Flask
                API integration, or internship documentation.
              </p>

              {/* One-click email copy bar */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="px-3.5 py-2.5 border border-white/15 bg-white/[0.02] font-mono text-xs text-zinc-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>ml.portfolio@happieloop-labs.dev</span>
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
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 border border-white/15 text-zinc-300 hover:border-white/40 hover:text-white transition-colors"
              >
                <FaGithub className="w-4 h-4" />
                GITHUB
              </a>
              <a
                href="https://linkedin.com"
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
                <label className="block font-mono text-[11px] text-zinc-400 mb-1.5">
                  YOUR_NAME
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Alex Rivera"
                  className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/15 focus:border-cyan-400 outline-none text-sm text-white placeholder:text-zinc-600"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] text-zinc-400 mb-1.5">
                  EMAIL_ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 bg-white/[0.02] border border-white/15 focus:border-cyan-400 outline-none text-sm text-white placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-zinc-400 mb-1.5">
                MESSAGE_PAYLOAD
              </label>
              <textarea
                rows={3}
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Ask about Task 01 Iris EDA, Flask endpoints, or upcoming ML labs..."
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
                <span className="font-mono text-xs text-emerald-400">
                  [DISPATCHED // LOGGED_LOCALLY]
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-zinc-500">
          <div>
            &lt;ML.Lab/&gt; — Interactive Machine Learning Laboratory • Happieloop Technologies Track
          </div>
          <div className="flex items-center gap-4">
            <span>[SYS_OK]</span>
            <span>© {new Date().getFullYear()} ML PORTFOLIO</span>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE LAB SPEC & PREVIEW MODAL */}
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
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {selectedLabModal.summary}
                </p>

                <div className="grid grid-cols-3 gap-2 font-mono">
                  {selectedLabModal.metrics.map((metric) => (
                    <div key={metric.label} className="p-2.5 border border-white/10 bg-white/[0.02]">
                      <div className="text-[10px] text-zinc-500">{metric.label}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{metric.value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {selectedLabModal.tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 border border-white/15 text-zinc-300">
                      {t}
                    </span>
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
              <span className="text-zinc-500">
                PATH: ml_projects/{selectedLabModal.code}_{selectedLabModal.slug.replace(/-/g, '_')}
              </span>
              <button
                type="button"
                onClick={() => setSelectedLabModal(null)}
                className="px-4 py-2 bg-white text-[#0A0A0C] font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INTERNSHIP CERTIFICATE PREVIEW MODAL */}
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
                Verifies hands-on completion of exploratory data analysis, predictive regression,
                classification algorithms, clustering, dimensionality reduction, artificial neural
                networks, and ARIMA time-series workflows.
              </p>
              <div className="p-3.5 border border-white/10 bg-white/[0.02] font-mono text-xs text-zinc-300 space-y-1">
                <div>ORGANIZATION: Happieloop Technologies</div>
                <div>DELIVERABLES: 10 ML Implementations + Flask API + React Portfolio</div>
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

export default App;