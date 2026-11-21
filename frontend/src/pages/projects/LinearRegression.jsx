import { useCallback, useEffect, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { predictLinearRegression } from '../../services/api';

export default function LinearRegression() {
  const [area, setArea] = useState(1850);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const runPrediction = useCallback(async (val) => {
    const parsed = Number(val);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError('Please enter a valid positive house area in sq ft.');
      return;
    }
    setLoading(true);
    try {
      const data = await predictLinearRegression(parsed);
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
    predictLinearRegression(1850)
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

  const handleSubmit = (e) => {
    e.preventDefault();
    runPrediction(area);
  };

  const renderFitChart = () => {
    const actual = (result?.sample_points || [])
      .map((pt) => ({
        x: Number(pt?.area_sqft),
        y: Number(pt?.price_usd),
      }))
      .filter((pt) => Number.isFinite(pt.x) && Number.isFinite(pt.y));

    const lineX = result?.regression_line?.x || [];
    const lineY = result?.regression_line?.y || [];
    const linePts = lineX
      .map((xVal, idx) => ({
        x: Number(xVal),
        y: Number(lineY[idx]),
      }))
      .filter((pt) => Number.isFinite(pt.x) && Number.isFinite(pt.y));

    if (!actual.length && linePts.length < 2) {
      return (
        <div className="font-mono text-xs text-zinc-500">
          No regression observation or trendline data available.
        </div>
      );
    }

    const allX = [...actual.map((p) => p.x), ...linePts.map((p) => p.x)];
    const allY = [...actual.map((p) => p.y), ...linePts.map((p) => p.y)];
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;

    const mapX = (x) => 46 + ((x - minX) / spanX) * 352;
    const mapY = (y) => 198 - ((y - minY) / spanY) * 176;

    const polylinePoints = linePts.map((pt) => `${mapX(pt.x)},${mapY(pt.y)}`).join(' ');

    return (
      <svg viewBox="0 0 420 232" className="w-full h-64">
        <line x1="42" y1="202" x2="404" y2="202" stroke="rgba(255,255,255,0.2)" />
        <line x1="42" y1="16" x2="42" y2="202" stroke="rgba(255,255,255,0.2)" />

        <text x="38" y="200" textAnchor="end" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
          ${Math.round(minY / 1000)}k
        </text>
        <text x="38" y="24" textAnchor="end" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
          ${Math.round(maxY / 1000)}k
        </text>

        {actual.map((pt, i) => (
          <circle
            key={i}
            cx={mapX(pt.x)}
            cy={mapY(pt.y)}
            r="3"
            fill="#22D3EE"
            fillOpacity="0.8"
          />
        ))}

        {linePts.length >= 2 && (
          <polyline
            fill="none"
            stroke="#10B981"
            strokeWidth="2.4"
            points={polylinePoints}
          />
        )}

        <text x="46" y="215" textAnchor="start" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
          {Math.round(minX)}
        </text>
        <text x="398" y="215" textAnchor="end" fill="#71717A" fontSize="8.5" fontFamily="JetBrains Mono">
          {Math.round(maxX)}
        </text>
        <text x="220" y="227" textAnchor="middle" fill="#A1A1AA" fontSize="9.5" fontFamily="JetBrains Mono">
          area_sqft vs price_usd
        </text>
      </svg>
    );
  };

  const slopeVal = result?.slope;
  const interceptVal = result?.intercept;
  const sampleCount = Array.isArray(result?.sample_points) ? result.sample_points.length : null;

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_02"
        title="SIMPLE_LINEAR_REGRESSION (HOUSE PRICE PREDICTION)"
        rightLabel="/api/task02/predict"
        accent="#10B981"
      />

      <div className="p-6 sm:p-8 space-y-6">
        {/* 01. Overview & 02. Objective / Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              01 // OVERVIEW
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Fits a univariate <span className="text-white">Ordinary Least Squares (OLS)</span>{' '}
              linear regression model relating house square footage (
              <span className="text-white">area_sqft</span>) to estimated price (
              <span className="text-white">price_usd</span>), paired with fit diagnostics and an
              interactive horizon/area predictor.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Estimate continuous property values from floor area using a closed-form linear trend
              while quantifying explained variance (<span className="text-white">R²</span>) and
              typical prediction error (<span className="text-white">RMSE</span>) across observed
              samples.
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
              Uses paired <span className="text-white">area_sqft</span> and{' '}
              <span className="text-white">price_usd</span> observations
              {sampleCount ? ` (${sampleCount} plotted sample points)` : ''} generated with{' '}
              <span className="text-white">seed=42</span> for demonstration purposes rather than
              an external real-estate market feed.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // ALGORITHM EXPLANATION
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Models <span className="text-white">ŷ = β0 + β1 · x</span> by minimizing the sum of
              squared residuals <span className="text-white">Σ(yᵢ - ŷᵢ)²</span>, where{' '}
              <span className="text-white">β1</span> is the marginal price change per square foot
              and <span className="text-white">β0</span> is the baseline intercept.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Validates positive square-footage input, requests OLS regression parameters, fit
              metrics (<span className="text-white">R²</span>, <span className="text-white">RMSE</span>
              ), sample scatter points, and fitted trendline coordinates from{' '}
              <span className="text-white">/api/task02/predict</span>, and renders the predicted
              price.
            </p>
          </div>
        </div>

        {/* 06. Interactive Demo */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            06 // INTERACTIVE DEMO — FLOOR AREA INPUT
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap items-end gap-4 p-4 border border-white/10 bg-white/[0.02]"
          >
            <div>
              <label className="block font-mono text-[11px] text-zinc-400 mb-1">
                HOUSE_AREA (SQ FT)
              </label>
              <input
                type="number"
                min="100"
                max="25000"
                step="10"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="px-3.5 py-2 bg-[#0D0E12] border border-white/15 font-mono text-sm text-white w-48"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 font-mono text-xs font-bold text-[#0A0A0C] bg-emerald-400 hover:brightness-110 cursor-pointer"
            >
              PREDICT_PRICE
            </button>
          </form>
        </div>

        {loading && <LoadingState label="COMPUTING_OLS_PREDICTION..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {result && (
          <>
            {result?.is_synthetic && (
              <div className="p-3 border border-amber-500/40 bg-amber-500/5 font-mono text-xs text-amber-200">
                <strong>SYNTHETIC_DATASET_NOTICE:</strong> Predictions and OLS metrics use
                generated demonstration housing data (`area_sqft` vs `price_usd`, seed=42), not a
                real-world real estate dataset.
              </div>
            )}

            {/* 08. Evaluation Metrics */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                08 // EVALUATION METRICS & OLS PARAMETERS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <div className="min-w-0">
                  <MetricCard
                    label="PREDICTED PRICE"
                    value={
                      result.predicted_price_usd != null
                        ? `$${Number(result.predicted_price_usd).toLocaleString()}`
                        : '—'
                    }
                    accent="#10B981"
                  />
                </div>
                <div className="min-w-0">
                  <MetricCard label="R² SCORE" value={result.metrics?.r2 ?? '—'} accent="#22D3EE" />
                </div>
                <div className="min-w-0">
                  <MetricCard label="RMSE" value={result.metrics?.rmse ?? '—'} accent="#F59E0B" />
                </div>
                <div className="min-w-0">
                  <MetricCard
                    label="SLOPE (β1)"
                    value={slopeVal != null ? Number(slopeVal).toFixed(4) : '—'}
                    accent="#A855F7"
                  />
                </div>
                <div className="min-w-0">
                  <MetricCard
                    label="INTERCEPT (β0)"
                    value={interceptVal != null ? Number(interceptVal).toFixed(4) : '—'}
                    accent="#22D3EE"
                  />
                </div>
              </div>
            </div>

            {/* 07. Visualizations */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                07 // VISUALIZATIONS — OBSERVATIONS & OLS FIT LINE
              </div>
              <ChartContainer
                title="Actual Observations vs. OLS Regression Line"
                subtitle="Sample observations (cyan) with fitted OLS trendline (emerald)"
              >
                {renderFitChart()}
              </ChartContainer>
            </div>

            {/* 09. Key Findings & 10. Conclusion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  09 // KEY FINDINGS
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  A single continuous size predictor captures the primary upward price trajectory via{' '}
                  <span className="text-white">β1</span>, while residual scatter around the OLS line
                  shows how dispersion drives <span className="text-white">RMSE</span> and bounds{' '}
                  <span className="text-white">R²</span> when non-area factors (location, condition,
                  rooms) are omitted.
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                  10 // CONCLUSION
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  Simple linear regression provides an interpretable, fast baseline for continuous
                  price estimation and establishes a reference point before adding multivariate
                  features or nonlinear regressors.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}