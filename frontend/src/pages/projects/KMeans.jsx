import { useEffect, useRef, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { runKMeans } from '../../services/api';

const CLUSTER_PALETTE = [
  '#22D3EE',
  '#10B981',
  '#F59E0B',
  '#A855F7',
  '#F43F5E',
  '#38BDF8',
  '#84CC16',
  '#FB923C',
];

export default function KMeans() {
  const [k, setK] = useState(5);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const requestIdRef = useRef(0);

  useEffect(() => {
    const reqId = ++requestIdRef.current;
    const timer = setTimeout(() => {
      setLoading(true);
      runKMeans(Number(k))
        .then((data) => {
          if (reqId !== requestIdRef.current) return;
          setResult(data);
          setError('');
        })
        .catch((err) => {
          if (reqId !== requestIdRef.current) return;
          setError(err.message);
        })
        .finally(() => {
          if (reqId === requestIdRef.current) setLoading(false);
        });
    }, 120);

    return () => clearTimeout(timer);
  }, [k]);

  const pts = result?.points || [];
  const activeClusters = Array.from(
    new Set(pts.map((p) => Number(p?.cluster)).filter((c) => Number.isFinite(c)))
  ).sort((a, b) => a - b);

  const renderClusterScatter = () => {
    if (!pts.length) {
      return <div className="font-mono text-xs text-zinc-500">No cluster points loaded.</div>;
    }

    const xs = pts.map((p) => Number(p.annual_income_k));
    const ys = pts.map((p) => Number(p.spending_score));
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;

    return (
      <svg viewBox="0 0 420 242" className="w-full h-64">
        <line x1="40" y1="204" x2="402" y2="204" stroke="rgba(255,255,255,0.2)" />
        <line x1="40" y1="16" x2="40" y2="204" stroke="rgba(255,255,255,0.2)" />

        <text x="35" y="202" textAnchor="end" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
          {Math.round(minY)}
        </text>
        <text x="35" y="24" textAnchor="end" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
          {Math.round(maxY)}
        </text>

        {pts.map((pt, i) => {
          const cx = 46 + ((Number(pt.annual_income_k) - minX) / spanX) * 348;
          const cy = 197 - ((Number(pt.spending_score) - minY) / spanY) * 174;
          const clusterIdx = Math.abs(Number(pt.cluster) || 0);
          const color = CLUSTER_PALETTE[clusterIdx % CLUSTER_PALETTE.length];
          return <circle key={i} cx={cx} cy={cy} r="3.4" fill={color} fillOpacity="0.9" />;
        })}

        <text x="46" y="217" textAnchor="start" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
          {Math.round(minX)}k
        </text>
        <text x="394" y="217" textAnchor="end" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
          {Math.round(maxX)}k
        </text>
        <text x="220" y="232" textAnchor="middle" fill="#A1A1AA" fontSize="9.5" fontFamily="JetBrains Mono">
          Annual Income ($k) vs. Spending Score
        </text>
      </svg>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_04"
        title="KMEANS_CLUSTERING (CUSTOMER SEGMENTATION)"
        rightLabel="/api/task04/cluster"
        accent="#A855F7"
      />

      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center gap-4 p-4 border border-white/10 bg-white/[0.02] font-mono text-xs">
          <label className="text-zinc-300">
            CLUSTERS (K = <span className="text-purple-400 font-bold">{k}</span>):
          </label>
          <input
            type="range"
            min="2"
            max="10"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="w-48 accent-purple-400 cursor-pointer"
          />
        </div>

        {loading && <LoadingState label="FITTING_STANDARDIZED_KMEANS..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="min-w-0">
                <MetricCard label="SELECTED K" value={result.n_clusters} accent="#A855F7" />
              </div>
              <div className="min-w-0">
                <MetricCard label="INERTIA (WCSS)" value={result.inertia} accent="#22D3EE" />
              </div>
              <div className="min-w-0">
                <MetricCard label="OBSERVATIONS" value={pts.length} accent="#10B981" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ChartContainer
                  title="Customer Cluster Scatter"
                  subtitle="Annual Income ($k) vs. Spending Score"
                >
                  {renderClusterScatter()}
                  {activeClusters.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[11px]">
                      {activeClusters.map((c) => {
                        const color = CLUSTER_PALETTE[Math.abs(c) % CLUSTER_PALETTE.length];
                        return (
                          <span key={c} className="inline-flex items-center gap-1.5 text-zinc-300">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                            C{c}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </ChartContainer>
              </div>
              <div className="lg:col-span-5">
                <ChartContainer
                  title="Elbow Method Curve (K = 1..8)"
                  subtitle="Within-cluster sum of squares"
                >
                  <div className="space-y-2 font-mono text-xs">
                    {(result.elbow || []).map((row) => (
                      <div
                        key={row.k}
                        className="flex items-center justify-between border-b border-white/5 py-1.5"
                      >
                        <span className="text-zinc-300">K = {row.k}</span>
                        <span className="text-purple-300">{row.inertia}</span>
                      </div>
                    ))}
                  </div>
                </ChartContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}