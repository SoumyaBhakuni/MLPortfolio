import { useCallback, useEffect, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { forecastArima } from '../../services/api';

const DEFAULT_STEPS = 6;
const DEFAULT_ORDER = [1, 1, 1];
const ORDER_PARAMS = [
  { key: 'p', label: 'ORDER_P', min: 0, max: 5 },
  { key: 'd', label: 'ORDER_D', min: 0, max: 5 },
  { key: 'q', label: 'ORDER_Q', min: 0, max: 5 },
];

function clampInt(val, min, max, fallback) {
  const parsed = parseInt(String(val ?? ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function normalizeForecastRows(result) {
  const rawForecast = result?.forecast;
  if (!Array.isArray(rawForecast) || !rawForecast.length) return [];

  const lowerArr = Array.isArray(result?.lower_ci)
    ? result.lower_ci
    : Array.isArray(result?.confidence_lower)
    ? result.confidence_lower
    : [];
  const upperArr = Array.isArray(result?.upper_ci)
    ? result.upper_ci
    : Array.isArray(result?.confidence_upper)
    ? result.confidence_upper
    : [];
  const datesArr = Array.isArray(result?.dates)
    ? result.dates
    : Array.isArray(result?.timestamps)
    ? result.timestamps
    : [];

  return rawForecast.map((item, idx) => {
    if (item && typeof item === 'object') {
      return {
        key: item.date ? `${item.date}-${idx}` : `step-${idx}`,
        stepLabel: item.date ?? datesArr[idx] ?? `Step +${idx + 1}`,
        forecast: item.forecast ?? item.value ?? '—',
        lowerCi: item.lower_ci ?? lowerArr[idx] ?? '—',
        upperCi: item.upper_ci ?? upperArr[idx] ?? '—',
      };
    }

    return {
      key: `step-${idx}`,
      stepLabel: datesArr[idx] ?? `Step +${idx + 1}`,
      forecast: item ?? '—',
      lowerCi: lowerArr[idx] !== undefined ? lowerArr[idx] : '—',
      upperCi: upperArr[idx] !== undefined ? upperArr[idx] : '—',
    };
  });
}

function renderForecastSvg(forecastRows) {
  const numericRows = forecastRows
    .map((r, i) => ({
      idx: i,
      label: String(r.stepLabel),
      val: Number(r.forecast),
      low: Number(r.lowerCi),
      high: Number(r.upperCi),
    }))
    .filter((r) => Number.isFinite(r.val));

  if (numericRows.length < 2) {
    return (
      <div className="font-mono text-xs text-zinc-500 py-4">
        At least two numeric forecast steps are required to plot the trajectory curve.
      </div>
    );
  }

  const allVals = numericRows.flatMap((r) =>
    [r.val, Number.isFinite(r.low) ? r.low : null, Number.isFinite(r.high) ? r.high : null].filter(
      (v) => v !== null
    )
  );
  const minY = Math.min(...allVals);
  const maxY = Math.max(...allVals);
  const spanY = maxY - minY || 1;
  const spanX = Math.max(1, numericRows.length - 1);

  const mapX = (i) => 52 + (i / spanX) * 344;
  const mapY = (v) => 186 - ((v - minY) / spanY) * 160;

  const linePts = numericRows.map((r, i) => `${mapX(i)},${mapY(r.val)}`).join(' ');
  const hasCi = numericRows.some((r) => Number.isFinite(r.low) && Number.isFinite(r.high));

  let areaPoints = '';
  if (hasCi) {
    const upperPts = numericRows.map((r, i) =>
      `${mapX(i)},${mapY(Number.isFinite(r.high) ? r.high : r.val)}`
    );
    const lowerPts = [...numericRows]
      .reverse()
      .map((r, revIdx) => {
        const origIdx = numericRows.length - 1 - revIdx;
        const lowVal = Number.isFinite(r.low) ? r.low : r.val;
        return `${mapX(origIdx)},${mapY(lowVal)}`;
      });
    areaPoints = [...upperPts, ...lowerPts].join(' ');
  }

  return (
    <svg viewBox="0 0 420 218" className="w-full h-56">
      <line x1="48" y1="190" x2="404" y2="190" stroke="rgba(255,255,255,0.2)" />
      <line x1="48" y1="16" x2="48" y2="190" stroke="rgba(255,255,255,0.2)" />

      <text x="43" y="188" textAnchor="end" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
        {minY.toFixed(1)}
      </text>
      <text x="43" y="24" textAnchor="end" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
        {maxY.toFixed(1)}
      </text>

      {hasCi && areaPoints && (
        <polygon points={areaPoints} fill="#22D3EE" fillOpacity="0.14" />
      )}

      <polyline fill="none" stroke="#22D3EE" strokeWidth="2.2" points={linePts} />

      {numericRows.map((r, i) => (
        <circle key={r.label + i} cx={mapX(i)} cy={mapY(r.val)} r="3" fill="#10B981" />
      ))}

      <text x="52" y="203" textAnchor="start" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
        {numericRows[0].label}
      </text>
      <text x="396" y="203" textAnchor="end" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
        {numericRows[numericRows.length - 1].label}
      </text>
      <text x="226" y="214" textAnchor="middle" fill="#A1A1AA" fontSize="9" fontFamily="JetBrains Mono">
        Forecast Horizon Trajectory
      </text>
    </svg>
  );
}

export default function ARIMA() {
  const [steps, setSteps] = useState(DEFAULT_STEPS);
  const [order, setOrder] = useState(DEFAULT_ORDER);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const runForecast = useCallback(async (rawSteps, rawOrder) => {
    const cleanSteps = clampInt(rawSteps, 1, 24, DEFAULT_STEPS);
    const cleanOrder = [
      clampInt(rawOrder?.[0], 0, 5, DEFAULT_ORDER[0]),
      clampInt(rawOrder?.[1], 0, 5, DEFAULT_ORDER[1]),
      clampInt(rawOrder?.[2], 0, 5, DEFAULT_ORDER[2]),
    ];
    setSteps(cleanSteps);
    setOrder(cleanOrder);
    setLoading(true);
    try {
      const data = await forecastArima(cleanSteps, cleanOrder);
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
    forecastArima(DEFAULT_STEPS, DEFAULT_ORDER)
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

  const aicValue = result?.aic ?? result?.metrics?.aic ?? '—';
  const rmseValue = result?.metrics?.rmse ?? result?.rmse ?? '—';
  const maeValue = result?.metrics?.mae ?? result?.mae ?? '—';
  const orderValue = Array.isArray(result?.order)
    ? `(${result.order.join(', ')})`
    : `(${order.join(', ')})`;
  const forecastRows = normalizeForecastRows(result);

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_09"
        title="ARIMA_TIME_SERIES_FORECASTING"
        rightLabel="/api/task09/forecast"
        accent="#22D3EE"
      />

      <div className="p-6 sm:p-8 space-y-6">
        {/* 01. Overview & 02. Objective / Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
              01 // OVERVIEW
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Models univariate time-series dynamics using an Autoregressive Integrated Moving
              Average formulation <span className="text-white">ARIMA(p, d, q)</span> via{' '}
              <span className="text-cyan-300">statsmodels</span> and projects multi-step horizons
              with optional confidence intervals.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Capture trend differencing, autoregressive persistence, and lagged error corrections on
              sequential monthly observations so future steps (1–24) can be forecast without
              leaking future target values.
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
              Uses the 36-period monthly time-series dataset (<span className="text-white">monthly_sales.csv</span> / synthetic monthly series) ordered chronologically with no missing target steps in the series window.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // ALGORITHM EXPLANATION
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Applies <span className="text-white">d</span>-order differencing to stabilize non-stationary trends, fits <span className="text-white">p</span> autoregressive lag terms on the differenced series, and estimates <span className="text-white">q</span> moving-average shock terms by maximum likelihood.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Clamps <span className="text-white">steps</span> to <span className="text-white">[1, 24]</span> and <span className="text-white">(p, d, q)</span> orders to <span className="text-white">[0, 5]</span>, fits the ARIMA model on historical periods, logs AIC/RMSE/MAE diagnostics, and outputs step-ahead forecasts.
            </p>
          </div>
        </div>

        {/* 06. Interactive Demo */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
            06 // INTERACTIVE DEMO — HORIZON & ORDER CONTROLS
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runForecast(steps, order);
            }}
            className="flex flex-wrap items-end gap-4 p-4 border border-white/10 bg-white/[0.02] font-mono text-xs"
          >
            <div className="min-w-0">
              <label className="block text-[10px] text-zinc-400 mb-1">STEPS (1–24)</label>
              <input
                type="number"
                min="1"
                max="24"
                step="1"
                value={steps}
                onChange={(e) => {
                  const raw = e.target.value;
                  setSteps(raw === '' ? '' : clampInt(raw, 1, 24, DEFAULT_STEPS));
                }}
                onBlur={() => setSteps((prev) => clampInt(prev, 1, 24, DEFAULT_STEPS))}
                className="px-3 py-2 bg-[#0D0E12] border border-white/15 text-white w-28"
              />
            </div>

            {ORDER_PARAMS.map((param, idx) => (
              <div key={param.key} className="min-w-0">
                <label className="block text-[10px] text-zinc-400 mb-1">{param.label}</label>
                <input
                  type="number"
                  min={param.min}
                  max={param.max}
                  step="1"
                  value={order[idx]}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const next = [...order];
                    next[idx] =
                      raw === '' ? '' : clampInt(raw, param.min, param.max, DEFAULT_ORDER[idx]);
                    setOrder(next);
                  }}
                  onBlur={() => {
                    const next = [...order];
                    next[idx] = clampInt(next[idx], param.min, param.max, DEFAULT_ORDER[idx]);
                    setOrder(next);
                  }}
                  className="px-3 py-2 bg-[#0D0E12] border border-white/15 text-white w-20"
                />
              </div>
            ))}

            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-400 text-[#0A0A0C] font-bold hover:brightness-110 cursor-pointer"
            >
              GENERATE_FORECAST
            </button>
          </form>
        </div>

        {loading && <LoadingState label="FITTING_ARIMA_TIME_SERIES..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {result && (
          <>
            {/* 08. Evaluation Metrics */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                08 // EVALUATION METRICS & MODEL FIT
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="min-w-0">
                  <MetricCard label="ARIMA ORDER" value={orderValue} accent="#22D3EE" />
                </div>
                <div className="min-w-0">
                  <MetricCard label="AIC" value={aicValue} accent="#10B981" />
                </div>
                <div className="min-w-0">
                  <MetricCard label="RMSE" value={rmseValue} accent="#F59E0B" />
                </div>
                <div className="min-w-0">
                  <MetricCard label="MAE" value={maeValue} accent="#A855F7" />
                </div>
              </div>
            </div>

            {/* 07. Visualizations */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                07 // VISUALIZATIONS — FORECAST TRAJECTORY & TABULAR PROJECTIONS
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                  <ChartContainer
                    title="Projected Horizon Curve"
                    subtitle={`Order ${orderValue} · ${forecastRows.length} step(s)`}
                  >
                    {renderForecastSvg(forecastRows)}
                  </ChartContainer>
                </div>

                <div className="lg:col-span-7">
                  <ChartContainer
                    title="Forecasted Future Values"
                    subtitle="Horizon projections with confidence bounds when provided"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full font-mono text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-zinc-400">
                            <th className="py-2 pr-3">Horizon</th>
                            <th className="py-2 px-3">Forecast</th>
                            <th className="py-2 px-3">Lower CI</th>
                            <th className="py-2 px-3">Upper CI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {forecastRows.length ? (
                            forecastRows.map((row) => (
                              <tr key={row.key} className="border-b border-white/5 text-zinc-200">
                                <td className="py-2 pr-3 text-cyan-300">{row.stepLabel}</td>
                                <td className="py-2 px-3 font-bold">{row.forecast}</td>
                                <td className="py-2 px-3 text-zinc-400">{row.lowerCi}</td>
                                <td className="py-2 px-3 text-zinc-400">{row.upperCi}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="py-4 text-center text-zinc-500">
                                No forecast points returned.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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
                  Differencing (<span className="text-white">d</span>) removes baseline drift, while{' '}
                  <span className="text-white">AIC</span> balances goodness-of-fit against parameter
                  complexity across candidate <span className="text-white">(p, d, q)</span>{' '}
                  orders; over-parameterizing lags on short series can widen uncertainty and
                  degrade out-of-sample error (<span className="text-white">RMSE/MAE</span>).
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                  10 // CONCLUSION
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  ARIMA provides an interpretable, fast baseline for univariate monthly forecasting
                  and pairs cleanly with diagnostic ACF/PACF plots when selecting orders for
                  longer-range planning.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}