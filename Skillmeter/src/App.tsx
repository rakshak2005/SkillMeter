import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Code2, 
  Terminal, 
  ShieldCheck, 
  Briefcase, 
  History, 
  Activity, 
  Cpu, 
  Zap, 
  Award, 
  CheckCircle2,
  ExternalLink,
  Loader2,
  TrendingUp,
  Map,
  Link2,
  Search,
  Star,
  Layers,
  Fingerprint
} from 'lucide-react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

// --- Components ---

const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={`relative bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] transition-all duration-500 hover:border-[#0d59f2]/50 hover:shadow-[0_0_50px_rgba(13,89,242,0.15)] overflow-hidden ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
};

const Gauge: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const circumference = 2 * Math.PI * 40;
  useEffect(() => {
    let start = 0;
    const timer = setInterval(() => {
      if (start < value) { start += 1; setDisplayValue(start); }
      else clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="relative flex items-center justify-center scale-75 lg:scale-100">
      <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
        <circle className="stroke-white/5" cx="50" cy="50" r="40" fill="none" strokeWidth="8" />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (circumference * value) / 100 }}
          transition={{ duration: 2, ease: "circOut" }}
          className="stroke-[#0d59f2]" cx="50" cy="50" r="40" fill="none" strokeWidth="8" 
          strokeDasharray={circumference} strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-6xl font-bold font-mono text-white">{displayValue}%</span>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Score</span>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-[#070708] text-white selection:bg-[#0d59f2]/30 overflow-x-hidden font-sans">
      
      {/* Abstract Background */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0d59f2]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00f2ff]/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
      </div>

      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0d59f2] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0d59f2]/30">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">Skillmeter</span>
          </div>
          <button className="px-6 py-2.5 text-sm font-bold bg-[#0d59f2] rounded-xl hover:scale-105 transition-all">Launch Protocol</button>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-24 px-6 max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <section className="mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#00f2ff] text-[10px] font-bold tracking-widest uppercase">
                Now Live: Autonomous Talent Verification
              </motion.div>
              <h1 className="text-6xl lg:text-8xl font-black tracking-tight leading-[0.9] text-white">
                The New Standard <br /> 
                <span className="bg-gradient-to-r from-[#0d59f2] to-[#00f2ff] bg-clip-text text-transparent">of Trust.</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-xl mx-auto lg:mx-0">
                Replace resumes with real-time proof. Skillmeter converts your code, consistency, and architecture into a verified hiring signal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="px-10 py-5 bg-[#0d59f2] rounded-[1.5rem] font-bold text-lg shadow-2xl shadow-[#0d59f2]/40 hover:translate-y-[-2px] transition-all">Start Scoring</button>
                <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] font-bold text-lg hover:bg-white/10 transition-all">View Leaderboard</button>
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <motion.div initial={{ rotate: 5, scale: 0.9 }} animate={{ rotate: 0, scale: 1 }} className="relative">
                <div className="absolute inset-0 bg-[#0d59f2]/20 blur-[80px] rounded-full" />
                <GlassCard className="p-12 text-center">
                  <Gauge value={84} />
                  <p className="mt-8 text-sm font-mono text-gray-500 uppercase">Verification Level: Elite</p>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- NEW SECTION: DATA & ANALYSIS CARDS --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32">
          
          {/* Left Column: Input & Engine */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Card 1: What Students Connect */}
            <GlassCard className="p-8 group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#0d59f2]/10 rounded-2xl flex items-center justify-center text-[#0d59f2]">
                  <Link2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">What Students Connect</h3>
              </div>
              <ul className="space-y-4">
                {[
                  { icon: Code2, text: "GitHub repositories" },
                  { icon: Terminal, text: "Coding challenge results" },
                  { icon: Award, text: "Verified certificates (AWS, Google, etc.)" },
                  { icon: Briefcase, text: "Dynamic Professional Resume" },
                  { icon: History, text: "GitHub activity and commits" },
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    whileHover={{ x: 10 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-[#0d59f2]/5 transition-all"
                  >
                    <item.icon className="w-5 h-5 text-gray-500 group-hover:text-[#00f2ff] transition-colors" />
                    <span className="text-sm font-medium text-gray-300">{item.text}</span>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>

            {/* Card 2: What Skillmeter Analyzes */}
            <GlassCard className="p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-[#00f2ff]">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold">What Skillmeter Analyzes</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: Cpu, label: "Code quality and architecture" },
                  { icon: TrendingUp, label: "Commit consistency" },
                  { icon: Map, label: "System design patterns" },
                  { icon: Zap, label: "Project impact" },
                  { icon: ShieldCheck, label: "Certification credibility" },
                  { icon: Terminal, label: "Coding challenge performance" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors">
                    <item.icon className="w-4 h-4 text-[#0d59f2]" />
                    <span className="text-sm text-gray-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Recruiter Dashboard View */}
          <div className="lg:col-span-7">
            <GlassCard className="h-full p-10 relative">
              <div className="absolute top-0 right-0 p-8">
                <Fingerprint className="w-12 h-12 text-white/5" />
              </div>

              <div className="mb-12">
                <h3 className="text-3xl font-bold mb-2">What Recruiters See</h3>
                <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Data-driven developer credibility dashboard</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Hire Readiness Score", value: "92%", type: "progress", color: "bg-[#00f2ff]", icon: Activity },
                  { label: "Architecture Score", value: "98/100", icon: Layers },
                  { label: "Code Quality Index", value: "91%", icon: Code2 },
                  { label: "Consistency Score", value: "92/100", icon: History },
                  { label: "System Design Strength", value: "VALIDATED", special: "text-green-400 font-bold", icon: Map },
                  { label: "Certification Verification", value: "VERIFIED", icon: ShieldCheck, check: true },
                  { label: "Top Project Impact", value: "2.4k stars", icon: Star },
                  { label: "Developer Skill Distribution", value: "4 DIMENSIONS", icon: Search },
                ].map((row, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        <row.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-sm font-semibold text-gray-300">{row.label}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {row.type === "progress" && (
                        <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: '92%' }} className={`h-full ${row.color}`} />
                        </div>
                      )}
                      {row.check && <CheckCircle2 className="w-4 h-4 text-[#00f2ff]" />}
                      <span className={`text-sm font-mono tracking-tighter ${row.special || 'text-[#0d59f2]'}`}>
                        {row.value}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 flex items-center justify-center p-6 border border-dashed border-white/10 rounded-[2rem] bg-[#0d59f2]/5">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.3em] mb-2">Security Protocol</p>
                  <p className="text-xs text-gray-400 font-mono italic">"This profile represents a high-integrity signal based on 2,400+ data points"</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mt-32 text-center py-20 border-t border-white/5">
          <h2 className="text-5xl font-bold mb-8 tracking-tighter">Ready to Verify?</h2>
          <div className="flex justify-center gap-4">
            <button className="px-12 py-5 bg-white text-black font-black rounded-3xl hover:bg-gray-200 transition-all">Claim Profile</button>
          </div>
        </section>

      </main>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] text-gray-600 uppercase tracking-[0.5em]">
        © 2026 Skillmeter Protocol • Neural Hiring Engine
      </footer>
    </div>
  );
}