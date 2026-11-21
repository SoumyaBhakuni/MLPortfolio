import { useEffect, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { classifyImage } from '../../services/api';

const LABELLED_SAMPLE_PRESETS = [
  { filename: 'test_red_fruit.png', trueLabel: 'Red Object / Fruit' },
  { filename: 'test_orange_fruit.png', trueLabel: 'Orange Object / Fruit' },
  { filename: 'test_analog_clock.png', trueLabel: 'Clock / Dial' },
  { filename: 'test_grid_pattern.png', trueLabel: 'Grid / Geometric Pattern' },
];

export default function ImageClassification() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(LABELLED_SAMPLE_PRESETS[0]);
  const [trueLabelInput, setTrueLabelInput] = useState(LABELLED_SAMPLE_PRESETS[0].trueLabel);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    classifyImage({
      filename: LABELLED_SAMPLE_PRESETS[0].filename,
      trueLabel: LABELLED_SAMPLE_PRESETS[0].trueLabel,
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

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleClassify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = selectedFile
        ? await classifyImage({
            file: selectedFile,
            trueLabel: trueLabelInput.trim() || null,
          })
        : await classifyImage({
            filename: selectedPreset.filename,
            trueLabel: trueLabelInput.trim() || selectedPreset.trueLabel,
          });
      setResult(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isFallback =
    Boolean(result?.is_fallback) ||
    String(result?.engine || '').toLowerCase().includes('fallback');
  const usedSampleInput = Boolean(result?.used_synthetic_input);
  const top1Label = result?.predicted_class ?? result?.predicted_label ?? result?.top_1 ?? '—';
  const trueLabelShown = result?.true_label || trueLabelInput || 'Unlabelled Upload';
  const maxTop5Confidence = Math.max(
    0,
    ...(result?.top_5 || []).map((item) => Number(item?.confidence ?? 0))
  );
  const top1Confidence =
    Number(result?.confidence) > 0 ? Number(result.confidence) : maxTop5Confidence;
  const shapeText = Array.isArray(result?.input_shape)
    ? result.input_shape.join('x')
    : '224x224x3';
  const evalData = result?.evaluation;

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_03"
        title="IMAGE_CLASSIFICATION (PRE-TRAINED MOBILENETV2)"
        rightLabel="/api/task03/classify"
        accent="#F59E0B"
      />

      <div className="p-6 sm:p-8 space-y-6">
        {/* 01. Overview & 02. Objective / Problem Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              01 // OVERVIEW
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Runs image classification through a pretrained{' '}
              <span className="text-white">MobileNetV2</span> vision pipeline on{' '}
              <span className="text-white">{shapeText}</span> RGB inputs, validates uploaded image
              files, compares true vs. predicted labels, and reports evaluation accuracy and a
              confusion matrix.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Classify uploaded or sample images reliably using cached{' '}
              <span className="text-white">MobileNetV2</span> weights while keeping fallback/demo
              mode clearly labeled and never conflated with genuine neural network predictions.
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
              Uses a labelled local test set (fruit/object scenes, analog clock dial, and grid
              pattern) with ground-truth labels alongside validated user uploads (JPEG, PNG, WebP,
              GIF) resized to <span className="text-white">{shapeText}</span>.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // ALGORITHM EXPLANATION
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              <span className="text-white">MobileNetV2</span> uses inverted residual blocks and
              depthwise separable convolutions to extract spatial features efficiently and output
              probabilities across 1,000 ImageNet classes.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Validates file format/size/dimensions, caches <span className="text-white">MobileNetV2</span>{' '}
              in memory, records both true and predicted labels, and computes evaluation accuracy and
              a confusion matrix across the labelled test set.
            </p>
          </div>
        </div>

        {/* 06. Interactive Demo */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
            06 // INTERACTIVE DEMO — LABELLED TEST SAMPLE OR VALIDATED IMAGE UPLOAD
          </div>
          <form
            onSubmit={handleClassify}
            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 border border-white/10 bg-white/[0.02]"
          >
            <div className="md:col-span-4 space-y-1">
              <label className="block font-mono text-[10px] text-zinc-400">
                LABELLED TEST SAMPLE
              </label>
              <select
                value={selectedPreset.filename}
                onChange={(e) => {
                  const found =
                    LABELLED_SAMPLE_PRESETS.find((p) => p.filename === e.target.value) ||
                    LABELLED_SAMPLE_PRESETS[0];
                  setSelectedFile(null);
                  setPreviewUrl('');
                  setSelectedPreset(found);
                  setTrueLabelInput(found.trueLabel);
                }}
                className="w-full px-3 py-2 bg-[#0D0E12] border border-white/15 font-mono text-xs text-zinc-200"
              >
                {LABELLED_SAMPLE_PRESETS.map((p) => (
                  <option key={p.filename} value={p.filename}>
                    {p.filename} ({p.trueLabel})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="block font-mono text-[10px] text-zinc-400">
                TRUE / EXPECTED LABEL
              </label>
              <input
                type="text"
                value={trueLabelInput}
                onChange={(e) => setTrueLabelInput(e.target.value)}
                placeholder="e.g. Coffee Mug or Clock"
                className="w-full px-3 py-2 bg-[#0D0E12] border border-white/15 font-mono text-xs text-zinc-200"
              />
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="block font-mono text-[10px] text-zinc-400">
                UPLOAD IMAGE (JPEG/PNG/WEBP)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="w-full font-mono text-xs text-zinc-300 file:mr-2 file:px-2.5 py-1.5 file:border file:border-white/20 file:bg-[#0D0E12] file:text-zinc-200"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full px-4 py-2.5 font-mono text-xs font-bold text-[#0A0A0C] bg-amber-400 hover:brightness-110 cursor-pointer"
              >
                CLASSIFY
              </button>
            </div>
          </form>
        </div>

        {loading && <LoadingState label="RUNNING_MOBILENETV2_INFERENCE..." />}
        {error && (
          <div className="p-4 border border-rose-500/40 bg-rose-500/10 font-mono text-xs text-rose-200">
            {error}
          </div>
        )}

        {result && (
          <>
            {isFallback && (
              <div className="p-4 border border-amber-500/50 bg-amber-500/10 font-mono text-xs text-amber-200">
                <strong>FALLBACK / DEMO HEURISTIC ACTIVE:</strong> Pretrained MobileNetV2 (ImageNet)
                is not active in this runtime ({result.engine || 'Heuristic Fallback'}). Shown
                scores are a non-model fallback demonstration and do not represent ImageNet model
                accuracy.
                {result.fallback_reason ? ` Details: ${result.fallback_reason}` : ''}
              </div>
            )}

            {usedSampleInput && (
              <div className="p-3 border border-cyan-500/30 bg-cyan-500/5 font-mono text-xs text-cyan-200">
                Using labelled sample <span className="text-white">{selectedPreset.filename}</span>{' '}
                (True Label: <span className="text-white">{trueLabelShown}</span>). You can also
                upload your own JPEG, PNG, or WebP image above.
              </div>
            )}

            {/* 08. Evaluation Metrics */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                08 // EVALUATION METRICS — TRUE VS. PREDICTED & TEST SET ACCURACY
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="min-w-0">
                  <MetricCard label="TRUE LABEL" value={trueLabelShown} accent="#22D3EE" />
                </div>
                <div className="min-w-0">
                  <MetricCard label="PREDICTED LABEL" value={top1Label} accent="#F59E0B" />
                </div>
                <div className="min-w-0">
                  <MetricCard
                    label="TOP-1 CONFIDENCE"
                    value={`${(top1Confidence * 100).toFixed(2)}%`}
                    accent="#10B981"
                  />
                </div>
                <div className="min-w-0">
                  <MetricCard
                    label="EVAL SET ACCURACY"
                    value={
                      evalData?.accuracy !== undefined
                        ? `${(Number(evalData.accuracy) * 100).toFixed(2)}%`
                        : '—'
                    }
                    accent="#A855F7"
                  />
                </div>
              </div>
            </div>

            {/* 07. Visualizations */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                07 // VISUALIZATIONS — INPUT PREVIEW, TOP-5 PROBABILITIES & CONFUSION MATRIX
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {previewUrl && (
                  <div className="lg:col-span-4">
                    <ChartContainer title="Uploaded Input Image" subtitle={`Resized to ${shapeText}`}>
                      <img
                        src={previewUrl}
                        alt="Uploaded preview"
                        className="w-full max-h-64 object-contain border border-white/10"
                      />
                    </ChartContainer>
                  </div>
                )}

                <div className={previewUrl ? 'lg:col-span-8' : 'lg:col-span-12'}>
                  <ChartContainer
                    title="Top-5 Predicted Classes"
                    subtitle={`True: ${trueLabelShown} · Predicted: ${top1Label} · Input ${shapeText}`}
                  >
                    <div className="space-y-3 font-mono text-xs">
                      {(result.top_5 || []).map((item, idx) => {
                        const conf = Number(item.confidence ?? 0);
                        const pct = Math.min(100, Math.max(0, conf * 100));
                        const rowKey = item.class_id ? `${item.class_id}-${idx}` : `row-${idx}`;
                        return (
                          <div key={rowKey} className="space-y-1">
                            <div className="flex justify-between text-zinc-200">
                              <span>{item.label}</span>
                              <span className="text-amber-300">{pct.toFixed(2)}%</span>
                            </div>
                            <div className="h-2 bg-white/10 overflow-hidden">
                              <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ChartContainer>
                </div>
              </div>

              {evalData && Array.isArray(evalData.samples) && (
                <ChartContainer
                  title="Labelled Test Set Results & Confusion Matrix"
                  subtitle={`Samples: ${evalData.total_samples} · Accuracy: ${(Number(evalData.accuracy || 0) * 100).toFixed(2)}%${evalData.is_fallback_evaluation ? ' · Fallback Heuristic Mode' : ' · MobileNetV2'}`}
                >
                  <div className="overflow-x-auto font-mono text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-zinc-400">
                          <th className="py-2 pr-3">FILE</th>
                          <th className="py-2 px-3">TRUE LABEL</th>
                          <th className="py-2 px-3">PREDICTED LABEL</th>
                          <th className="py-2 px-3">CONFIDENCE</th>
                          <th className="py-2 pl-3">MATCH</th>
                        </tr>
                      </thead>
                      <tbody>
                        {evalData.samples.map((row) => (
                          <tr key={row.filename} className="border-b border-white/5 text-zinc-200">
                            <td className="py-2 pr-3">{row.filename}</td>
                            <td className="py-2 px-3 text-cyan-300">{row.true_label}</td>
                            <td className="py-2 px-3 text-amber-300">{row.predicted_label}</td>
                            <td className="py-2 px-3">
                              {(Number(row.confidence || 0) * 100).toFixed(2)}%
                            </td>
                            <td className="py-2 pl-3">
                              {row.correct ? (
                                <span className="text-emerald-400">TRUE</span>
                              ) : (
                                <span className="text-rose-400">FALSE</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {Array.isArray(evalData.labels) && Array.isArray(evalData.confusion_matrix) && (
                    <div className="mt-4 pt-4 border-t border-white/10 overflow-x-auto font-mono text-[11px]">
                      <div className="text-zinc-400 mb-2">CONFUSION MATRIX (ROWS = TRUE, COLS = PREDICTED)</div>
                      <table className="border-collapse">
                        <thead>
                          <tr>
                            <th className="p-1.5 border border-white/10 text-zinc-500">TRUE \ PRED</th>
                            {evalData.labels.map((lbl) => (
                              <th key={lbl} className="p-1.5 border border-white/10 text-zinc-300">
                                {lbl}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {evalData.labels.map((rowLbl, rIdx) => (
                            <tr key={rowLbl}>
                              <td className="p-1.5 border border-white/10 text-zinc-300 font-semibold">
                                {rowLbl}
                              </td>
                              {evalData.confusion_matrix[rIdx].map((cellVal, cIdx) => (
                                <td
                                  key={`${rIdx}-${cIdx}`}
                                  className="p-1.5 border border-white/10 text-center text-zinc-200"
                                >
                                  {cellVal}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </ChartContainer>
              )}
            </div>

            {/* 09. Key Findings & 10. Conclusion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  09 // KEY FINDINGS
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  Comparing true labels against predicted labels on a labelled test set makes
                  evaluation measurable via accuracy and a confusion matrix, while explicit{' '}
                  <span className="text-white">is_fallback</span> banners prevent fallback heuristics
                  from being mistaken for pretrained MobileNetV2 predictions.
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                  10 // CONCLUSION
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  Pairing cached <span className="text-white">MobileNetV2</span> inference with
                  upload validation, longer inference timeouts, and labelled test-set metrics makes
                  Task 03 reliable and transparent.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}