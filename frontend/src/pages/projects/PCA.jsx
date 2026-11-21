import { useCallback, useEffect, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { transformPca } from '../../services/api';

const SPECIES_COLORS = {
  setosa: '#22D3EE',
  versicolor: '#10B981',
  virginica: '#F59E0B',
};

function extractCoord(pt, keys, idx) {
  if (Array.isArray(pt)) {
    const num = Number(pt[idx]);
    return Number.isFinite(num) ? num : NaN;
  }
  if (!pt || typeof pt !== 'object') return NaN;

  for (const key of keys) {
    if (pt[key] !== undefined && pt[key] !== null) {
      const num = Number(pt[key]);
      if (Number.isFinite(num)) return num;
    }
  }

  for (const arrKey of ['coords', 'coordinates', 'values', 'features']) {
    if (Array.isArray(pt[arrKey]) && pt[arrKey][idx] !== undefined) {
      const num = Number(pt[arrKey][idx]);
      if (Number.isFinite(num)) return num;
    }
  }

  return NaN;
}

export default function PCA() {
  const [nComponents, setNComponents] = useState(2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const runProjection = useCallback(async (comps) => {
    setLoading(true);
    try {
      const data = await transformPca(Number(comps));
      setResult(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    transformPca(2)
      .then((data) => {
        if (!ignore) {
          setResult(data);
          setError('');
        }
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const rawPoints = Array.isArray(result?.components)
    ? result.components
    : result?.projected_points ??
      result?.points ??
      result?.transformed_data ??
      result?.projection ??
      [];

  const normalizedPoints = Array.isArray(rawPoints)
    ? rawPoints
        .map((pt) => {
          const pc1 = extractCoord(
            pt,
            ['PC1', 'pc1', 'PC_1', 'pc_1', 'component_1', 'x'],
            0
          );
          const pc2 = extractCoord(
            pt,
            ['PC2', 'pc2', 'PC_2', 'pc_2', 'component_2', 'y'],
            1
          );
          const species = String(
            pt?.species ?? pt?.target ?? pt?.label ?? pt?.class ?? ''
          ).toLowerCase();
          return { pc1, pc2, species };
        })
        .filter((pt) => Number.isFinite(pt.pc1) && Number.isFinite(pt.pc2))
    : [];

  const renderPcaScatter = () => {
    if (!normalizedPoints.length) {
      return (
        <div className="font-mono text-xs text-zinc-500 py-8 text-center">
          No 2D (PC1, PC2) coordinates available in response for k = {nComponents}.
        </div>
      );
    }

    const xs = normalizedPoints.map((p) => p.pc1);
    const ys = normalizedPoints.map((p) => p.pc2);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;

    return (
      <>
        <svg viewBox="0 0 420 240" className="w-full h-64">
          <line x1="36" y1="205" x2="398" y2="205" stroke="rgba(255,255,255,0.2)" />
          <line x1="36" y1="16" x2="36" y2="205" stroke="rgba(255,255,255,0.2)" />
          {normalizedPoints.map((pt, i) => {
            const cx = 42 + ((pt.pc1 - minX) / spanX) * 348;
            const cy = 198 - ((pt.pc2 - minY) / spanY) * 174;
            const fill = SPECIES_COLORS[pt.species] || '#A855F7';
            return <circle key={i} cx={cx} cy={cy} r="3.4" fill={fill} fillOpacity="0.9" />;
          })}
        </svg>

        <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[11px]">
          {Object.entries(SPECIES_COLORS).map(([name, color]) => (
            <span key={name} className="inline-flex items-center gap-1.5 text-zinc-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              {name}
            </span>
          ))}
        </div>
      </>
    );
  };

  const explainedRatios = Array.isArray(result?.explained_variance_ratio)
    ? result.explained_variance_ratio.map((v) => Number(v) || 0)
    : [];
  const cumList = result?.cumulative_explained_variance || [];
  const totalCaptured =
    result?.total_retained_variance !== undefined
      ? `${(Number(result.total_retained_variance) * 100).toFixed(2)}%`
      : cumList.length
      ? `${(Number(cumList[cumList.length - 1]) * 100).toFixed(2)}%`
      : '—';

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_07"
        title="PRINCIPAL_COMPONENT_ANALYSIS (DIMENSIONALITY REDUCTION)"
        rightLabel="/api/task07/transform"
        accent="#F59E0B"
      />

      <div className="p-6 sm:p-8 space-y-6">
        {/* 01. Overview & 02. Objective / Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              01 // OVERVIEW
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Projects standardized four-dimensional Iris measurements onto orthogonal{' '}
              <span className="text-white">Principal Components (PC1..PCk)</span> using{' '}
              <span className="text-white">PCA</span>, reporting per-component and cumulative
              explained variance alongside a 2D scatter plot when{' '}
              <span className="text-white">k</span> is at least 2.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Compress correlated botanical features into a low-dimensional subspace (
              <span className="text-white">k = 1..4</span>) that retains maximum variance while
              preserving visual class structure across <span className="text-white">Setosa</span>,{' '}
              <span className="text-white">Versicolor</span>, and{' '}
              <span className="text-white">Virginica</span>.
            </p>
          </div>
        </div>

        {/* 03. Dataset Description, 04. Algorithm Explanation & 05. Workflow / Methodology */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              03 // DATASET DESCRIPTION
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Uses the 150-sample Iris dataset with four numeric morphological features (sepal and
              petal length/width in cm) and three species labels (
              <span className="text-white">setosa</span>,{' '}
              <span className="text-white">versicolor</span>,{' '}
              <span className="text-white">virginica</span>).
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // ALGORITHM EXPLANATION
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Centers and scales features to zero mean and unit variance, computes eigenvectors of
              the feature covariance matrix (or singular vectors of the scaled data matrix), and
              orders principal axes by descending explained variance.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Standardizes the four numeric Iris dimensions, fits{' '}
              <span className="text-white">PCA(n_components=k)</span> for{' '}
              <span className="text-white">k ∈ {'{1, 2, 3, 4}'}</span> via{' '}
              <span className="text-white">/api/task07/transform</span>, computes explained and
              cumulative variance ratios, and plots <span className="text-white">PC1 vs PC2</span>{' '}
              for <span className="text-white">k</span> greater than or equal to 2.
            </p>
          </div>
        </div>

        {/* 06. Interactive Demo */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
            06 // INTERACTIVE DEMO — PRINCIPAL COMPONENT COUNT (k) SELECTOR
          </div>
          <div className="flex flex-wrap items-center gap-3 p-4 border border-white/10 bg-white/[0.02] font-mono text-xs">
            <span className="text-zinc-300">COMPONENTS (k):</span>
            {[1, 2, 3, 4].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setNComponents(c);
                  runProjection(c);
                }}
                className={`px-3 py-1.5 border cursor-pointer ${
                  nComponents === c
                    ? 'border-amber-400 bg-amber-400/20 text-amber-200 font-bold'
                    : 'border-white/15 text-zinc-400'
                }`}
              >
                k = {c}
              </button>
            ))}
          </div>
        </div>

        {loading && <LoadingState label="COMPUTING_PCA_PROJECTION..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {result && (
          <>
            {/* 08. Evaluation Metrics */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                08 // EVALUATION METRICS — VARIANCE RETAINED
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="min-w-0">
                  <MetricCard
                    label="COMPONENTS"
                    value={result.n_components ?? nComponents}
                    accent="#F59E0B"
                  />
                </div>
                <div className="min-w-0">
                  <MetricCard label="CUMULATIVE VARIANCE" value={totalCaptured} accent="#10B981" />
                </div>
                <div className="min-w-0">
                  <MetricCard
                    label="PC1 VARIANCE"
                    value={`${((Number(result.explained_variance_ratio?.[0]) || 0) * 100).toFixed(2)}%`}
                    accent="#22D3EE"
                  />
                </div>
              </div>
            </div>

            {/* 07. Visualizations */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                07 // VISUALIZATIONS — PCA PROJECTION & EXPLAINED VARIANCE BREAKDOWN
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {nComponents >= 2 && (
                  <div className={explainedRatios.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'}>
                    <ChartContainer
                      title="2D Principal Component Scatter (PC1 vs PC2)"
                      subtitle="Standardized Iris projection"
                    >
                      {renderPcaScatter()}
                    </ChartContainer>
                  </div>
                )}

                {explainedRatios.length > 0 && (
                  <div className={nComponents >= 2 ? 'lg:col-span-5' : 'lg:col-span-12'}>
                    <ChartContainer
                      title="Explained Variance Ratio by Component"
                      subtitle={`Retained subspace (k = ${result.n_components ?? nComponents})`}
                    >
                      <div className="space-y-3 font-mono text-xs">
                        {explainedRatios.map((ratio, idx) => {
                          const pct = Math.min(100, Math.max(0, ratio * 100));
                          const cumVal =
                            cumList[idx] !== undefined
                              ? `${(Number(cumList[idx]) * 100).toFixed(1)}%`
                              : null;
                          return (
                            <div key={`pc-${idx + 1}`} className="space-y-1">
                              <div className="flex justify-between text-zinc-200">
                                <span>PC{idx + 1}</span>
                                <span className="text-amber-300">
                                  {pct.toFixed(2)}%{cumVal ? ` (cum: ${cumVal})` : ''}
                                </span>
                              </div>
                              <div className="h-2 bg-white/10 overflow-hidden">
                                <div
                                  className="h-full bg-amber-400"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ChartContainer>
                  </div>
                )}
              </div>
            </div>

            {/* 09. Key Findings & 10. Conclusion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  09 // KEY FINDINGS
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  The first two principal components (<span className="text-white">PC1</span> and{' '}
                  <span className="text-white">PC2</span>) capture the vast majority of variance in
                  standardized Iris features, separating <span className="text-white">Setosa</span>{' '}
                  distinctly while showing expected partial overlap between{' '}
                  <span className="text-white">Versicolor</span> and{' '}
                  <span className="text-white">Virginica</span>.
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                  10 // CONCLUSION
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  PCA provides an effective linear dimensionality reduction lens for inspecting
                  multi-feature structure and deciding how many components to retain before
                  downstream visualization or modeling.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}