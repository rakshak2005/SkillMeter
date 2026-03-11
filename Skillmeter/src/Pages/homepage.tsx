import React, { useEffect, useState } from "react";
import {
  ChartLine,
  Zap,
  Github,
  Code2,
  ShieldCheck,
  BarChart3,
  Award,
  Layers,
  ArrowRight,
} from "lucide-react";
import { signInWithPopup, type User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase";

type HomeProps = {
  user: User | null;
};

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

type ScoreBoxProps = {
  title: string;
  percent: string;
};

const HomePage: React.FC<HomeProps> = ({ user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  /* ---------------- DARK MODE ---------------- */
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  /* ---------------- REDIRECT IF LOGGED IN ---------------- */
  useEffect(() => {
    if (user) {
      navigate("/app", { replace: true });
    }
  }, [user, navigate]);

  /* ---------------- SCROLL EFFECT ---------------- */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- BACKEND HEALTH CHECK (OPTIONAL) ---------------- */
  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then(() => console.log("Backend connected"))
      .catch(() => console.log("Backend not running"));
  }, []);

  /* ---------------- SIGN IN ---------------- */
  const handleGetStarted = async () => {
    setIsSigningIn(true);
    setError(null);

    try {
      await signInWithPopup(auth, googleProvider);
      // ❌ DO NOT navigate here (handled by useEffect)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message.replace("Firebase:", "").trim()
          : "Sign-in failed. Try again.";
      setError(message);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="bg-[#020617] text-white">
      {/* NAVBAR */}
      <nav
        className={`fixed w-full z-50 transition-all ${
          scrolled
            ? "bg-[#020617]/80 backdrop-blur border-b border-white/10 py-3"
            : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-black">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ChartLine size={18} />
            </div>
            SkillMeter
          </div>

          {user ? (
            <button
              onClick={() => navigate("/app")}
              className="bg-indigo-600 px-6 py-2 rounded-xl font-bold"
            >
              Go to Dashboard
            </button>
          ) : (
            <button
              onClick={handleGetStarted}
              disabled={isSigningIn}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 rounded-xl font-bold shadow-lg disabled:opacity-70"
            >
              {isSigningIn ? "Signing in..." : "Get Started"}
            </button>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center pt-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-purple-900/30" />
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full bg-indigo-600/20 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-indigo-400 font-bold">
              <Zap size={14} /> Proof-Based Hiring System
            </div>

            <h1 className="text-6xl font-black leading-[0.9]">
              Replace Resumes.
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Hire With Proof.
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl">
              Evaluate developers using GitHub intelligence, coding performance,
              and verified credentials with a unified score.
            </p>

            <button
              onClick={handleGetStarted}
              disabled={isSigningIn}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-2 shadow-xl disabled:opacity-70"
            >
              {isSigningIn ? "Signing in..." : "Start Your Score"}{" "}
              <ArrowRight size={18} />
            </button>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>

          {/* RIGHT CARD */}
          <div className="hidden lg:flex justify-center">
            <div className="w-[400px] rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <p className="text-xs text-slate-400 mb-2">
                Hire Readiness Score
              </p>
              <h2 className="text-5xl font-black text-indigo-400 mb-4">
                82 / 100
              </h2>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[82%] bg-gradient-to-r from-indigo-500 to-purple-500" />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <ScoreBox title="GitHub" percent="30%" />
                <ScoreBox title="LeetCode" percent="30%" />
                <ScoreBox title="Resume" percent="20%" />
                <ScoreBox title="Certificates" percent="20%" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="text-5xl font-black mb-6">
            Core Intelligence Engine
          </h2>
          <p className="text-slate-400">
            Built around measurable proof and real developer signals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
          <Feature icon={<Github />} title="GitHub Analysis" desc="Repo, stars, activity scoring." />
          <Feature icon={<Code2 />} title="Coding Strength" desc="LeetCode and problem solving." />
          <Feature icon={<Award />} title="Certificates" desc="Credibility and skill validation." />
          <Feature icon={<Layers />} title="Scoring Engine" desc="Weighted hire readiness score." />
          <Feature icon={<ShieldCheck />} title="Verification" desc="Proof-based validation system." />
          <Feature icon={<BarChart3 />} title="Analytics" desc="Performance insights and growth." />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-16 border-t border-white/10 text-center text-slate-500 text-sm">
        © 2026 SkillMeter — Proof-Based Hiring Platform
      </footer>
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */
const Feature = ({ icon, title, desc }: FeatureProps) => (
  <div className="p-6 rounded-xl bg-white/5 border border-white/10">
    <div className="mb-3 text-indigo-400">{icon}</div>
    <h3 className="font-bold">{title}</h3>
    <p className="text-sm text-slate-400">{desc}</p>
  </div>
);

const ScoreBox = ({ title, percent }: ScoreBoxProps) => (
  <div>
    <p className="text-indigo-400 font-bold">{percent}</p>
    <p className="text-slate-400 text-xs">{title}</p>
  </div>
);

export default HomePage;