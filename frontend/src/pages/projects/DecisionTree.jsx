import { useCallback, useEffect, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { predictDecisionTree } from '../../services/api';

const DEFAULT_FEATURES = [5.8, 2.7, 5.1, 1.9];
const DEFAULT_DEPTH = 3;
const FEATURE_LABELS = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];

function normalizeProbabilities(rawProbs) {
  if (!rawProbs) return [];
  if (Array.isArray(rawProbs)) {
    return rawProbs.map((item, idx) => ({
      label: item?.class ?? item?.label ?? `Class ${idx}`,
      probability: Number(item?.probability ?? item?.score ?? 0) || 0,
    }));
  }
  if (typeof rawProbs === 'object') {
    return Object.entries(rawProbs).map(([label, probability]) => ({
      label,
      probability: Number(probability) || 0,
    }));
  }
  return [];
}

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

  const probabilityRows = normalizeProbabilities(
    result?.probabilities ?? result?.class_probabilities
  );

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_05"
        title="DECISION_TREE_CLASSIFIER (IRIS DATASET)"
        rightLabel="/api/task05/predict"
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
              Trains a supervised CART <span className="text-white">DecisionTreeClassifier</span>{' '}
              on botanical measurements to predict Iris species while exposing human-readable
              decision rules and depth-controlled generalization trade-offs.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Classify specimens across <span className="text-white">Setosa</span>,{' '}
              <span className="text-white">Versicolor</span>, and{' '}
              <span className="text-white">Virginica</span> from four continuous measurements while
              preventing leaf-level overfitting via <span className="text-white">max_depth</span>{' '}
              regularization.
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
              Uses the 150-sample Iris dataset with four numeric features (<span className="text-white">Sepal Length</span>, <span className="text-white">Sepal Width</span>, <span className="text-white">Petal Length</span>, <span className="text-white">Petal Width</span>) across three balanced species classes (50 samples each).
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // ALGORITHM EXPLANATION
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Recursively partitions feature space using axis-aligned threshold splits that maximize class purity (such as Gini impurity reduction) until reaching <span className="text-white">max_depth</span> or pure leaf nodes.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Splits features and species targets into train/test sets, fits <span className="text-white">DecisionTreeClassifier</span> with <span className="text-white">max_depth</span> clamped to <span className="text-white">[1, 12]</span> (no feature scaling required for monotonic threshold splits), and logs accuracy, weighted F1, and tree rules.
            </p>
          </div>
        </div>

        {/* 06. Interactive Demo */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
            06 // INTERACTIVE DEMO — SPECIMEN FEATURES & MAX DEPTH
          </div>
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
        </div>

        {loading && <LoadingState label="EVALUATING_DECISION_TREE..." />}
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
                08 // EVALUATION METRICS & MODEL PARAMETERS
              </div>
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
            </div>

            {/* 07. Visualizations */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                07 // VISUALIZATIONS — DECISION TREE RULES & CLASS CONFIDENCE
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {result.tree_rules && (
                  <div className={probabilityRows.length ? 'lg:col-span-7' : 'lg:col-span-12'}>
                    <ChartContainer
                      title="Extracted Decision Tree Rules"
                      subtitle="Textual tree split hierarchy"
                    >
                      <pre className="font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                        {result.tree_rules}
                      </pre>
                    </ChartContainer>
                  </div>
                )}

                {probabilityRows.length > 0 && (
                  <div className={result.tree_rules ? 'lg:col-span-5' : 'lg:col-span-12'}>
                    <ChartContainer
                      title="Class Probability Distribution"
                      subtitle="Leaf class proportions for input specimen"
                    >
                      <div className="space-y-3 font-mono text-xs">
                        {probabilityRows.map((row) => {
                          const pct = Math.min(100, Math.max(0, row.probability * 100));
                          return (
                            <div key={row.label} className="space-y-1">
                              <div className="flex justify-between text-zinc-200">
                                <span>{row.label}</span>
                                <span className="text-cyan-300">{pct.toFixed(1)}%</span>
                              </div>
                              <div className="h-2 bg-white/10 overflow-hidden">
                                <div
                                  className="h-full bg-cyan-400"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ChartContainer>
                  </div>
                )}
              </div>
            </div>

            {/* 09. Key Findings & 10. Conclusion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  09 // KEY FINDINGS
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  Petal dimensions (<span className="text-white">Petal Length</span> and{' '}
                  <span className="text-white">Petal Width</span>) typically drive the primary
                  splits separating Setosa from Versicolor and Virginica, while shallow-to-moderate{' '}
                  <span className="text-white">max_depth</span> values (~2–4) preserve strong
                  test accuracy and weighted F1 without memorizing boundary noise.
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                  10 // CONCLUSION
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  A depth-bounded decision tree delivers transparent, rule-inspectable botanical
                  classification on Iris and serves as a clear baseline before exploring ensemble
                  trees or margin-based classifiers.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}