import { formatCurrency } from "../utils/formatters";

function SummaryCards({ balance, income, expense }) {
  return (
    <section className="summary-grid" aria-label="Financial summary">
      <article className="summary-card">
        <p className="summary-label">Current balance</p>
        <p className="summary-amount">{formatCurrency(balance)}</p>
      </article>

      <article className="summary-card">
        <p className="summary-label">Total income</p>
        <p className="summary-amount summary-amount--income">
          {formatCurrency(income)}
        </p>
      </article>

      <article className="summary-card">
        <p className="summary-label">Total expenses</p>
        <p className="summary-amount summary-amount--expense">
          {formatCurrency(Math.abs(expense))}
        </p>
      </article>
    </section>
  );
}

export default SummaryCards;
