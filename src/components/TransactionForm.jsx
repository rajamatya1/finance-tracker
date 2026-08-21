function TransactionForm({
  title,
  setTitle,
  amount,
  setAmount,
  date,
  setDate,
  category,
  setCategory,
  type,
  setType,
  addTransaction,
  editingId,
  onCancelEditing,
  isSaving,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    addTransaction();
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="form-field form-field--full" htmlFor="transaction-title">
          <span className="form-label">Description</span>
          <input
            id="transaction-title"
            className="field"
            placeholder="e.g., Monthly rent"
            value={title}
            disabled={isSaving}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label className="form-field" htmlFor="transaction-amount">
          <span className="form-label">Amount</span>
          <input
            id="transaction-amount"
            className="field"
            placeholder="0.00"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={amount}
            disabled={isSaving}
            onChange={(event) => setAmount(event.target.value)}
          />
        </label>

        <label className="form-field" htmlFor="transaction-date">
          <span className="form-label">Date</span>
          <input
            id="transaction-date"
            className="field"
            type="date"
            value={date}
            disabled={isSaving}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>

        <label className="form-field" htmlFor="transaction-category">
          <span className="form-label">Category</span>
          <select
            id="transaction-category"
            className="field"
            value={category}
            disabled={isSaving}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Food</option>
            <option>Salary</option>
            <option>Rent</option>
            <option>Shopping</option>
            <option>Travel</option>
          </select>
        </label>

        <label className="form-field" htmlFor="transaction-type">
          <span className="form-label">Transaction type</span>
          <select
            id="transaction-type"
            className="field"
            value={type}
            disabled={isSaving}
            onChange={(event) => setType(event.target.value)}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <div className="form-field form-field--full form-actions">
          <button className="button button--primary" disabled={isSaving} type="submit">
            {isSaving
              ? "Saving..."
              : editingId
                ? "Update transaction"
                : "Add transaction"}
          </button>

          {editingId && (
            <button
              className="button button--secondary"
              disabled={isSaving}
              type="button"
              onClick={onCancelEditing}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default TransactionForm;
