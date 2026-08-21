import { useState } from "react";
import API from "../services/api";
import "../styles/auth.css";

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
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-brand">
          <span className="auth-brand-mark" aria-hidden="true">
            $
          </span>
          Finance Tracker
        </div>

        <h1 id="auth-title" className="auth-title">
          {isRegistering ? "Create your account" : "Welcome to Finance Tracker"}
        </h1>
        <p className="auth-copy">
          {isRegistering
            ? "Start tracking your finances securely."
            : "Log in to view your personal finance dashboard."}
        </p>

        {errorMessage && (
          <p className="auth-alert" id="auth-error" role="alert">
            {errorMessage}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isRegistering && (
            <label className="auth-field" htmlFor="name">
              Name
              <input
                id="name"
                className="auth-input"
                required
                minLength="2"
                maxLength="50"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
              />
            </label>
          )}

          <label className="auth-field" htmlFor="email">
            Email address
            <input
              id="email"
              className="auth-input"
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              aria-describedby={errorMessage ? "auth-error" : undefined}
            />
          </label>

          <label className="auth-field" htmlFor="password">
            Password
            <input
              id="password"
              className="auth-input"
              required
              minLength="8"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegistering ? "new-password" : "current-password"}
              aria-describedby={errorMessage ? "auth-error" : undefined}
            />
          </label>

          <button className="auth-button" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Please wait..."
              : isRegistering
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <button className="auth-mode-button" type="button" onClick={switchMode}>
          {isRegistering
            ? "Already have an account? Log in"
            : "Need an account? Register"}
        </button>
      </section>
    </main>
  );
}

export default Auth;
