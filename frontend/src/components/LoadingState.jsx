export default function LoadingState({ label = 'EXECUTING_BACKEND_PIPELINE...' }) {
  return (
    <div className="border border-white/10 bg-white/[0.02] p-6 font-mono text-xs text-cyan-300 flex items-center gap-3">
      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
      <span>{label}</span>
    </div>
  );
}