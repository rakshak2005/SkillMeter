
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./Pages/homepage";
import Dashboard from "./Pages/dashboard";
import { auth } from "./firebase";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-white">
        <div>
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-400" />
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Checking session</p>
        </div>
      </div>
    );
  }

  return (
   <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route
        path="/app"
        element={user ? <Dashboard user={user} /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to={user ? "/app" : "/"} replace />} />
    </Routes>
  )
}

export default App
