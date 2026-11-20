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
                  next[idx] = raw === '' ? '' : clampInt(raw, param.min, param.max, DEFAULT_ORDER[idx]);
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

        {loading && <LoadingState label="FITTING_ARIMA_TIME_SERIES..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {result && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}