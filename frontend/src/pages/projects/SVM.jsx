import { useCallback, useEffect, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { predictSvm } from '../../services/api';

const DEFAULT_FEATURES = [5.1, 3.5, 1.4, 0.2];
const DEFAULT_KERNEL = 'rbf';
const DEFAULT_C = 1.0;
const DEFAULT_GAMMA = 'scale';
const FEATURE_LABELS = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];

export default function SVM() {
  const [features, setFeatures] = useState(DEFAULT_FEATURES);
  const [kernel, setKernel] = useState(DEFAULT_KERNEL);
  const [cValue, setCValue] = useState(DEFAULT_C);
  const [gamma, setGamma] = useState(DEFAULT_GAMMA);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const runSvm = useCallback(async (featArr, kern, cVal, gam) => {
    const numericFeatures = featArr.map(Number);
    if (numericFeatures.some((n) => !Number.isFinite(n))) {
      setError('All four feature values must be valid numbers.');
      return;
    }

    const parsedC = Number(cVal);
    if (!Number.isFinite(parsedC) || parsedC <= 0) {
      setError('Regularization parameter C must be a positive number.');
      return;
    }

    setLoading(true);
    try {
      const data = await predictSvm({
        features: numericFeatures,
        kernel: kern,
        cValue: parsedC,
        gamma: gam,
      });
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
    predictSvm({
      features: DEFAULT_FEATURES,
      kernel: DEFAULT_KERNEL,
      cValue: DEFAULT_C,
      gamma: DEFAULT_GAMMA,
    })
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

  const probabilityEntries = Object.entries(result?.probabilities || {});
  const subtitleText = Array.isArray(result?.species_pair)
    ? result.species_pair.join(' vs. ')
    : 'Setosa vs. Versicolor';

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_10"
        title="SUPPORT_VECTOR_MACHINE (BINARY CLASSIFICATION)"
        rightLabel="/api/task10/predict"
        accent="#10B981"
      />

      <div className="p-6 sm:p-8 space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runSvm(features, kernel, cValue, gamma);
          }}
          className="p-4 border border-white/10 bg-white/[0.02] space-y-4 font-mono text-xs"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FEATURE_LABELS.map((lbl, idx) => (
              <div key={lbl} className="min-w-0">
                <label className="block text-[10px] text-zinc-400 mb-1">{lbl}</label>
                <input
                  type="number"
                  step="any"
                  value={features[idx]}
                  onChange={(e) => {
                    const next = [...features];
                    next[idx] = e.target.value;
                    setFeatures(next);
                  }}
                  className="w-full px-3 py-2 bg-[#0D0E12] border border-white/15 text-white"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="min-w-0">
              <label className="block text-[10px] text-zinc-400 mb-1">KERNEL</label>
              <select
                value={kernel}
                onChange={(e) => setKernel(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D0E12] border border-white/15 text-white"
              >
                <option value="rbf">rbf</option>
                <option value="linear">linear</option>
                <option value="poly">poly</option>
                <option value="sigmoid">sigmoid</option>
              </select>
            </div>
            <div className="min-w-0">
              <label className="block text-[10px] text-zinc-400 mb-1">REGULARIZATION (C)</label>
              <input
                type="number"
                step="any"
                min="0.01"
                value={cValue}
                onChange={(e) => setCValue(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D0E12] border border-white/15 text-white"
              />
            </div>
            <div className="min-w-0">
              <label className="block text-[10px] text-zinc-400 mb-1">GAMMA</label>
              <select
                value={gamma}
                onChange={(e) => setGamma(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D0E12] border border-white/15 text-white"
              >
                <option value="scale">scale</option>
                <option value="auto">auto</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-400 text-[#0A0A0C] font-bold hover:brightness-110 cursor-pointer"
          >
            RUN_SVM_CLASSIFIER
          </button>
        </form>

        {loading && <LoadingState label="SOLVING_MAXIMUM_MARGIN_HYPERPLANE..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="min-w-0">
                <MetricCard
                  label="PREDICTED CLASS"
                  value={result.predicted_class ?? '—'}
                  accent="#10B981"
                />
              </div>
              <div className="min-w-0">
                <MetricCard
                  label="TEST ACCURACY"
                  value={result.metrics?.accuracy ?? '—'}
                  accent="#22D3EE"
                />
              </div>
              <div className="min-w-0">
                <MetricCard
                  label="SUPPORT VECTORS"
                  value={result.support_vectors_count ?? '—'}
                  accent="#F59E0B"
                />
              </div>
              <div className="min-w-0">
                <MetricCard label="KERNEL" value={result.kernel ?? kernel} accent="#A855F7" />
              </div>
            </div>

            <ChartContainer title="Binary Class Probabilities" subtitle={subtitleText}>
              <div className="font-mono text-xs text-zinc-300 space-y-2">
                {probabilityEntries.map(([cls, prob]) => (
                  <div key={cls} className="flex justify-between border-b border-white/5 py-1.5">
                    <span>{cls}</span>
                    <span className="text-emerald-400">
                      {(Number(prob) * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </ChartContainer>
          </>
        )}
      </div>
    </div>
  );
}