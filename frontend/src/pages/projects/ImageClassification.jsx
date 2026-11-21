import { useEffect, useState } from 'react';
import SectionHeading from '../../components/SectionHeading';
import MetricCard from '../../components/MetricCard';
import ChartContainer from '../../components/ChartContainer';
import LoadingState from '../../components/LoadingState';
import { classifyImage } from '../../services/api';

export default function ImageClassification() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    classifyImage({})
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
      const data = await classifyImage({ file: selectedFile });
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
  const usedSyntheticInput = Boolean(result?.used_synthetic_input);
  const top1Label = result?.predicted_class ?? result?.top_1 ?? '—';
  const maxTop5Confidence = Math.max(
    0,
    ...(result?.top_5 || []).map((item) => Number(item?.confidence ?? 0))
  );
  const top1Confidence =
    Number(result?.confidence) > 0 ? Number(result.confidence) : maxTop5Confidence;
  const shapeText = Array.isArray(result?.input_shape)
    ? result.input_shape.join('x')
    : '224x224x3';

  return (
    <div className="max-w-[1440px] mx-auto border-x border-b border-white/10 bg-[#0A0A0C]/90">
      <SectionHeading
        code="TASK_03"
        title="IMAGE_CLASSIFICATION (PRE-TRAINED VISION MODEL)"
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
              <span className="text-white">{shapeText}</span> RGB inputs, returning top-5 class
              predictions and confidence scores with transparent fallback disclosure when needed.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              02 // OBJECTIVE & PROBLEM STATEMENT
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Classify user-uploaded photographs or sample test images into ImageNet categories
              reliably on CPU/GPU without request timeouts, while clearly distinguishing genuine
              neural inference from deterministic fallback heuristics.
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
              Accepts uploaded RGB image files or structured multi-pattern sample test images
              (<span className="text-white">checkerboard</span>,{' '}
              <span className="text-white">radial wave</span>, and{' '}
              <span className="text-white">geometric shapes</span>) normalized to{' '}
              <span className="text-white">{shapeText}</span>.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
              04 // ALGORITHM EXPLANATION
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              <span className="text-white">MobileNetV2</span> uses inverted residual blocks and
              depthwise separable convolutions to extract spatial features efficiently with low
              parameter overhead, producing softmax probabilities across ImageNet classes.
            </p>
          </div>

          <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
            <div className="font-mono text-[10px] uppercase tracking-wider text-purple-400">
              05 // WORKFLOW & METHODOLOGY
            </div>
            <p className="font-mono text-xs text-zinc-300 leading-relaxed">
              Decodes uploaded bytes or generates a fallback synthetic <span className="text-white">224x224x3</span> sample, applies MobileNetV2 preprocessing, uses a cached model instance when available, and sets <span className="text-white">is_fallback</span> explicitly if heuristic mode is triggered.
            </p>
          </div>
        </div>

        {/* 06. Interactive Demo */}
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
            06 // INTERACTIVE DEMO — IMAGE UPLOAD & SAMPLE INFERENCE
          </div>
          <form
            onSubmit={handleClassify}
            className="flex flex-wrap items-center gap-4 p-4 border border-white/10 bg-white/[0.02]"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="font-mono text-xs text-zinc-300 file:mr-3 file:px-3 file:py-1.5 file:border file:border-white/20 file:bg-[#0D0E12] file:text-zinc-200"
            />
            <button
              type="submit"
              className="px-5 py-2.5 font-mono text-xs font-bold text-[#0A0A0C] bg-amber-400 hover:brightness-110 cursor-pointer"
            >
              {selectedFile ? 'CLASSIFY_UPLOADED_IMAGE' : 'RUN_SAMPLE_TEST_IMAGE'}
            </button>
          </form>
        </div>

        {loading && <LoadingState label="RUNNING_224x224_IMAGE_INFERENCE..." />}
        {error && (
          <div className="p-4 border border-amber-500/40 font-mono text-xs text-amber-200">
            {error}
          </div>
        )}

        {result && (
          <>
            {isFallback && (
              <div className="p-4 border border-amber-500/50 bg-amber-500/10 font-mono text-xs text-amber-200">
                <strong>FALLBACK_MODE_ACTIVE:</strong> Genuine MobileNetV2 (ImageNet) inference was not
                used ({result.engine || 'Heuristic Fallback'}). Scores shown are non-pretrained
                feature heuristics, not ImageNet object predictions.
                {result.fallback_reason ? ` Reason: ${result.fallback_reason}` : ''}
              </div>
            )}

            {usedSyntheticInput && (
              <div className="p-3 border border-cyan-500/30 bg-cyan-500/5 font-mono text-xs text-cyan-200">
                No file uploaded — classified a generated test pattern (`224x224x3`). Upload an image
                above to test a real photo.
              </div>
            )}

            {/* 08. Evaluation Metrics */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                08 // EVALUATION METRICS & INFERENCE SUMMARY
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="min-w-0">
                  <MetricCard label="TOP-1 PREDICTION" value={top1Label} accent="#F59E0B" />
                </div>
                <div className="min-w-0">
                  <MetricCard
                    label="CONFIDENCE"
                    value={`${(top1Confidence * 100).toFixed(2)}%`}
                    accent="#10B981"
                  />
                </div>
                <div className="min-w-0">
                  <MetricCard
                    label="ENGINE"
                    value={isFallback ? `${result.engine} [FALLBACK]` : (result.engine ?? '—')}
                    accent={isFallback ? '#F59E0B' : '#22D3EE'}
                  />
                </div>
              </div>
            </div>

            {/* 07. Visualizations */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                07 // VISUALIZATIONS — INPUT PREVIEW & TOP-5 CONFIDENCE BARS
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
                    subtitle={`Ranked probability distribution · Input ${shapeText}`}
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
            </div>

            {/* 09. Key Findings & 10. Conclusion */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  09 // KEY FINDINGS
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  Structured geometric and pattern test images can match visually similar texture
                  classes in ImageNet with varying confidence, while caching the model and
                  surfacing <span className="text-white">is_fallback</span> prevents silent
                  confusion between pretrained weights and fallback heuristics.
                </p>
              </div>

              <div className="p-4 border border-white/10 bg-white/[0.02] space-y-1.5">
                <div className="font-mono text-[10px] uppercase tracking-wider text-amber-400">
                  10 // CONCLUSION
                </div>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed">
                  MobileNetV2 provides practical, real-time vision inference for web applications on
                  standard hardware when paired with clear input/fallback diagnostics.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}