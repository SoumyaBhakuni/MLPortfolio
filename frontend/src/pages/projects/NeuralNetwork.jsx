import { useCallback, useEffect, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { predictNeuralNetwork } from '../../services/api';

const PRESET_ZERO = [
  0, 0, 5, 13, 9, 1, 0, 0,
  0, 0, 13, 15, 10, 15, 5, 0,
  0, 3, 15, 2, 0, 11, 8, 0,
  0, 4, 12, 0, 0, 8, 8, 0,
  0, 5, 8, 0, 0, 9, 8, 0,
  0, 4, 11, 0, 1, 12, 7, 0,
  0, 2, 14, 5, 10, 12, 0, 0,
  0, 0, 6, 13, 10, 0, 0, 0,
];

function normalizeProbabilities(rawProbs) {
  if (Array.isArray(rawProbs)) {
    return rawProbs.map((item, idx) => ({
      digit: item?.digit ?? idx,
      probability: Number(item?.probability ?? 0) || 0,
    }));
  }

  if (rawProbs && typeof rawProbs === 'object') {
    return Object.entries(rawProbs).map(([digit, probability]) => ({
      digit,
      probability: Number(probability) || 0,
    }));
  }

  return [];
}

export default function NeuralNetwork() {
  const [grid, setGrid] = useState(PRESET_ZERO);
  const [drawing, setDrawing] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const recognize = useCallback(async (pixels) => {
    setLoading(true);
    try {
      const data = await predictNeuralNetwork(pixels);
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
    predictNeuralNetwork(PRESET_ZERO)
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

  useEffect(() => {
    const stopDrawing = () => setDrawing(false);
    window.addEventListener('pointerup', stopDrawing);
    window.addEventListener('pointercancel', stopDrawing);
    return () => {
      window.removeEventListener('pointerup', stopDrawing);
      window.removeEventListener('pointercancel', stopDrawing);
    };
  }, []);

  const paintCell = (idx) => {
    setGrid((prev) => {
      const next = [...prev];
      next[idx] = 15;
      return next;
    });
  };

  const probabilityRows = normalizeProbabilities(result?.probabilities);
  const rawAccuracy =
    result?.metrics?.test_accuracy ??
    result?.metrics?.accuracy ??
    result?.classification_report?.accuracy;
  const formattedAccuracy =
    rawAccuracy !== undefined && rawAccuracy !== null && Number.isFinite(Number(rawAccuracy))
      ? `${(Number(rawAccuracy) * 100).toFixed(2)}%`
      : '—';

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_08"
        title="NEURAL_NETWORK (HANDWRITTEN DIGIT RECOGNITION)"
        rightLabel="/api/task08/predict"
        accent="#A855F7"
      />

      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            <ChartContainer
              title="8x8 Interactive Digit Grid"
              subtitle="Click or drag across cells to draw a digit"
            >
              <div className="grid grid-cols-8 gap-1 w-64 h-64 mx-auto select-none border border-white/15 p-1.5 bg-[#0A0A0C] touch-none">
                {grid.map((val, idx) => (
                  <div
                    key={idx}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      setDrawing(true);
                      paintCell(idx);
                    }}
                    onPointerEnter={() => {
                      if (drawing) paintCell(idx);
                    }}
                    className="cursor-crosshair border border-white/5 transition-colors duration-75"
                    style={{
                      backgroundColor:
                        val > 0
                          ? `rgba(168, 85, 247, ${Math.min(1, val / 16)})`
                          : '#111217',
                    }}
                  />
                ))}
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => recognize(grid)}
                  className="px-4 py-2 bg-purple-500 text-white font-bold hover:brightness-110 cursor-pointer"
                >
                  RECOGNIZE_DIGIT
                </button>
                <button
                  type="button"
                  onClick={() => setGrid(Array(64).fill(0))}
                  className="px-4 py-2 border border-white/15 text-zinc-300 hover:text-white cursor-pointer"
                >
                  CLEAR
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGrid(PRESET_ZERO);
                    recognize(PRESET_ZERO);
                  }}
                  className="px-4 py-2 border border-white/15 text-zinc-300 hover:text-white cursor-pointer"
                >
                  PRESET_0
                </button>
              </div>
            </ChartContainer>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {loading && <LoadingState label="FORWARD_PASSING_MLP_NETWORK..." />}
            {error && (
              <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
                {error}
              </div>
            )}

            {result && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="min-w-0">
                    <MetricCard
                      label="PREDICTED DIGIT"
                      value={result.predicted_digit ?? '—'}
                      accent="#A855F7"
                    />
                  </div>
                  <div className="min-w-0">
                    <MetricCard
                      label="CONFIDENCE"
                      value={`${(Number(result.confidence ?? 0) * 100).toFixed(2)}%`}
                      accent="#10B981"
                    />
                  </div>
                  <div className="min-w-0">
                    <MetricCard
                      label="TEST ACCURACY"
                      value={formattedAccuracy}
                      accent="#22D3EE"
                    />
                  </div>
                </div>

                <ChartContainer
                  title="Softmax Output Probabilities (Digits 0–9)"
                  subtitle={result.architecture || 'Multi-layer perceptron class confidence'}
                >
                  <div className="space-y-2 font-mono text-xs">
                    {probabilityRows.map((p) => (
                      <div key={p.digit} className="flex items-center gap-3">
                        <span className="w-6 text-zinc-300">{p.digit}</span>
                        <div className="flex-1 h-2 bg-white/10">
                          <div
                            className="h-full bg-purple-400"
                            style={{ width: `${Math.min(100, p.probability * 100)}%` }}
                          />
                        </div>
                        <span className="w-16 text-right text-zinc-400">
                          {(p.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </ChartContainer>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}