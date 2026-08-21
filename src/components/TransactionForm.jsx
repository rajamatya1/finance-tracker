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
  primaryBtn,
  cancelBtn,
}) {
  return (
    <>
      <input
        style={inputStyle(theme)}
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <input
        style={inputStyle(theme)}
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />

      <input
        style={inputStyle(theme)}
        type="date"
        aria-label="Transaction date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />

      <select
        style={inputStyle(theme)}
        value={category}
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
        onChange={(event) => setType(event.target.value)}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button style={primaryBtn} onClick={addTransaction}>
        {editingId ? "Update Transaction" : "Add Transaction"}
      </button>

      {editingId && (
        <button style={cancelBtn} onClick={() => setEditingId(null)}>
          Cancel
        </button>
      )}
    </>
  );
}

export default TransactionForm;