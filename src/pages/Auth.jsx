import { useState } from "react";
import API from "../services/api";

function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegistering = mode === "register";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const endpoint = isRegistering ? "/auth/register" : "/auth/login";
      const payload = isRegistering
        ? { name, email, password }
        : { email, password };

      const response = await API.post(endpoint, payload);
      onAuthenticated(response.data.user);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(isRegistering ? "login" : "register");
    setErrorMessage("");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "var(--code-bg)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          borderRadius: "16px",
          background:  "var(--bg)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        }}
      >
        <h1 style={{ marginTop: 0, fontSize: "28px" }}>
          {isRegistering ? "Create your account" : "Welcome back"}
        </h1>

        <p style={{ marginBottom: "24px", color: "var(--text)", }}>
          {isRegistering
            ? "Start tracking your finances securely."
            : "Log in to view your finance dashboard."}
        </p>

        {errorMessage && (
          <p
            role="alert"
            style={{
              padding: "12px",
              borderRadius: "8px",
              color: "#b91c1c",
              background: "#fef2f2",
            }}
          >
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <label style={{ display: "block", marginBottom: "16px" }}>
              Name
              <input
                required
                minLength="2"
                maxLength="50"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                style={{ display: "block", width: "100%", marginTop: "6px" }}
              />
            </label>
          )}

          <label style={{ display: "block", marginBottom: "16px" }}>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              style={{ display: "block", width: "100%", marginTop: "6px" }}
            />
          </label>

          <label style={{ display: "block", marginBottom: "20px" }}>
            Password
            <input
              required
              minLength="8"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegistering ? "new-password" : "current-password"}
              style={{ display: "block", width: "100%", marginTop: "6px" }}
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              color: "#ffffff",
              background: "#2563eb",
              cursor: isSubmitting ? "wait" : "pointer",
            }}
          >
            {isSubmitting
              ? "Please wait..."
              : isRegistering
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <button
          type="button"
          onClick={switchMode}
          style={{
            width: "100%",
            marginTop: "16px",
            border: "none",
            background: "transparent",
            color: "#2563eb",
            cursor: "pointer",
          }}
        >
          {isRegistering
            ? "Already have an account? Log in"
            : "Need an account? Register"}
        </button>
      </section>
    </main>
  );
}

export default Auth;