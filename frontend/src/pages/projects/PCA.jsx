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

        {loading && <LoadingState label="COMPUTING_PCA_PROJECTION..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {result && (
          <>
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

            {nComponents >= 2 && (
              <ChartContainer
                title="2D Principal Component Scatter (PC1 vs PC2)"
                subtitle="Standardized Iris projection"
              >
                {renderPcaScatter()}
              </ChartContainer>
            )}
          </>
        )}
      </div>
    </div>
  );
}