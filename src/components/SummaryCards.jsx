function SummaryCards({ theme, balance, income, expense, cardStyle }) {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        <div style={cardStyle(theme)}>
          <h4>Balance</h4>
          <h3>${balance.toFixed(2)}</h3>
        </div>

        <div style={cardStyle(theme)}>
          <h4>Income</h4>
          <h3 style={{ color: "#22c55e" }}>
            ${income.toFixed(2)}
          </h3>
        </div>

        <div style={cardStyle(theme)}>
          <h4>Expense</h4>
          <h3 style={{ color: "#ef4444" }}>
            ${Math.abs(expense).toFixed(2)}
          </h3>
        </div>
      </div>
    );
  }

  export default SummaryCards;
