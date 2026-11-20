import { useCallback, useEffect, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { predictDecisionTree } from '../../services/api';

const DEFAULT_FEATURES = [5.8, 2.7, 5.1, 1.9];
const DEFAULT_DEPTH = 3;
const FEATURE_LABELS = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];

export default function DecisionTree() {
  const [features, setFeatures] = useState(DEFAULT_FEATURES);
  const [maxDepth, setMaxDepth] = useState(DEFAULT_DEPTH);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const runModel = useCallback(async (featArr, depthVal) => {
    const numericFeatures = featArr.map(Number);
    if (numericFeatures.some((n) => !Number.isFinite(n))) {
      setError('All four morphological feature values must be valid numbers.');
      return;
    }

    const clampedDepth = Math.min(12, Math.max(1, Number(depthVal) || DEFAULT_DEPTH));
    setMaxDepth(clampedDepth);
    setLoading(true);
    try {
      const data = await predictDecisionTree(numericFeatures, clampedDepth);
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
    predictDecisionTree(DEFAULT_FEATURES, DEFAULT_DEPTH)
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

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_05"
        title="DECISION_TREE_CLASSIFIER (IRIS DATASET)"
        rightLabel="/api/task05/predict"
        accent="#22D3EE"
      />

      <div className="p-6 sm:p-8 space-y-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            runModel(features, maxDepth);
          }}
          className="p-4 border border-white/10 bg-white/[0.02] space-y-4"
        >
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            {FEATURE_LABELS.map((lbl, idx) => (
              <div key={lbl} className="min-w-0">
                <label className="block text-[10px] text-zinc-400 mb-1">{lbl}</label>
                <input
                  type="number"
                  step="0.1"
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
            <div className="min-w-0">
              <label className="block text-[10px] text-zinc-400 mb-1">MAX_DEPTH (1–12)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={maxDepth}
                onChange={(e) => setMaxDepth(e.target.value)}
                className="w-full px-3 py-2 bg-[#0D0E12] border border-white/15 text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 font-mono text-xs font-bold text-[#0A0A0C] bg-cyan-400 hover:brightness-110 cursor-pointer"
          >
            CLASSIFY_SPECIMEN
          </button>
        </form>

        {loading && <LoadingState label="EVALUATING_DECISION_TREE..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {result && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="min-w-0">
                <MetricCard
                  label="PREDICTED SPECIES"
                  value={result.predicted_class ?? '—'}
                  accent="#22D3EE"
                />
              </div>
              <div className="min-w-0">
                <MetricCard
                  label="TEST ACCURACY"
                  value={result.metrics?.accuracy ?? '—'}
                  accent="#10B981"
                />
              </div>
              <div className="min-w-0">
                <MetricCard
                  label="WEIGHTED F1"
                  value={result.metrics?.f1_score ?? '—'}
                  accent="#F59E0B"
                />
              </div>
              <div className="min-w-0">
                <MetricCard
                  label="MAX DEPTH"
                  value={result.max_depth ?? maxDepth}
                  accent="#A855F7"
                />
              </div>
            </div>

            {result.tree_rules && (
              <ChartContainer
                title="Extracted Decision Tree Rules"
                subtitle="Textual tree split hierarchy"
              >
                <pre className="font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                  {result.tree_rules}
                </pre>
              </ChartContainer>
            )}
          </>
        )}
      </div>
    </div>
  );
}