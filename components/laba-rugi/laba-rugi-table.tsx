import { formatCurrency, formatMonthLabel } from "@/lib/format";
import type { LabaRugiReport } from "@/lib/laba-rugi/queries";

function Row({
  label,
  values,
  total,
  emphasis,
  indent,
}: {
  label: string;
  values: number[];
  total: number;
  emphasis?: "bold" | "subtle";
  indent?: boolean;
}) {
  const cellClass =
    emphasis === "bold"
      ? "font-mono font-bold text-gray-900"
      : emphasis === "subtle"
        ? "font-mono text-gray-500"
        : "font-mono text-gray-900";

  return (
    <tr className={emphasis === "bold" ? "bg-gray-50" : undefined}>
      <td
        className={`px-4 py-2.5 whitespace-nowrap ${
          emphasis === "bold"
            ? "font-bold text-gray-900"
            : indent
              ? "pl-8 text-gray-500"
              : "text-gray-700"
        }`}
      >
        {label}
      </td>
      {values.map((value, i) => (
        <td key={i} className={`px-4 py-2.5 text-right ${cellClass}`}>
          {formatCurrency(value)}
        </td>
      ))}
      <td className={`px-4 py-2.5 text-right ${cellClass}`}>
        {formatCurrency(total)}
      </td>
    </tr>
  );
}

export function LabaRugiTable({ report }: { report: LabaRugiReport }) {
  if (report.months.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-[10px] border border-dashed border-gray-200 text-sm text-gray-400">
        Belum ada data untuk laporan laba rugi.
      </div>
    );
  }

  const categories = report.total.bebanByCategory.map((c) => c.category);

  return (
    <div className="overflow-x-auto rounded-[10px] border border-gray-200">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-gray-50">
          <tr className="text-xs uppercase tracking-wide text-gray-400">
            <th className="px-4 py-3 font-medium">Komponen</th>
            {report.months.map((m) => (
              <th key={m.month} className="px-4 py-3 text-right font-medium">
                {formatMonthLabel(m.month)}
              </th>
            ))}
            <th className="px-4 py-3 text-right font-medium">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <Row
            label="Pendapatan Penjualan"
            values={report.months.map((m) => m.pendapatanPenjualan)}
            total={report.total.pendapatanPenjualan}
          />
          <Row
            label="Pendapatan Lain-lain"
            values={report.months.map((m) => m.pendapatanLain)}
            total={report.total.pendapatanLain}
          />
          <Row
            label="Total Pendapatan"
            values={report.months.map((m) => m.totalPendapatan)}
            total={report.total.totalPendapatan}
            emphasis="bold"
          />
          <Row
            label="Harga Pokok Penjualan (HPP)"
            values={report.months.map((m) => m.hpp)}
            total={report.total.hpp}
          />
          <Row
            label="Laba Kotor"
            values={report.months.map((m) => m.labaKotor)}
            total={report.total.labaKotor}
            emphasis="bold"
          />
          <tr>
            <td
              className="px-4 py-2.5 font-semibold text-gray-900"
              colSpan={report.months.length + 2}
            >
              Beban Operasional:
            </td>
          </tr>
          {categories.map((category) => (
            <Row
              key={category}
              label={category}
              indent
              values={report.months.map(
                (m) =>
                  m.bebanByCategory.find((b) => b.category === category)
                    ?.amount ?? 0,
              )}
              total={
                report.total.bebanByCategory.find(
                  (b) => b.category === category,
                )?.amount ?? 0
              }
              emphasis="subtle"
            />
          ))}
          <Row
            label="Total Beban Operasional"
            values={report.months.map((m) => m.totalBeban)}
            total={report.total.totalBeban}
            emphasis="bold"
          />
          <Row
            label="LABA BERSIH"
            values={report.months.map((m) => m.labaBersih)}
            total={report.total.labaBersih}
            emphasis="bold"
          />
          <tr>
            <td className="px-4 py-2.5 text-gray-500">
              Margin Laba Bersih (%)
            </td>
            {report.months.map((m) => (
              <td
                key={m.month}
                className="px-4 py-2.5 text-right font-mono text-gray-500"
              >
                {m.marginPercent.toFixed(1)}%
              </td>
            ))}
            <td className="px-4 py-2.5 text-right font-mono text-gray-500">
              {report.total.marginPercent.toFixed(1)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
