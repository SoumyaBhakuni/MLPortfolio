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

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_06"
        title="NAIVE_BAYES_TEXT_CLASSIFICATION (SPAM DETECTION)"
        rightLabel="/api/task06/predict"
        accent="#10B981"
      />

      <div className="p-6 sm:p-8 space-y-6">
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

        {loading && <LoadingState label="VECTORIZING_&_COMPUTING_POSTERIORS..." />}
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

            <ChartContainer
              title="Normalized Text & Class Probabilities"
              subtitle={result.processed_text ?? result.cleaned_text ?? ''}
            >
              <div className="font-mono text-xs text-zinc-300 space-y-2">
                <div>
                  P(Not Spam / Ham): <span className="text-emerald-400">{hamProb}</span> | P(Spam):{' '}
                  <span className="text-amber-400">{spamProb}</span>
                </div>
                <div className="text-zinc-400">
                  Top Spam Indicators: {indicators.length ? indicators.join(', ') : 'none'}
                </div>
              </div>
            </ChartContainer>
          </>
        )}
      </div>
    </div>
  );
}