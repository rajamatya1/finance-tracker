function TransactionForm({
    theme,
    inputStyle,
    title,
    setTitle,
    amount,
    setAmount,
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
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          style={inputStyle(theme)}
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          style={inputStyle(theme)}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
          onChange={(e) => setType(e.target.value)}
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