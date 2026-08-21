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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatAxisCurrency(value) {
  return `$${new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value))}`;
}

function MonthlyChart({ data, theme }) {
  if (data.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        marginTop: "24px",
        padding: "18px",
        borderRadius: "14px",
        background: theme.card,
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <h3 style={{ margin: 0 }}>Monthly overview</h3>
      <p style={{ marginTop: "6px", opacity: 0.7 }}>
        Income and expenses grouped by transaction date.
      </p>

      <div style={{ width: "100%", height: "280px" }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(148,163,184,0.25)" strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={theme.text} />
            <YAxis
              stroke={theme.text}
              tickFormatter={formatAxisCurrency}
              width={56}
            />
            <Tooltip
              contentStyle={{
                background: theme.card,
                border: "1px solid rgba(148,163,184,0.45)",
                borderRadius: "10px",
                color: theme.text,
              }}
              formatter={(value, name) => [formatCurrency(value), name]}
            />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" name="Income" radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="expense"
              fill="#ef4444"
              name="Expenses"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default MonthlyChart;
