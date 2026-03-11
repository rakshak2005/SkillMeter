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
} from 'lucide-react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

// --- Types ---

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

// --- Components ---

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
  <a 
    href={href} 
    className="hover:text-white transition-colors text-sm text-gray-400 font-medium"
  >
    {children}
  </a>
);

/**
 * GlassCard component with deep curved edges and interactive tilt effect
 */
const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      // Increased rounded corners to 2.5rem (40px) for a premium look
      className={`relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] transition-all duration-500 hover:border-[#0d59f2]/40 hover:shadow-[0_0_40px_rgba(13,89,242,0.15)] overflow-hidden ${className}`}
    >
      <div style={{ transform: "translateZ(25px)" }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
};

const Gauge: React.FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (circumference * value) / 100;

  useEffect(() => {
    let start = 0;
    const timer = setInterval(() => {
      if (start < value) {
        start += 1;
        setDisplayValue(start);
      } else {
        clearInterval(timer);
      }
    }, 15);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
        <circle 
          className="stroke-white/5" 
          cx="50" cy="50" r="40" 
          fill="none" 
          strokeWidth="8" 
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="stroke-[#0d59f2]"
          cx="50" cy="50" r="40"
          fill="none"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-6xl font-bold font-mono tracking-tighter text-white">
          {displayValue}%
        </span>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
          Ready for Hire
        </span>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-[#0d59f2]/30 overflow-x-hidden font-sans">
      
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d59f2]/5 via-transparent to-transparent" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0d59f2] rounded-xl flex items-center justify-center shadow-lg shadow-[#0d59f2]/20">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Skillmeter</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="#">For Recruiters</NavLink>
            <NavLink href="#">Solutions</NavLink>
            <NavLink href="#">Leaderboard</NavLink>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Log in
            </button>
            <button className="px-5 py-2 text-sm font-bold bg-[#0d59f2] text-white rounded-xl shadow-lg shadow-[#0d59f2]/20 hover:bg-[#0d59f2]/90 transition-all">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <section className="relative mb-24 mt-8 lg:mt-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#0d59f2]/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-8">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-[#00f2ff] bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f2ff] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f2ff]"></span>
                </span>
                Vercel-Verified Protocol v2.0
              </motion.div>
              
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]"
                >
                  <span className="text-white">Prove Your </span>
                  <span className="bg-gradient-to-r from-[#0d59f2] via-[#00f2ff] to-[#0d59f2] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                    Skills.
                  </span>
                  <br />
                  <span className="text-white/90">Get Recognized.</span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-lg text-lg text-gray-400 leading-relaxed"
                >
                  A data-driven intelligence layer for developers. Analyze your code, 
                  track your consistency, and unlock your true hire-readiness score.
                </motion.p>
              </div>

              <motion.div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-[#0d59f2] text-white text-sm font-bold rounded-[1.25rem] shadow-[0_0_20px_rgba(13,89,242,0.4)] hover:bg-[#0d59f2]/90 transition-all">
                  Claim Your Profile
                </button>
                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-[1.25rem] hover:bg-white/10 transition-all">
                  Leaderboard
                </button>
              </motion.div>
            </div>

            <div className="lg:col-span-6 relative">
              <motion.div className="relative group">
                <div className="absolute -top-6 -right-6 w-full h-full bg-[#0d59f2]/10 rounded-[3.5rem] border border-white/5 -z-10" />
                <GlassCard className="p-10 flex flex-col items-center justify-center border-white/20">
                  <Gauge value={84} />
                  <div className="w-full mt-10 grid grid-cols-2 gap-8">
                    <div className="text-center p-4 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Current Rank</p>
                      <p className="text-3xl font-mono font-bold text-[#00f2ff]">#42</p>
                    </div>
                    <div className="text-center p-4 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Percentile</p>
                      <p className="text-3xl font-mono font-bold text-white">Top 2%</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main Score Card */}
          <GlassCard className="md:col-span-8 p-10 flex flex-col items-center justify-between">
            <div className="w-full flex justify-between items-start mb-12">
              <div>
                <h3 className="text-2xl font-bold mb-1">Hire Readiness Score</h3>
                <p className="text-sm text-gray-500">Aggregate verification from 14 coding signals</p>
              </div>
              <div className="px-3 py-1 bg-[#0d59f2]/10 border border-[#0d59f2]/20 rounded-xl text-[#00f2ff] text-xs font-mono">
                STABLE
              </div>
            </div>

            <Gauge value={84} />

            <div className="w-full grid grid-cols-3 gap-6 mt-16 pt-8 border-t border-white/5">
              {[
                { label: "Architecture", score: "98", sub: "Pattern Match: High" },
                { label: "Consistency", score: "92", sub: "Last 12mo Activity" },
                { label: "Velocity", score: "TOP 2%", sub: "Cycle Time: 4.2h" },
              ].map((metric, i) => (
                <div key={i} className="text-center group cursor-help">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 group-hover:text-[#00f2ff] transition-colors">
                    {metric.label}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-2xl font-mono text-white">{metric.score}</span>
                    {metric.score.length < 3 && <span className="text-xs text-gray-600">/100</span>}
                  </div>
                  <div className="text-[9px] text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {metric.sub}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Intelligence distribution */}
          <GlassCard className="md:col-span-4 p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-300 font-bold">
                <Code2 className="w-6 h-6" />
                Intelligence
              </div>
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Verified</span>
            </div>

            <div className="space-y-4">
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">Impact Distribution</div>
              <div className="flex gap-1.5 overflow-hidden h-3">
                {[1, 4, 10, 2, 6, 8, 1, 3, 10, 9, 2, 5].map((level, i) => (
                  <div key={i} className="flex-1 rounded-full" style={{ 
                    backgroundColor: `rgba(13, 89, 242, ${level/10})`,
                    border: level > 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                  }} />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs text-gray-400">Quality Index</span>
                <span className="font-mono text-sm text-[#00f2ff]">91%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-xs text-gray-400">Maintainability</span>
                <span className="font-mono text-sm text-green-400">Grade A</span>
              </div>
            </div>

            <div className="mt-auto p-5 bg-[#0d59f2]/5 border border-[#0d59f2]/20 rounded-2xl">
              <div className="text-[9px] text-[#0d59f2]/60 uppercase font-bold tracking-widest mb-1">Top Impact Project</div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold">Trading Engine</span>
                <span className="text-xs text-[#00f2ff] font-mono flex items-center gap-1">★ 2.4k</span>
              </div>
            </div>
          </GlassCard>

          {/* Certificate Vault */}
          <GlassCard className="md:col-span-5 p-8 flex flex-col justify-between">
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#00f2ff]/5 rounded-full blur-3xl" />
            <div>
              <h3 className="text-xl font-bold flex items-center gap-3 mb-8">
                <ShieldCheck className="w-6 h-6 text-[#00f2ff]" />
                Certificate Vault
              </h3>
              <div className="space-y-4">
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all">
                  <div>
                    <p className="text-base font-semibold">Cloud Architect Pro</p>
                    <p className="text-[10px] text-[#00f2ff]/70 font-mono mt-1 uppercase">ID: AWS-9823-PRO-01</p>
                  </div>
                  <button className="px-4 py-2 bg-[#0d59f2]/20 border border-[#0d59f2]/30 text-[#00f2ff] text-[10px] font-bold uppercase rounded-xl hover:bg-[#0d59f2] hover:text-white transition-all">
                    Verify
                  </button>
                </div>
                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between opacity-50 grayscale">
                  <div>
                    <p className="text-base font-semibold">Security Specialist</p>
                    <p className="text-[10px] text-gray-500 uppercase">Verification Pending...</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                </div>
              </div>
            </div>
            <p className="text-[9px] text-gray-600 mt-8 font-mono">SECURED BY SKILLMETER PROTOCOL v2.4</p>
          </GlassCard>

          {/* Pipeline Card */}
          <GlassCard className="md:col-span-7 p-8 relative overflow-hidden">
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent z-0 opacity-40 shadow-[0_0_10px_rgba(0,242,255,0.5)]"
            />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Autonomous Pipeline Analysis</h3>
                <span className="text-[10px] font-mono text-[#00f2ff]">CONFIDENCE: 92%</span>
              </div>
              
              <div className="space-y-8 flex-1">
                {[
                  { label: "Dependency Graph Mapping", sub: "Analyzing tree...", val: 84, color: "bg-[#0d59f2]" },
                  { label: "System Design Patterns", sub: "Mapping nodes...", val: 100, color: "bg-green-500", label2: "VALIDATED" },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-3 items-end">
                      <div>
                        <span className="text-sm font-semibold">{item.label}</span>
                        <p className="text-[9px] text-gray-500 uppercase mt-0.5">{item.sub}</p>
                      </div>
                      <span className={`text-[10px] font-mono ${item.label2 ? 'text-green-400' : 'text-[#00f2ff]'}`}>
                        {item.label2 || `${item.val}%`}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.val}%` }}
                        transition={{ duration: 2, delay: 0.5 + i*0.2 }}
                        className={`${item.color} h-full relative`}
                      >
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/20 to-transparent" />
                      </motion.div>
                    </div>
                  </div>
                ))}
                
                <div className="p-5 bg-[#0d59f2]/5 border border-[#0d59f2]/10 rounded-2xl flex items-center gap-4 mt-auto">
                  <Loader2 className="w-5 h-5 text-[#00f2ff] animate-spin" />
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-tighter">
                    Heuristic matching on core infrastructure (queued)
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Career Evolution */}
          <GlassCard className="md:col-span-4 p-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Career Evolution</h3>
            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-white/10">
              {[
                { date: "2026 PRESENT", title: "Lead Systems Architect", active: true },
                { date: "2024 - 2026", title: "Senior Cloud Engineer", active: false },
                { date: "2022", title: "Fullstack Developer", active: false },
              ].map((job, i) => (
                <div key={i} className={`relative pl-8 ${!job.active ? 'opacity-50' : ''}`}>
                  <div className={`absolute left-0 top-1.5 w-[22px] h-[22px] rounded-full flex items-center justify-center border-4 border-[#0A0A0B] ${job.active ? 'bg-[#0d59f2]' : 'bg-white/20'}`}>
                    {job.active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <p className={`text-[10px] font-mono mb-1 ${job.active ? 'text-[#00f2ff]' : 'text-gray-500'}`}>{job.date}</p>
                  <p className="font-bold text-sm">{job.title}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Hiring Confidence */}
          <GlassCard className="md:col-span-8 p-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Hiring Confidence</h3>
              <div className="flex items-center gap-6">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-8xl font-bold font-mono text-green-400"
                >
                  92%
                </motion.span>
                <div className="hidden md:block space-y-2">
                  <div className="px-3 py-1 bg-green-500/10 rounded-lg border border-green-500/20 text-green-400 text-xs font-bold uppercase">Ultra Low Risk</div>
                  <div className="px-3 py-1 bg-[#0d59f2]/10 rounded-lg border border-[#0d59f2]/20 text-[#00f2ff] text-xs font-bold uppercase">High Signal</div>
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-8 md:mt-0 flex gap-4">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <Activity className="w-6 h-6 text-[#0d59f2] mb-2 mx-auto" />
                <p className="text-[10px] text-gray-500 uppercase font-bold">Health</p>
                <p className="text-xl font-mono">100%</p>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <TrendingUp className="w-6 h-6 text-[#00f2ff] mb-2 mx-auto" />
                <p className="text-[10px] text-gray-500 uppercase font-bold">Growth</p>
                <p className="text-xl font-mono">+12.4%</p>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Footer CTA */}
        <section className="mt-32 text-center py-20 border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0d59f2]/5 blur-3xl rounded-full scale-150" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Find Verified Top Developers</h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
              Access a leaderboard of AI-analyzed developers based on GitHub activity, coding performance, and verified skills.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="w-full sm:w-auto px-10 py-5 bg-[#0d59f2] text-white font-bold rounded-2xl shadow-2xl shadow-[#0d59f2]/30 hover:bg-[#0d59f2]/90 transition-all active:scale-95">
                Start Hiring
              </button>
              <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all active:scale-95">
                Get Your Skill Score
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] text-gray-600 uppercase tracking-[0.3em] font-medium">
        © 2026 Skillmeter Protocol. Built for the future of tech hiring.
      </footer>
    </div>
  );
}