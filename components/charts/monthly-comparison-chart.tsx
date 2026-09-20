"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatMonthLabel } from "@/lib/format";

export function MonthlyComparisonChart({
  data,
}: {
  data: { month: string; pendapatan: number; beban: number; labaBersih: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
        barGap={2}
        barCategoryGap="20%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="month"
          tickFormatter={(value: string) => formatMonthLabel(value)}
          tick={{ fontSize: 11, fill: "#6b7280" }}
          axisLine={{ stroke: "#e5e7eb" }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(value: number) => formatCurrency(value)}
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          width={80}
        />
        <Tooltip
          labelFormatter={(label) => formatMonthLabel(String(label))}
          formatter={(value, name) => [formatCurrency(Number(value)), name]}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="pendapatan" name="Pendapatan" fill="#2563eb" radius={[4, 4, 0, 0]} />
        <Bar dataKey="beban" name="Beban Operasional" fill="#b45309" radius={[4, 4, 0, 0]} />
        <Bar dataKey="labaBersih" name="Laba Bersih" fill="#15803d" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
