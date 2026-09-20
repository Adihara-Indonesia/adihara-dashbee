export function StatCard({
  label,
  value,
  changePercent,
}: {
  label: string;
  value: string;
  /** null when there's no previous-period baseline to compare against. */
  changePercent: number | null;
}) {
  return (
    <div className="rounded-[10px] border border-gray-200 bg-white p-3.5">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <div className="mt-1 flex flex-wrap items-baseline gap-2">
        <p className="font-mono text-[17px] font-semibold text-gray-900">
          {value}
        </p>
      </div>
      {changePercent !== null && <ChangeBadge value={changePercent} />}
    </div>
  );
}

function ChangeBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  const rounded = Math.abs(value).toFixed(1);

  return (
    <span
      className={`mt-1.5 inline-flex items-center gap-0.5 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-bold ${
        isPositive ? "bg-good-soft text-good" : "bg-danger-soft text-danger"
      }`}
    >
      {isPositive ? "▲" : "▼"} {rounded}%
    </span>
  );
}
