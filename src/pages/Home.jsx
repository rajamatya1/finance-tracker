import API from "../services/api";
import { useState, useEffect } from "react";
import SummaryCards from "../components/SummaryCards";
import TransactionForm from "../components/TransactionForm";


/* ================= STYLES ================= */
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

/* ================= APP ================= */
function Home() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState("Food");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/");
        setTransactions(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();

    const theme = localStorage.getItem("theme");
    if (theme) setDarkMode(theme === "dark");
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
    if (!title || !amount) return;

    const payload = {
      title,
      amount:
        type === "expense"
          ? -Math.abs(Number(amount))
          : Math.abs(Number(amount)),
      category,
      type,
    };

    try {
      if (editingId) {
        const res = await API.put(`/${editingId}`, payload);
        setTransactions((prev) =>
          prev.map((t) => (t._id === editingId ? res.data : t))
        );
        setEditingId(null);
      } else {
        const res = await API.post("/", payload);
        setTransactions((prev) => [...prev, res.data]);
      }

      setTitle("");
      setAmount("");
      setCategory("Food");
      setType("expense");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTransaction = async (id) => {
    await API.delete(`/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  const editTransaction = (t) => {
    setEditingId(t._id);
    setTitle(t.title);
    setAmount(Math.abs(t.amount));
    setCategory(t.category);
    setType(t.type);
  };

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);

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

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        {/* CARDS */}
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


        {/* LIST */}
        <div style={{ marginTop: "20px" }}>
          {transactions.map((t) => (
            <div
              key={t._id}
              style={transactionCard(theme, t.type)}
            >
              <div>
                <b>{t.title}</b>
                <div style={{ fontSize: "12px", opacity: 0.7 }}>
                  {t.category} • ${Math.abs(t.amount)}
                </div>
              </div>

              <div>
                <button style={editBtn} onClick={() => editTransaction(t)}>
                  Edit
                </button>
                <button style={deleteBtn} onClick={() => deleteTransaction(t._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
