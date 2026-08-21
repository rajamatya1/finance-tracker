function TransactionForm({
  theme,
  inputStyle,
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
  setEditingId,
  isSaving,
  primaryBtn,
  cancelBtn,
}) {
  return (
    <>
      <input
        style={inputStyle(theme)}
        placeholder="Title"
        value={title}
        disabled={isSaving}
        onChange={(event) => setTitle(event.target.value)}
      />

      <input
        style={inputStyle(theme)}
        placeholder="Amount"
        type="number"
        value={amount}
        disabled={isSaving}
        onChange={(event) => setAmount(event.target.value)}
      />

      <input
        style={inputStyle(theme)}
        type="date"
        aria-label="Transaction date"
        value={date}
        disabled={isSaving}
        onChange={(event) => setDate(event.target.value)}
      />

      <select
        style={inputStyle(theme)}
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

      <select
        style={inputStyle(theme)}
        value={type}
        disabled={isSaving}
        onChange={(event) => setType(event.target.value)}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button
        style={{
          ...primaryBtn,
          cursor: isSaving ? "not-allowed" : "pointer",
          opacity: isSaving ? 0.7 : 1,
        }}
        disabled={isSaving}
        onClick={addTransaction}
      >
        {isSaving
          ? "Saving..."
          : editingId
            ? "Update Transaction"
            : "Add Transaction"}
      </button>

      {editingId && (
        <button
          style={{
            ...cancelBtn,
            cursor: isSaving ? "not-allowed" : "pointer",
            opacity: isSaving ? 0.7 : 1,
          }}
          disabled={isSaving}
          onClick={() => setEditingId(null)}
        >
          Cancel
        </button>
      )}
    </>
  );
}

export default TransactionForm;
