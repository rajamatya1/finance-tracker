import API from "../services/api";
import { useEffect, useState } from "react";
import SummaryCards from "../components/SummaryCards";
import TransactionForm from "../components/TransactionForm";

function getTodayDate() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60 * 1000;

  return new Date(today.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 10);
}

function formatTransactionDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

const cardStyle = (theme) => ({
  flex: 1,
  padding: "14px",
  borderRadius: "14px",
  background: theme.card,
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
});

const inputStyle = (theme) => ({
  width: "100%",
  padding: "12px",
  margin: "8px 0",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: theme.inputBg,
  color: theme.text,
  outline: "none",
});

const primaryBtn = {
  width: "100%",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontWeight: "600",
};

const cancelBtn = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  borderRadius: "10px",
  border: "none",
  background: "#6b7280",
  color: "white",
  cursor: "pointer",
};

const transactionCard = (theme, type) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: "12px",
  marginTop: "10px",
  borderRadius: "12px",
  background:
    type === "income"
      ? "rgba(34,197,94,0.08)"
      : "rgba(239,68,68,0.08)",
  border: "1px solid rgba(0,0,0,0.05)",
  alignItems: "center",
});

const errorBox = (darkMode) => ({
  marginTop: "16px",
  padding: "12px",
  borderRadius: "10px",
  background: "rgba(239,68,68,0.15)",
  border: "1px solid rgba(239,68,68,0.45)",
  color: darkMode ? "#fecaca" : "#b91c1c",
});

const editBtn = {
  marginRight: "6px",
  padding: "6px 10px",
  border: "none",
  borderRadius: "8px",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 10px",
  border: "none",
  borderRadius: "8px",
  background: "#ef4444",
  color: "white",
  cursor: "pointer",
};

function Home({ user, onLogout }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(getTodayDate);
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/transactions");
        setTransactions(response.data);
      } catch {
        setErrorMessage("Unable to load transactions. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const theme = {
    bg: darkMode ? "#0f172a" : "#f4f6f8",
    card: darkMode ? "#1e293b" : "#ffffff",
    text: darkMode ? "#ffffff" : "#111",
    inputBg: darkMode ? "#334155" : "#ffffff",
  };

  const addTransaction = async () => {
    const normalizedTitle = title.trim();
    const normalizedCategory = category.trim();
    const numericAmount = Number(amount);

    if (!normalizedTitle) {
      setErrorMessage("Please enter a transaction title.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount === 0) {
      setErrorMessage("Please enter a non-zero amount.");
      return;
    }

    if (!date) {
      setErrorMessage("Please choose a transaction date.");
      return;
    }

    if (!normalizedCategory) {
      setErrorMessage("Please select a category.");
      return;
    }

    setErrorMessage("");

    const payload = {
      title: normalizedTitle,
      amount:
        type === "expense"
          ? -Math.abs(numericAmount)
          : Math.abs(numericAmount),
      date,
      category: normalizedCategory,
      type,
    };

    try {
      if (editingId) {
        const response = await API.put(
          `/transactions/${editingId}`,
          payload
        );

        setTransactions((previousTransactions) =>
          previousTransactions.map((transaction) =>
            transaction._id === editingId ? response.data : transaction
          )
        );

        setEditingId(null);
      } else {
        const response = await API.post("/transactions", payload);

        setTransactions((previousTransactions) => [
          ...previousTransactions,
          response.data,
        ]);
      }

      setTitle("");
      setAmount("");
      setDate(getTodayDate());
      setCategory("Food");
      setType("expense");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to save this transaction. Please try again."
      );
    }
  };

  const deleteTransaction = async (id) => {
    setErrorMessage("");

    try {
      await API.delete(`/transactions/${id}`);

      setTransactions((previousTransactions) =>
        previousTransactions.filter((transaction) => transaction._id !== id)
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to delete this transaction. Please try again."
      );
    }
  };

  const editTransaction = (transaction) => {
    setErrorMessage("");
    setEditingId(transaction._id);
    setTitle(transaction.title);
    setAmount(Math.abs(transaction.amount));
    setDate(transaction.date.slice(0, 10));
    setCategory(transaction.category);
    setType(transaction.type);
  };

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income + expense;

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", padding: "30px" }}>
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          background: theme.card,
          padding: "20px",
          borderRadius: "16px",
          color: theme.text,
        }}
      >
        <h2>💰 Finance Tracker</h2>

        <p style={{ marginBottom: "10px", opacity: 0.75 }}>
          Signed in as {user.name}
        </p>

        <button onClick={onLogout} style={{ marginBottom: "10px" }}>
          Log out
        </button>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <SummaryCards
          theme={theme}
          balance={balance}
          income={income}
          expense={expense}
          cardStyle={cardStyle}
        />

        <TransactionForm
          theme={theme}
          inputStyle={inputStyle}
          title={title}
          setTitle={setTitle}
          amount={amount}
          setAmount={setAmount}
          date={date}
          setDate={setDate}
          category={category}
          setCategory={setCategory}
          type={type}
          setType={setType}
          addTransaction={addTransaction}
          editingId={editingId}
          setEditingId={setEditingId}
          primaryBtn={primaryBtn}
          cancelBtn={cancelBtn}
        />

        {errorMessage && (
          <p role="alert" style={errorBox(darkMode)}>
            {errorMessage}
          </p>
        )}

        <div style={{ marginTop: "20px" }}>
          {isLoading ? (
            <p>Loading your transactions...</p>
          ) : (
            transactions.map((transaction) => (
              <div
                key={transaction._id}
                style={transactionCard(theme, transaction.type)}
              >
                <div>
                  <b>{transaction.title}</b>
                  <div style={{ fontSize: "12px", opacity: 0.7 }}>
                    {transaction.category} • {formatTransactionDate(transaction.date)} • ${Math.abs(transaction.amount)}
                  </div>
                </div>

                <div>
                  <button
                    style={editBtn}
                    onClick={() => editTransaction(transaction)}
                  >
                    Edit
                  </button>

                  <button
                    style={deleteBtn}
                    onClick={() => deleteTransaction(transaction._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;