export default function ChartContainer({ title, subtitle = '', children, rightSlot = null }) {
  return (
    <div className="border border-white/10 bg-[#070709] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4 pb-3 mb-4 border-b border-white/10">
        <div>
          <h3 className="font-mono text-xs font-bold tracking-wider text-white uppercase">
            {title}
          </h3>
          {subtitle && <p className="font-mono text-[11px] text-zinc-500 mt-0.5">{subtitle}</p>}
        </div>
        {rightSlot}
      </div>
      <div>{children}</div>
    </div>
  );
}