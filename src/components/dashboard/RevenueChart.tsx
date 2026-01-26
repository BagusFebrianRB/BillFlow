"use client";

import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type ChartData = {
  month: string;
  year: number;
  IDR: number;
  USD: number;
};

export default function RevenueChart({
  chartData,
}: {
  chartData: ChartData[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <Legend />
        <Tooltip />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="IDR"
          stroke="#14b8a6"
          strokeWidth={2}
          name="Revenue (IDR)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="USD"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Revenue (USD)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
