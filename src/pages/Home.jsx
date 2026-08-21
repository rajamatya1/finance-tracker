import { lazy, Suspense, useEffect, useState } from "react";
import API from "../services/api";
import SummaryCards from "../components/SummaryCards";
import TransactionForm from "../components/TransactionForm";
import {
  formatCurrency,
  formatMonthLabel,
  formatTransactionDate,
  getTodayDate,
} from "../utils/formatters";
import "../styles/dashboard.css";

const MonthlyChart = lazy(() => import("../components/MonthlyChart"));

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
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
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

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setAmount("");
    setDate(getTodayDate());
    setCategory("Food");
    setType("expense");
  };

  const addTransaction = async () => {
    if (isSaving) {
      return;
    }

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
    setIsSaving(true);

    const payload = {
      title: normalizedTitle,
      amount: type === "expense" ? -Math.abs(numericAmount) : Math.abs(numericAmount),
      date,
      category: normalizedCategory,
      type,
    };

    try {
      if (editingId) {
        const response = await API.put(`/transactions/${editingId}`, payload);

        setTransactions((previousTransactions) =>
          previousTransactions.map((transaction) =>
            transaction._id === editingId ? response.data : transaction
          )
        );
      } else {
        const response = await API.post("/transactions", payload);

        setTransactions((previousTransactions) => [
          ...previousTransactions,
          response.data,
        ]);
      }

      resetForm();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to save this transaction. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTransaction = async (id) => {
    if (deletingId) {
      return;
    }

    const transaction = transactions.find(
      (currentTransaction) => currentTransaction._id === id
    );
    const transactionTitle = transaction?.title || "this transaction";
    const shouldDelete = window.confirm(
      `Delete "${transactionTitle}"? This cannot be undone.`
    );

    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");
    setDeletingId(id);

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
    } finally {
      setDeletingId(null);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    setErrorMessage("");
    resetForm();
  };

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = income + expense;

  const monthlySummary = Object.values(
    transactions.reduce((summaries, transaction) => {
      const monthKey = transaction.date.slice(0, 7);

      if (!summaries[monthKey]) {
        summaries[monthKey] = {
          month: formatMonthLabel(monthKey),
          sortKey: monthKey,
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        summaries[monthKey].income += transaction.amount;
      } else {
        summaries[monthKey].expense += Math.abs(transaction.amount);
      }

      return summaries;
    }, {})
  ).sort((firstMonth, secondMonth) => {
    return firstMonth.sortKey.localeCompare(secondMonth.sortKey);
  });

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const categoryOptions = [
    ...new Set(transactions.map((transaction) => transaction.category)),
  ].sort();

  const visibleTransactions = transactions
    .filter((transaction) => {
      const searchableText = `${transaction.title} ${transaction.category}`.toLowerCase();
      return searchableText.includes(normalizedSearchTerm);
    })
    .filter((transaction) => {
      return typeFilter === "all" || transaction.type === typeFilter;
    })
    .filter((transaction) => {
      return categoryFilter === "all" || transaction.category === categoryFilter;
    })
    .sort((firstTransaction, secondTransaction) => {
      if (sortOrder === "oldest") {
        return new Date(firstTransaction.date) - new Date(secondTransaction.date);
      }

      if (sortOrder === "largest") {
        return Math.abs(secondTransaction.amount) - Math.abs(firstTransaction.amount);
      }

      if (sortOrder === "smallest") {
        return Math.abs(firstTransaction.amount) - Math.abs(secondTransaction.amount);
      }

      return new Date(secondTransaction.date) - new Date(firstTransaction.date);
    });

  const transactionActionsDisabled = isSaving || deletingId !== null;

  return (
    <main className={`home-page${darkMode ? " home-page--dark" : ""}`}>
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              $
            </span>
            <div>
              <h1 className="brand-title">Finance Tracker</h1>
              <p className="signed-in-copy">Signed in as {user.name}</p>
            </div>
          </div>

          <div className="header-actions">
            <button className="button button--secondary" type="button" onClick={onLogout}>
              Log out
            </button>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => setDarkMode((isDark) => !isDark)}
            >
              {darkMode ? "Use light mode" : "Use dark mode"}
            </button>
          </div>
        </header>

        <SummaryCards balance={balance} income={income} expense={expense} />

        {monthlySummary.length > 0 && (
          <Suspense
            fallback={
              <section className="dashboard-panel loading-state">
                Loading monthly chart...
              </section>
            }
          >
            <MonthlyChart data={monthlySummary} isDark={darkMode} />
          </Suspense>
        )}

        <section className="dashboard-panel" aria-labelledby="transaction-form-title">
          <div className="panel-heading">
            <div>
              <h2 id="transaction-form-title" className="panel-title">
                {editingId ? "Edit transaction" : "Add a transaction"}
              </h2>
              <p className="panel-description">
                {editingId
                  ? "Update the details below, then save your changes."
                  : "Record an income or expense to keep your totals current."}
              </p>
            </div>
          </div>

          <TransactionForm
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
            onCancelEditing={cancelEditing}
            isSaving={isSaving}
          />

          {errorMessage && (
            <p className="alert" role="alert">
              {errorMessage}
            </p>
          )}
        </section>

        <section className="dashboard-panel history-panel" aria-labelledby="history-title">
          <div className="history-heading">
            <div>
              <h2 id="history-title" className="panel-title">
                Transaction history
              </h2>
              <p className="panel-description">
                Search, filter, and sort your saved transactions.
              </p>
            </div>
            {!isLoading && (
              <p className="history-count">
                {visibleTransactions.length} of {transactions.length} shown
              </p>
            )}
          </div>

          <div className="history-controls">
            <input
              className="search-field"
              placeholder="Search by description or category"
              aria-label="Search transactions"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="filter-grid">
            <select
              className="filter-field"
              aria-label="Filter by transaction type"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="all">All transaction types</option>
              <option value="income">Income only</option>
              <option value="expense">Expenses only</option>
            </select>

            <select
              className="filter-field"
              aria-label="Filter by transaction category"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
            >
              <option value="all">All categories</option>
              {categoryOptions.map((transactionCategory) => (
                <option key={transactionCategory} value={transactionCategory}>
                  {transactionCategory}
                </option>
              ))}
            </select>

            <select
              className="filter-field"
              aria-label="Sort transactions"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="largest">Largest amount</option>
              <option value="smallest">Smallest amount</option>
            </select>
          </div>

          {isLoading ? (
            <p className="loading-state">Loading your transactions...</p>
          ) : visibleTransactions.length === 0 ? (
            <p className="empty-state">
              {transactions.length === 0
                ? "No transactions yet. Add your first one above."
                : "No transactions match those filters."}
            </p>
          ) : (
            <div className="transaction-list">
              {visibleTransactions.map((transaction) => {
                const isIncome = transaction.type === "income";

                return (
                  <article
                    key={transaction._id}
                    className={`transaction-item transaction-item--${transaction.type}`}
                  >
                    <div className="transaction-main">
                      <span className="transaction-icon" aria-hidden="true">
                        {isIncome ? "↑" : "↓"}
                      </span>
                      <div className="transaction-details">
                        <strong className="transaction-title">{transaction.title}</strong>
                        <p className="transaction-meta">
                          <span className="category-chip">{transaction.category}</span>
                          <span>{formatTransactionDate(transaction.date)}</span>
                        </p>
                      </div>
                    </div>

                    <div className="transaction-side">
                      <p
                        className={`transaction-amount transaction-amount--${transaction.type}`}
                      >
                        {isIncome ? "+" : "-"}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <div className="transaction-actions">
                        <button
                          className="button button--secondary button--small"
                          disabled={transactionActionsDisabled}
                          type="button"
                          onClick={() => editTransaction(transaction)}
                        >
                          Edit
                        </button>
                        <button
                          className="button button--danger button--small"
                          disabled={transactionActionsDisabled}
                          type="button"
                          onClick={() => deleteTransaction(transaction._id)}
                        >
                          {deletingId === transaction._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Home;
