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
  const centroids = result?.centroids || [];
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

        {centroids.map((cen, i) => {
          const cx = 46 + ((Number(cen.annual_income_k) - minX) / spanX) * 348;
          const cy = 197 - ((Number(cen.spending_score) - minY) / spanY) * 174;
          if (!Number.isFinite(cx) || !Number.isFinite(cy)) return null;
          return (
            <circle
              key={`cen-${cen.cluster ?? i}`}
              cx={cx}
              cy={cy}
              r="5.5"
              fill="#FFFFFF"
              stroke="#0A0A0C"
              strokeWidth="1.5"
            />
          );
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
        {/* 01. Overview & 02. Objective / Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              01 // OVERVIEW
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Partitions customer profiles using unsupervised{' '}
              <span className="text-white">K-Means</span> clustering over standardized income and
              spending features, paired with within-cluster sum of squares (inertia) elbow
              diagnostics across <span className="text-white">K = 1..8</span>.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Group unlabeled observations into compact, well-separated customer segments by
              minimizing squared Euclidean distances to cluster centroids while evaluating how
              inertia behaves as cluster count <span className="text-white">K</span> varies from{' '}
              <span className="text-white">2</span> to <span className="text-white">10</span>.
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
              Uses <span className="text-white">annual_income_k</span> and{' '}
              <span className="text-white">spending_score</span> features (loaded from{' '}
              <span className="text-white">customers.csv</span> if present, or generated as a
              120-point synthetic demonstration dataset around 5 centers with{' '}
              <span className="text-white">seed=42</span>).
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // ALGORITHM EXPLANATION
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Alternates between assigning each point to its nearest centroid in standardized
              feature space and recomputing cluster means until centroid shifts converge, measuring
              compactness via <span className="text-white">inertia (WCSS)</span>.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Fits <span className="text-white">StandardScaler</span> on both features so scale
              differences do not bias distance calculations, computes elbow inertias for{' '}
              <span className="text-white">K = 1..8</span>, fits K-Means for the selected{' '}
              <span className="text-white">K ∈ [2, 10]</span>, and inverse-transforms centroids
              back to original units.
            </p>
          </div>
        </div>

        {/* 06. Interactive Demo */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
            06 // INTERACTIVE DEMO — CLUSTER COUNT (K) CONTROL
          </div>
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
        </div>

        {loading && <LoadingState label="FITTING_STANDARDIZED_KMEANS..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {result && (
          <>
            {result?.is_synthetic && (
              <div className="p-3 border border-amber-500/40 bg-amber-500/5 font-mono text-xs text-amber-200">
                <strong>SYNTHETIC_DATASET_NOTICE:</strong> Clustering uses generated demonstration
                customer data (`120` points around 5 centers, `seed=42`) across `annual_income_k`
                and `spending_score`, not an external real-world retail dataset.
              </div>
            )}

            {/* 08. Evaluation Metrics */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
                08 // EVALUATION METRICS — WCSS INERTIA & CLUSTER COVERAGE
              </div>
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
            </div>

            {/* 07. Visualizations */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
                07 // VISUALIZATIONS — CLUSTER SCATTER & ELBOW INERTIA TABLE
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <ChartContainer
                    title="Customer Cluster Scatter"
                    subtitle="Annual Income ($k) vs. Spending Score · White markers show centroids"
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
            </div>

            {/* 09. Key Findings & 10. Conclusion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  09 // KEY FINDINGS
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  Within-cluster sum of squares drops steeply for small{' '}
                  <span className="text-white">K</span> and levels off around the elbow point as
                  adding extra clusters yields diminishing variance reduction, while{' '}
                  <span className="text-white">StandardScaler</span> keeps income and spending
                  scales balanced during distance evaluation.
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
                  10 // CONCLUSION
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  Standardized K-Means with elbow inertia inspection offers an intuitive way to
                  explore segment structure and centroid locations before applying density- or
                  model-based clustering methods.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}