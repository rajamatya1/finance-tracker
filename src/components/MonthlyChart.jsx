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
import { formatCurrency } from "../utils/formatters";

function formatAxisCurrency(value) {
  return `$${new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value))}`;
}

function MonthlyChart({ data, isDark }) {
  if (data.length === 0) {
    return null;
  }

  const textColor = isDark ? "#cbd5e1" : "#475569";
  const gridColor = isDark ? "rgba(148, 163, 184, 0.22)" : "#e2e8f0";
  const tooltipBackground = isDark ? "#172033" : "#ffffff";

  return (
    <section className="dashboard-panel chart-panel" aria-labelledby="monthly-chart-title">
      <h2 id="monthly-chart-title" className="chart-title">
        Monthly overview
      </h2>
      <p className="chart-description">
        Income and expenses grouped by transaction date.
      </p>

      <div className="chart-wrap">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={textColor} tickLine={false} />
            <YAxis
              stroke={textColor}
              tickFormatter={formatAxisCurrency}
              tickLine={false}
              width={60}
            />
            <Tooltip
              contentStyle={{
                background: tooltipBackground,
                border: `1px solid ${gridColor}`,
                borderRadius: "10px",
                color: textColor,
              }}
              formatter={(value, name) => [formatCurrency(value), name]}
            />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" name="Income" radius={[5, 5, 0, 0]} />
            <Bar
              dataKey="expense"
              fill="#ef4444"
              name="Expenses"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default MonthlyChart;
