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
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="mt-1 flex flex-wrap items-baseline gap-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {changePercent !== null && <ChangeBadge value={changePercent} />}
      </div>
    </div>
  );
}

function ChangeBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  const rounded = Math.abs(value).toFixed(1);

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}
    >
      {isPositive ? "▲" : "▼"} {rounded}%
    </span>
  );
}
