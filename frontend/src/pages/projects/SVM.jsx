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
        {/* 01. Overview & 02. Objective / Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              01 // OVERVIEW
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Trains a binary <span className="text-white">Support Vector Machine (SVM)</span>{' '}
              classifier with configurable kernel (<span className="text-white">rbf</span>,{' '}
              <span className="text-white">linear</span>, <span className="text-white">poly</span>,{' '}
              <span className="text-white">sigmoid</span>), regularization{' '}
              <span className="text-white">C</span>, and <span className="text-white">gamma</span>{' '}
              to separate two Iris classes and estimate class probabilities.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Construct a maximum-margin decision boundary between{' '}
              <span className="text-white">{subtitleText}</span> from four morphological
              measurements while balancing margin width against misclassification penalty (
              <span className="text-white">C</span>) and kernel locality (
              <span className="text-white">gamma</span>).
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
              Uses the binary subset ({subtitleText}) of the Iris dataset across four numeric
              features (<span className="text-white">Sepal Length</span>,{' '}
              <span className="text-white">Sepal Width</span>,{' '}
              <span className="text-white">Petal Length</span>, and{' '}
              <span className="text-white">Petal Width</span>).
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // ALGORITHM EXPLANATION
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Solves a constrained optimization problem that maximizes the geometric margin between
              classes subject to slack penalties scaled by <span className="text-white">C</span>,
              using kernel inner products <span className="text-white">K(xᵢ, xⱼ)</span> to form
              linear or nonlinear decision surfaces anchored by support vectors.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Validates numeric features and positive <span className="text-white">C</span>, submits{' '}
              <span className="text-white">features</span>, <span className="text-white">kernel</span>
              , <span className="text-white">cValue</span>, and <span className="text-white">gamma</span>{' '}
              to <span className="text-white">/api/task10/predict</span>, and inspects test accuracy,
              support vector count, predicted class, and probability bars.
            </p>
          </div>
        </div>

        {/* 06. Interactive Demo */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            06 // INTERACTIVE DEMO — SPECIMEN & HYPERPARAMETER CONTROLS
          </div>
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
        </div>

        {loading && <LoadingState label="SOLVING_MAXIMUM_MARGIN_HYPERPLANE..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {result && (
          <>
            {/* 08. Evaluation Metrics */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                08 // EVALUATION METRICS & MARGIN DIAGNOSTICS
              </div>
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
            </div>

            {/* 07. Visualizations */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                07 // VISUALIZATIONS — BINARY CLASS PROBABILITY DISTRIBUTION
              </div>
              <ChartContainer title="Binary Class Probabilities" subtitle={subtitleText}>
                <div className="font-mono text-xs text-zinc-300 space-y-3">
                  {probabilityEntries.map(([cls, prob]) => {
                    const numProb = Number(prob) || 0;
                    const pct = Math.min(100, Math.max(0, numProb * 100));
                    return (
                      <div key={cls} className="space-y-1">
                        <div className="flex justify-between border-b border-white/5 py-1">
                          <span>{cls}</span>
                          <span className="text-emerald-400">{pct.toFixed(2)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ChartContainer>
            </div>

            {/* 09. Key Findings & 10. Conclusion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  09 // KEY FINDINGS
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  Only a small subset of boundary observations becomes{' '}
                  <span className="text-white">support vectors</span> defining the separating
                  hyperplane, while tuning <span className="text-white">C</span> and{' '}
                  <span className="text-white">kernel</span> controls how tightly the decision
                  boundary adapts to training points versus generalizing across unseen specimens.
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                  10 // CONCLUSION
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  Support Vector Machines provide strong margin-based binary classification on
                  compact tabular features with tunable kernel flexibility and clear support-vector
                  diagnostics.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}