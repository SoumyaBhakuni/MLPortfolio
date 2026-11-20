import { useEffect, useMemo, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { fetchTask01EDA } from '../../services/api';

const SPECIES_COLORS = {
  setosa: '#22D3EE',
  versicolor: '#10B981',
  virginica: '#F59E0B',
};

const FEATURE_TO_RECORD_KEY = {
  'sepal length (cm)': 'sepal_length',
  'sepal width (cm)': 'sepal_width',
  'petal length (cm)': 'petal_length',
  'petal width (cm)': 'petal_width',
};

function resolveRecordKey(featureName) {
  if (!featureName) return '';
  if (FEATURE_TO_RECORD_KEY[featureName]) return FEATURE_TO_RECORD_KEY[featureName];
  return featureName.replace(/\s*\(cm\)\s*/gi, '').trim().replace(/\s+/g, '_');
}

export default function EDA() {
  const [payload, setPayload] = useState(null);
  const [xFeature, setXFeature] = useState('petal length (cm)');
  const [yFeature, setYFeature] = useState('petal width (cm)');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchTask01EDA(false)
      .then((res) => {
        if (ignore) return;
        const edaData = res?.data ?? res;
        setPayload(edaData);
        const cols = edaData?.overview?.numeric_columns;
        if (Array.isArray(cols) && cols.length >= 2) {
          setXFeature((prev) => (cols.includes(prev) ? prev : cols[0]));
          setYFeature((prev) => (cols.includes(prev) ? prev : cols[1]));
        }
        setError('');
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

  const overview = payload?.overview || {};
  const numericCols = overview.numeric_columns || [
    'sepal length (cm)',
    'sepal width (cm)',
    'petal length (cm)',
    'petal width (cm)',
  ];

  const corrColumns = payload?.correlation?.columns || numericCols;
  const corrMatrix = payload?.correlation?.matrix || [];
  const summaryStats = payload?.statistics || [];
  const findings = payload?.findings || [];

  const scatterPoints = useMemo(() => {
    const records = payload?.records || [];
    const xKey = resolveRecordKey(xFeature);
    const yKey = resolveRecordKey(yFeature);

    return records
      .map((row) => ({
        x: Number(row?.[xKey]),
        y: Number(row?.[yKey]),
        species: row?.species ?? 'unknown',
      }))
      .filter((pt) => Number.isFinite(pt.x) && Number.isFinite(pt.y));
  }, [payload, xFeature, yFeature]);

  const getCorrelationValue = (rowCol, colKey) => {
    const rIdx = corrColumns.indexOf(rowCol);
    const cIdx = corrColumns.indexOf(colKey);
    if (rIdx === -1 || cIdx === -1) return 0;
    return Number(corrMatrix?.[rIdx]?.[cIdx] ?? 0);
  };

  const renderScatterSvg = () => {
    if (!scatterPoints.length) {
      return <div className="font-mono text-xs text-zinc-500">No scatter points loaded.</div>;
    }

    const xs = scatterPoints.map((p) => p.x);
    const ys = scatterPoints.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;

    return (
      <svg viewBox="0 0 420 240" className="w-full h-64">
        <line x1="38" y1="205" x2="404" y2="205" stroke="rgba(255,255,255,0.2)" />
        <line x1="38" y1="16" x2="38" y2="205" stroke="rgba(255,255,255,0.2)" />

        <text x="32" y="205" textAnchor="end" fill="#71717A" fontSize="9" fontFamily="JetBrains Mono">
          {minY.toFixed(1)}
        </text>
        <text x="32" y="22" textAnchor="end" fill="#71717A" fontSize="9" fontFamily="JetBrains Mono">
          {maxY.toFixed(1)}
        </text>

        {scatterPoints.map((p, idx) => {
          const cx = 44 + ((p.x - minX) / spanX) * 352;
          const cy = 198 - ((p.y - minY) / spanY) * 175;
          const fill = SPECIES_COLORS[String(p.species).toLowerCase()] || '#A855F7';
          return <circle key={idx} cx={cx} cy={cy} r="3.4" fill={fill} fillOpacity="0.88" />;
        })}

        <text x="44" y="218" textAnchor="start" fill="#71717A" fontSize="9" fontFamily="JetBrains Mono">
          {minX.toFixed(1)}
        </text>
        <text x="396" y="218" textAnchor="end" fill="#71717A" fontSize="9" fontFamily="JetBrains Mono">
          {maxX.toFixed(1)}
        </text>
        <text x="220" y="232" textAnchor="middle" fill="#A1A1AA" fontSize="10" fontFamily="JetBrains Mono">
          {xFeature} (x) vs {yFeature} (y)
        </text>
      </svg>
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_01"
        title="EXPLORATORY_DATA_ANALYSIS (IRIS DATASET)"
        rightLabel="/api/task01/eda"
        accent="#22D3EE"
      />

      <div className="p-6 sm:p-8 space-y-6">
        {loading && <LoadingState label="LOADING_IRIS_EDA_PROFILE..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 bg-amber-500/10 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {payload && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <MetricCard label="ROWS" value={overview.total_rows ?? 150} accent="#22D3EE" />
              <MetricCard label="COLUMNS" value={overview.total_columns ?? 5} accent="#10B981" />
              <MetricCard label="MISSING VALUES" value={overview.missing_values ?? 0} accent="#F59E0B" />
              <MetricCard label="DUPLICATES" value={overview.duplicate_rows ?? 0} accent="#A855F7" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <ChartContainer
                  title="Interactive Feature Scatter Explorer"
                  subtitle="Select X and Y axes across Iris morphological dimensions"
                  rightSlot={
                    <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                      <select
                        value={xFeature}
                        onChange={(e) => setXFeature(e.target.value)}
                        className="bg-[#0D0E12] border border-white/15 px-2 py-1 text-zinc-200"
                      >
                        {numericCols.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <select
                        value={yFeature}
                        onChange={(e) => setYFeature(e.target.value)}
                        className="bg-[#0D0E12] border border-white/15 px-2 py-1 text-zinc-200"
                      >
                        {numericCols.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  }
                >
                  {renderScatterSvg()}
                  <div className="mt-3 flex items-center gap-4 font-mono text-[11px]">
                    {Object.entries(SPECIES_COLORS).map(([name, color]) => (
                      <span key={name} className="inline-flex items-center gap-1.5 text-zinc-300">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        {name}
                      </span>
                    ))}
                  </div>
                </ChartContainer>
              </div>

              <div className="lg:col-span-5">
                <ChartContainer title="Correlation Matrix" subtitle="Pearson r across numeric features">
                  <div className="overflow-x-auto">
                    <table className="w-full font-mono text-[11px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-zinc-400">
                          <th className="py-2 pr-2">Feature</th>
                          {corrColumns.map((c) => (
                            <th key={c} className="py-2 px-1.5">
                              {c.split(' ')[0]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {corrColumns.map((rowCol) => (
                          <tr key={rowCol} className="border-b border-white/5">
                            <td className="py-2 pr-2 text-zinc-300">{rowCol}</td>
                            {corrColumns.map((colKey) => {
                              const val = getCorrelationValue(rowCol, colKey);
                              return (
                                <td key={colKey} className="py-2 px-1.5 text-cyan-300">
                                  {val.toFixed(2)}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ChartContainer>
              </div>
            </div>

            <ChartContainer title="Summary Statistics" subtitle="Mean, Median, Std Dev, Variance, Min, Quartiles, Max">
              <div className="overflow-x-auto">
                <table className="w-full font-mono text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400">
                      <th className="py-2 pr-3">Feature</th>
                      <th className="py-2 px-2">Mean</th>
                      <th className="py-2 px-2">Median</th>
                      <th className="py-2 px-2">Std</th>
                      <th className="py-2 px-2">Var</th>
                      <th className="py-2 px-2">Min</th>
                      <th className="py-2 px-2">Q25</th>
                      <th className="py-2 px-2">Q75</th>
                      <th className="py-2 px-2">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaryStats.map((row) => (
                      <tr key={row.feature} className="border-b border-white/5 text-zinc-200">
                        <td className="py-2 pr-3 text-cyan-300 font-semibold">{row.feature}</td>
                        <td className="py-2 px-2">{row.mean}</td>
                        <td className="py-2 px-2">{row.median ?? row.q50}</td>
                        <td className="py-2 px-2">{row.std}</td>
                        <td className="py-2 px-2">{row.variance}</td>
                        <td className="py-2 px-2">{row.min}</td>
                        <td className="py-2 px-2">{row.q25}</td>
                        <td className="py-2 px-2">{row.q75}</td>
                        <td className="py-2 px-2">{row.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartContainer>

            {findings.length > 0 && (
              <ChartContainer title="Key EDA Findings" subtitle="Automated dataset observations">
                <ul className="space-y-1.5 font-mono text-xs text-zinc-300 list-disc pl-5">
                  {findings.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </ChartContainer>
            )}
          </>
        )}
      </div>
    </div>
  );
}