import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import API from "./services/api";

function App() {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const response = await API.get("/auth/me");
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    loadCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
    } catch {
      window.alert("Unable to log out. Please try again.");
    }
  };

  if (isCheckingAuth) {
    return <p>Loading your account...</p>;
  }

  return user ? (
    <Home user={user} onLogout={handleLogout} />
  ) : (
    <Auth onAuthenticated={setUser} />
  );
}

export default App;