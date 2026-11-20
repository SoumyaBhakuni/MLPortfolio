import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Database,
  Filter,
  Layers,
  RefreshCw,
  Sparkles,
  Table as TableIcon,
} from "lucide-react";
import { fetchTask01EDA } from "../services/api";

const SPECIES_COLORS = {
  setosa: "#22D3EE",      // Cyan
  versicolor: "#10B981",  // Emerald
  virginica: "#F59E0B",   // Solar Amber
};

const FEATURE_OPTIONS = [
  { key: "sepal_length", label: "Sepal Length (cm)", raw: "sepal length (cm)" },
  { key: "sepal_width", label: "Sepal Width (cm)", raw: "sepal width (cm)" },
  { key: "petal_length", label: "Petal Length (cm)", raw: "petal length (cm)" },
  { key: "petal_width", label: "Petal Width (cm)", raw: "petal width (cm)" },
];

// Built-in Iris fallback dataset so the UI renders complete real data even before starting Flask
const FALLBACK_IRIS_RECORDS = [
  { id: 1, sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2, species: "setosa" },
  { id: 2, sepal_length: 4.9, sepal_width: 3.0, petal_length: 1.4, petal_width: 0.2, species: "setosa" },
  { id: 3, sepal_length: 4.7, sepal_width: 3.2, petal_length: 1.3, petal_width: 0.2, species: "setosa" },
  { id: 4, sepal_length: 4.6, sepal_width: 3.1, petal_length: 1.5, petal_width: 0.2, species: "setosa" },
  { id: 5, sepal_length: 5.0, sepal_width: 3.6, petal_length: 1.4, petal_width: 0.2, species: "setosa" },
  { id: 51, sepal_length: 7.0, sepal_width: 3.2, petal_length: 4.7, petal_width: 1.4, species: "versicolor" },
  { id: 52, sepal_length: 6.4, sepal_width: 3.2, petal_length: 4.5, petal_width: 1.5, species: "versicolor" },
  { id: 53, sepal_length: 6.9, sepal_width: 3.1, petal_length: 4.9, petal_width: 1.5, species: "versicolor" },
  { id: 54, sepal_length: 5.5, sepal_width: 2.3, petal_length: 4.0, petal_width: 1.3, species: "versicolor" },
  { id: 55, sepal_length: 6.5, sepal_width: 2.8, petal_length: 4.6, petal_width: 1.5, species: "versicolor" },
  { id: 101, sepal_length: 6.3, sepal_width: 3.3, petal_length: 6.0, petal_width: 2.5, species: "virginica" },
  { id: 102, sepal_length: 5.8, sepal_width: 2.7, petal_length: 5.1, petal_width: 1.9, species: "virginica" },
  { id: 103, sepal_length: 7.1, sepal_width: 3.0, petal_length: 5.9, petal_width: 2.1, species: "virginica" },
  { id: 104, sepal_length: 6.3, sepal_width: 2.9, petal_length: 5.6, petal_width: 1.8, species: "virginica" },
  { id: 105, sepal_length: 6.5, sepal_width: 3.0, petal_length: 5.8, petal_width: 2.2, species: "virginica" },
];

const FALLBACK_STATS = [
  { feature: "sepal length (cm)", count: 150, mean: 5.8433, median: 5.8, std: 0.8281, variance: 0.6857, min: 4.3, q25: 5.1, q50: 5.8, q75: 6.4, max: 7.9 },
  { feature: "sepal width (cm)", count: 150, mean: 3.0573, median: 3.0, std: 0.4359, variance: 0.19, min: 2.0, q25: 2.8, q50: 3.0, q75: 3.3, max: 4.4 },
  { feature: "petal length (cm)", count: 150, mean: 3.758, median: 4.35, std: 1.7653, variance: 3.1163, min: 1.0, q25: 1.6, q50: 4.35, q75: 5.1, max: 6.9 },
  { feature: "petal width (cm)", count: 150, mean: 1.1993, median: 1.3, std: 0.7622, variance: 0.581, min: 0.1, q25: 0.3, q50: 1.3, q75: 1.8, max: 2.5 },
];

const FALLBACK_CORR = {
  columns: ["sepal length (cm)", "sepal width (cm)", "petal length (cm)", "petal width (cm)"],
  matrix: [
    [1.0, -0.1176, 0.8718, 0.8179],
    [-0.1176, 1.0, -0.4284, -0.3661],
    [0.8718, -0.4284, 1.0, 0.9629],
    [0.8179, -0.3661, 0.9629, 1.0],
  ],
};

const FALLBACK_FINDINGS = [
  "Balanced class distribution across all three species: Setosa (50), Versicolor (50), and Virginica (50).",
  "150 total observations with 4 numerical features and 0 missing values.",
  "Petal length and petal width have a high correlation (r = 0.96) and separate Setosa clearly from Versicolor and Virginica.",
  "Virginica has the highest average petal dimensions, while Setosa has the compact petals and wide sepals.",
];

export default function EDA() {
  const [edaData, setEdaData] = useState(null);
  const [sourceMode, setSourceMode] = useState("LOCAL_FALLBACK");
  const [loading, setLoading] = useState(true);
  const [xFeature, setXFeature] = useState("sepal_length");
  const [yFeature, setYFeature] = useState("petal_length");
  const [selectedSpecies, setSelectedSpecies] = useState({
    setosa: true,
    versicolor: true,
    virginica: true,
  });
  const [activeTab, setActiveTab] = useState("statistics");

  const loadFromBackend = async () => {
    setLoading(true);
    try {
      const data = await fetchTask01EDA();
      if (data) {
        setEdaData(data);
        setSourceMode("FLASK_LIVE");
      }
    } catch {
      setSourceMode("LOCAL_FALLBACK");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFromBackend();
  }, []);

  const records = edaData?.records?.length ? edaData.records : FALLBACK_IRIS_RECORDS;
  const statistics = edaData?.statistics?.length ? edaData.statistics : FALLBACK_STATS;
  const correlation = edaData?.correlation?.matrix?.length ? edaData.correlation : FALLBACK_CORR;
  const findings = edaData?.findings?.length ? edaData.findings : FALLBACK_FINDINGS;

  const filteredRecords = useMemo(
    () => records.filter((r) => selectedSpecies[r.species]),
    [records, selectedSpecies]
  );

  const toggleSpecies = (sp) => {
    setSelectedSpecies((prev) => ({ ...prev, [sp]: !prev[sp] }));
  };

  // SVG Scatter Plot bounds
  const xVals = filteredRecords.map((r) => r[xFeature]);
  const yVals = filteredRecords.map((r) => r[yFeature]);
  const xMin = xVals.length ? Math.floor(Math.min(...xVals) * 10) / 10 : 0;
  const xMax = xVals.length ? Math.ceil(Math.max(...xVals) * 10) / 10 : 8;
  const yMin = yVals.length ? Math.floor(Math.min(...yVals) * 10) / 10 : 0;
  const yMax = yVals.length ? Math.ceil(Math.max(...yVals) * 10) / 10 : 7;

  const plotW = 560;
  const plotH = 260;
  const padL = 44;
  const padR = 18;
  const padT = 18;
  const padB = 34;

  const scaleX = (val) => {
    if (xMax === xMin) return padL + (plotW - padL - padR) / 2;
    return padL + ((val - xMin) / (xMax - xMin)) * (plotW - padL - padR);
  };

  const scaleY = (val) => {
    if (yMax === yMin) return padT + (plotH - padT - padB) / 2;
    return plotH - padB - ((val - yMin) / (yMax - yMin)) * (plotH - padT - padB);
  };

  const xLabel = FEATURE_OPTIONS.find((f) => f.key === xFeature)?.label || xFeature;
  const yLabel = FEATURE_OPTIONS.find((f) => f.key === yFeature)?.label || yFeature;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-slate-100 font-sans selection:bg-amber-400/20 selection:text-amber-300">
      {/* Subtle 1px Swiss Architectural Grid Overlay */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Top Telemetry Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-2 font-mono text-[11px] tracking-widest text-slate-400">
        <span>[SYS_OK] // TASK_01_EDA</span>
        <span className="text-emerald-400">
          SOURCE: {sourceMode === "FLASK_LIVE" ? "FLASK_API_LIVE" : "LOCAL_IRIS_DATA"}
        </span>
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto max-w-7xl border-b border-white/10 px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400">
              01 // EXPLORATORY DATA ANALYSIS
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
                IRIS FLOWER DATASET
              </span>{" "}
              LAB
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Loading, inspecting, summarizing, and visualizing 150 botanical observations across Setosa, Versicolor, and Virginica.
            </p>
          </div>

          <button
            onClick={loadFromBackend}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-amber-400/40 bg-amber-400/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-amber-300 transition hover:bg-amber-400/20 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Syncing..." : "Sync Flask API"}
          </button>
        </div>

        {/* 4 KPI Strip */}
        <div className="mt-8 grid grid-cols-2 border border-white/10 lg:grid-cols-4">
          <div className="border-b border-r border-white/10 p-5 lg:border-b-0">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span>SAMPLES</span>
              <Database className="h-4 w-4 text-cyan-400" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-white">
              {edaData?.overview?.total_samples ?? 150}
            </p>
          </div>

          <div className="border-b border-white/10 p-5 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span>FEATURES</span>
              <Layers className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-white">
              {edaData?.overview?.numerical_features ?? 4}
            </p>
          </div>

          <div className="border-r border-white/10 p-5">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span>SPECIES</span>
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-white">
              {edaData?.overview?.class_categories ?? 3}
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400">
              <span>MISSING VALUES</span>
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
            <p className="mt-2 font-mono text-2xl font-bold text-emerald-400">
              {edaData?.overview?.missing_values ?? 0}
            </p>
          </div>
        </div>
      </header>

      {/* Main Split Workbench */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 border border-white/10 lg:grid-cols-12">
          {/* Left Controls (4 cols) */}
          <aside className="border-b border-white/10 bg-[#0F1014] p-6 lg:col-span-4 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400">
              <Filter className="h-3.5 w-3.5" />
              <span>Interactive Controls</span>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <label className="block font-mono text-xs text-slate-400">X-AXIS FEATURE</label>
                <select
                  value={xFeature}
                  onChange={(e) => setXFeature(e.target.value)}
                  className="mt-1.5 w-full border border-white/15 bg-[#0A0A0C] px-3 py-2 font-mono text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  {FEATURE_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400">Y-AXIS FEATURE</label>
                <select
                  value={yFeature}
                  onChange={(e) => setYFeature(e.target.value)}
                  className="mt-1.5 w-full border border-white/15 bg-[#0A0A0C] px-3 py-2 font-mono text-xs text-white focus:border-emerald-400 focus:outline-none"
                >
                  {FEATURE_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="block font-mono text-xs text-slate-400">SPECIES FILTER</span>
                <div className="mt-2 space-y-2">
                  {Object.keys(SPECIES_COLORS).map((sp) => (
                    <label
                      key={sp}
                      className="flex cursor-pointer items-center justify-between border border-white/10 bg-[#0A0A0C] px-3 py-2 font-mono text-xs capitalize"
                    >
                      <span className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={selectedSpecies[sp]}
                          onChange={() => toggleSpecies(sp)}
                          className="accent-amber-400"
                        />
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: SPECIES_COLORS[sp] }}
                        />
                        {sp}
                      </span>
                      <span className="text-slate-400">
                        {edaData?.overview?.species_distribution?.[sp] ?? 50}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Interactive Scatter Plot (8 cols) */}
          <section className="bg-[#0A0A0C] p-6 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-400">
                <BarChart3 className="h-4 w-4" />
                <span>{xLabel} vs {yLabel}</span>
              </div>
              <div className="flex items-center gap-4 font-mono text-xs">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" /> Setosa
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Versicolor
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Virginica
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto border border-white/10 bg-[#0F1014] p-3">
              <svg viewBox={`0 0 ${plotW} ${plotH}`} className="h-auto w-full">
                {/* Axes */}
                <line
                  x1={padL}
                  y1={plotH - padB}
                  x2={plotW - padR}
                  y2={plotH - padB}
                  stroke="rgba(255,255,255,0.2)"
                />
                <line
                  x1={padL}
                  y1={padT}
                  x2={padL}
                  y2={plotH - padB}
                  stroke="rgba(255,255,255,0.2)"
                />

                {/* Min/Max Axis Labels */}
                <text x={padL} y={plotH - 10} fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  {xMin.toFixed(1)}
                </text>
                <text
                  x={plotW - padR}
                  y={plotH - 10}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {xMax.toFixed(1)}
                </text>
                <text x={10} y={padT + 8} fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  {yMax.toFixed(1)}
                </text>
                <text x={10} y={plotH - padB} fill="#94A3B8" fontSize="10" fontFamily="monospace">
                  {yMin.toFixed(1)}
                </text>

                {/* Data Points */}
                {filteredRecords.map((pt) => (
                  <circle
                    key={`${pt.id}-${pt.species}`}
                    cx={scaleX(pt[xFeature])}
                    cy={scaleY(pt[yFeature])}
                    r={4.5}
                    fill={SPECIES_COLORS[pt.species] || "#22D3EE"}
                    fillOpacity={0.85}
                  />
                ))}
              </svg>
            </div>
          </section>
        </div>

        {/* Bottom Tabs: Statistics | Preview | Correlation | Findings */}
        <section className="mt-8 border border-white/10 bg-[#0F1014]">
          <div className="flex flex-wrap border-b border-white/10 font-mono text-xs">
            {[
              { id: "statistics", label: "01_SUMMARY_STATS" },
              { id: "preview", label: "02_DATASET_ROWS" },
              { id: "correlation", label: "03_CORRELATION" },
              { id: "findings", label: "04_OBSERVATIONS" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`border-r border-white/10 px-5 py-3.5 uppercase tracking-wider transition ${
                  activeTab === tab.id
                    ? "bg-amber-400/15 text-amber-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "statistics" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-amber-400">
                      <th className="py-2.5 pr-4">Feature</th>
                      <th className="py-2.5 px-3">Mean</th>
                      <th className="py-2.5 px-3">Median</th>
                      <th className="py-2.5 px-3">Std Dev</th>
                      <th className="py-2.5 px-3">Min</th>
                      <th className="py-2.5 px-3">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistics.map((row) => (
                      <tr key={row.feature} className="border-b border-white/5 text-slate-200">
                        <td className="py-2.5 pr-4 text-cyan-300">{row.feature}</td>
                        <td className="py-2.5 px-3">{row.mean}</td>
                        <td className="py-2.5 px-3">{row.median}</td>
                        <td className="py-2.5 px-3">{row.std}</td>
                        <td className="py-2.5 px-3">{row.min}</td>
                        <td className="py-2.5 px-3">{row.max}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "preview" && (
              <div className="overflow-x-auto">
                <div className="mb-3 flex items-center gap-2 font-mono text-xs text-slate-400">
                  <TableIcon className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Showing {filteredRecords.length} rows</span>
                </div>
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-amber-400">
                      <th className="py-2 pr-3">#</th>
                      <th className="py-2 px-3">sepal_length</th>
                      <th className="py-2 px-3">sepal_width</th>
                      <th className="py-2 px-3">petal_length</th>
                      <th className="py-2 px-3">petal_width</th>
                      <th className="py-2 pl-3">species</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.slice(0, 15).map((r) => (
                      <tr key={r.id} className="border-b border-white/5 text-slate-200">
                        <td className="py-2 pr-3 text-slate-500">{r.id}</td>
                        <td className="py-2 px-3">{r.sepal_length}</td>
                        <td className="py-2 px-3">{r.sepal_width}</td>
                        <td className="py-2 px-3">{r.petal_length}</td>
                        <td className="py-2 px-3">{r.petal_width}</td>
                        <td
                          className="py-2 pl-3 font-semibold capitalize"
                          style={{ color: SPECIES_COLORS[r.species] }}
                        >
                          {r.species}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "correlation" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-amber-400">
                      <th className="py-2 pr-4">Feature</th>
                      {correlation.columns.map((col) => (
                        <th key={col} className="py-2 px-3">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {correlation.columns.map((rowName, rIdx) => (
                      <tr key={rowName} className="border-b border-white/5">
                        <td className="py-2.5 pr-4 text-cyan-300">{rowName}</td>
                        {correlation.matrix[rIdx].map((val, cIdx) => (
                          <td
                            key={`${rowName}-${cIdx}`}
                            className={`py-2.5 px-3 ${
                              val >= 0.8
                                ? "text-emerald-400 font-semibold"
                                : val < 0
                                ? "text-amber-300"
                                : "text-slate-300"
                            }`}
                          >
                            {Number(val).toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "findings" && (
              <ul className="space-y-3">
                {findings.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}