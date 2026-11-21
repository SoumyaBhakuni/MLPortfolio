import { useCallback, useEffect, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { predictNaiveBayes } from '../../services/api';

const SAMPLES = [
  'Congratulations! You won a free gift voucher. Reply CLAIM now!',
  'Hey, can you share today’s machine learning lab notes?',
];

export default function NaiveBayes() {
  const [message, setMessage] = useState(SAMPLES[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const classifyText = useCallback(async (txt) => {
    const trimmed = String(txt ?? '').trim();
    if (!trimmed) {
      setError('Please enter a message to classify.');
      return;
    }
    setLoading(true);
    try {
      const data = await predictNaiveBayes(trimmed);
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
    predictNaiveBayes(SAMPLES[0])
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

  const rawPred = String(result?.prediction ?? '').trim();
  const isSpam = Boolean(result?.is_spam) || rawPred.toLowerCase() === 'spam';
  const hamProb = result?.probabilities?.not_spam ?? result?.probabilities?.ham ?? '—';
  const spamProb = result?.probabilities?.spam ?? '—';
  const indicators = result?.top_spam_indicators || result?.tokens || [];

  const numHam = Number(hamProb);
  const numSpam = Number(spamProb);
  const hasNumericProbs = Number.isFinite(numHam) && Number.isFinite(numSpam);
  const hamPct = hasNumericProbs
    ? Math.min(100, Math.max(0, numHam <= 1 ? numHam * 100 : numHam))
    : 0;
  const spamPct = hasNumericProbs
    ? Math.min(100, Math.max(0, numSpam <= 1 ? numSpam * 100 : numSpam))
    : 0;

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_06"
        title="NAIVE_BAYES_TEXT_CLASSIFICATION (SPAM DETECTION)"
        rightLabel="/api/task06/predict"
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
              Applies a <span className="text-white">Naive Bayes</span> text classifier over
              tokenized message features to score incoming messages as{' '}
              <span className="text-white">spam</span> or{' '}
              <span className="text-white">not_spam (ham)</span>, surfacing posterior
              probabilities, normalized text, and key spam token indicators.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Separate unsolicited promotional or deceptive messages from legitimate notes and
              everyday communication with high precision and F1 score while maintaining transparent
              token-level evidence.
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
              Trained on labeled short text messages across two classes (
              <span className="text-white">spam</span> vs.{' '}
              <span className="text-white">not_spam / ham</span>), spanning promotional offers,
              reward claims, and routine conversational queries.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // ALGORITHM EXPLANATION
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Uses Bayes&apos; theorem with conditional token independence given class:{' '}
              <span className="text-white">P(c | x) ∝ P(c) · Π P(tᵢ | c)</span>, estimating
              smoothed token likelihoods across vocabulary counts to compute posterior class
              probabilities.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Trims and validates non-empty message text, posts to{' '}
              <span className="text-white">/api/task06/predict</span> for text normalization,
              feature vectorization, and posterior scoring, and renders classification metrics,
              class probabilities, and top spam indicators.
            </p>
          </div>
        </div>

        {/* 06. Interactive Demo */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
            06 // INTERACTIVE DEMO — MESSAGE INPUT & SAMPLE PRESETS
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              classifyText(message);
            }}
            className="p-4 border border-white/10 bg-white/[0.02] space-y-3"
          >
            <div className="flex flex-wrap gap-2 font-mono text-[11px]">
              {SAMPLES.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMessage(s);
                    classifyText(s);
                  }}
                  className="px-2.5 py-1 border border-white/15 text-zinc-300 hover:border-emerald-400 cursor-pointer"
                >
                  SAMPLE_0{idx + 1}
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-[#0D0E12] border border-white/15 text-sm text-white"
            />
            <button
              type="submit"
              className="px-5 py-2.5 font-mono text-xs font-bold text-[#0A0A0C] bg-emerald-400 hover:brightness-110 cursor-pointer"
            >
              CLASSIFY_MESSAGE
            </button>
          </form>
        </div>

        {loading && <LoadingState label="VECTORIZING_&_COMPUTING_POSTERIORS..." />}
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
                08 // EVALUATION METRICS & MODEL PERFORMANCE
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="min-w-0">
                  <MetricCard
                    label="PREDICTION"
                    value={rawPred ? rawPred.toUpperCase() : isSpam ? 'SPAM' : 'NOT_SPAM'}
                    accent={isSpam ? '#F59E0B' : '#10B981'}
                  />
                </div>
                <div className="min-w-0">
                  <MetricCard
                    label="ACCURACY"
                    value={result.metrics?.accuracy ?? '—'}
                    accent="#22D3EE"
                  />
                </div>
                <div className="min-w-0">
                  <MetricCard
                    label="PRECISION"
                    value={result.metrics?.precision ?? '—'}
                    accent="#10B981"
                  />
                </div>
                <div className="min-w-0">
                  <MetricCard
                    label="F1 SCORE"
                    value={result.metrics?.f1_score ?? '—'}
                    accent="#A855F7"
                  />
                </div>
              </div>
            </div>

            {/* 07. Visualizations */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                07 // VISUALIZATIONS — POSTERIOR PROBABILITIES, TEXT NORMALIZATION & INDICATORS
              </div>
              <ChartContainer
                title="Normalized Text & Class Probabilities"
                subtitle={result.processed_text ?? result.cleaned_text ?? ''}
              >
                <div className="font-mono text-xs text-zinc-300 space-y-4">
                  <div>
                    P(Not Spam / Ham): <span className="text-emerald-400">{hamProb}</span> | P(Spam):{' '}
                    <span className="text-amber-400">{spamProb}</span>
                  </div>

                  {hasNumericProbs && (
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-emerald-300">NOT_SPAM / HAM</span>
                          <span>{hamPct.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${hamPct}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-amber-300">SPAM</span>
                          <span>{spamPct.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 overflow-hidden">
                          <div className="h-full bg-amber-400" style={{ width: `${spamPct}%` }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-zinc-400 pt-1 border-t border-white/10">
                    Top Spam Indicators:{' '}
                    <span className="text-zinc-200">
                      {indicators.length ? indicators.join(', ') : 'none'}
                    </span>
                  </div>
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
                  High-signal imperative and promotional tokens drive elevated{' '}
                  <span className="text-white">P(Spam)</span> posteriors, while text
                  normalization reduces case and punctuation variation so unseen phrasings still map
                  onto learned vocabulary likelihoods.
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                  10 // CONCLUSION
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  Naive Bayes offers fast, interpretable short-text spam filtering with clear
                  probability and token diagnostics, serving as an effective baseline before
                  sequence or transformer text models.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}