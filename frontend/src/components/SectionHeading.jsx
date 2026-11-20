export default function SectionHeading({ code, title, rightLabel = '', accent = '#22D3EE' }) {
  return (
    <div className="px-4 sm:px-8 py-4 border-b border-white/10 flex items-center justify-between font-mono text-xs">
      <span className="font-semibold" style={{ color: accent }}>
        {code} // {title}
      </span>
      {rightLabel && <span className="text-zinc-500 hidden sm:inline">{rightLabel}</span>}
    </div>
  );
}