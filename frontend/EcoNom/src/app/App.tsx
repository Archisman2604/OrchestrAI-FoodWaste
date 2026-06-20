import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  LayoutDashboard, BarChart2, FlaskConical, Lightbulb,
  Menu, TrendingDown, TrendingUp, Utensils, Trash2, Percent,
  AlertTriangle, CheckCircle2, Clock, ChevronRight, Leaf,
  Zap, Users, Upload, Camera, ScanLine, Sparkles, X,
  MessageSquare, ChevronDown, RefreshCcw, Check,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Page = "dashboard" | "analytics" | "simulation" | "recommendations" | "input";

// ─── Data ────────────────────────────────────────────────────────────────────

const trendData = [
  { date: "Jun 12", prepared: 420, wasted: 68 },
  { date: "Jun 13", prepared: 380, wasted: 52 },
  { date: "Jun 14", prepared: 510, wasted: 91 },
  { date: "Jun 15", prepared: 445, wasted: 60 },
  { date: "Jun 16", prepared: 490, wasted: 73 },
  { date: "Jun 17", prepared: 530, wasted: 58 },
  { date: "Jun 18", prepared: 465, wasted: 49 },
];

const weeklyData = [
  { week: "W22", wasted: 312, saved: 1800 },
  { week: "W23", wasted: 278, saved: 2100 },
  { week: "W24", wasted: 340, saved: 1950 },
  { week: "W25", wasted: 255, saved: 2300 },
  { week: "W26", wasted: 289, saved: 2200 },
];

const monthlyData = [
  { month: "Jan", wasted: 1340, target: 1200 },
  { month: "Feb", wasted: 1180, target: 1200 },
  { month: "Mar", wasted: 1420, target: 1200 },
  { month: "Apr", wasted: 1090, target: 1100 },
  { month: "May", wasted: 980, target: 1100 },
  { month: "Jun", wasted: 451, target: 1000 },
];

const causeData = [
  { name: "Over-preparation", value: 38, color: "#4ade80" },
  { name: "Spoilage", value: 27, color: "#f59e0b" },
  { name: "Plate returns", value: 18, color: "#38bdf8" },
  { name: "Buffet surplus", value: 12, color: "#f472b6" },
  { name: "Prep errors", value: 5, color: "#a78bfa" },
];

const recommendations = [
  {
    id: 1, priority: "high",
    title: "Reduce Friday prep by 15%",
    description: "Friday evening service consistently sees 22% waste. Adjusting prep volume to 340 portions aligns with 3-month attendance patterns.",
    action: "Adjust portion plan", impact: "Saves ~18 kg/week", category: "Prep Volume", icon: Utensils,
  },
  {
    id: 2, priority: "high",
    title: "Refrigerate surplus salads immediately",
    description: "Leafy salad components account for 31% of spoilage. Refrigerating within 45 minutes of service end extends usable life by 16 hours.",
    action: "Update SOP", impact: "Cuts spoilage 12%", category: "Storage", icon: Clock,
  },
  {
    id: 3, priority: "medium",
    title: "Introduce daily specials from surplus",
    description: "Utilizing day-2 proteins in a daily special menu item can recover 8–12 kg of edible food per week currently discarded before morning prep.",
    action: "Create rotating menu", impact: "Recovers 40 kg/month", category: "Menu Planning", icon: Leaf,
  },
  {
    id: 4, priority: "medium",
    title: "Batch-cook grains to order",
    description: "Pre-cooking full grain batches at opening results in 19% surplus at close. Switching to 3 smaller batches timed to peaks reduces this to under 5%.",
    action: "Update kitchen schedule", impact: "Saves 6 kg/day", category: "Cooking Method", icon: Zap,
  },
  {
    id: 5, priority: "low",
    title: "Partner with local food bank",
    description: "Surplus that cannot be repurposed internally can be donated. A refrigerated pickup arrangement ensures 0 kg goes to landfill on high-volume days.",
    action: "Arrange logistics", impact: "Zero landfill days", category: "Redistribution", icon: Users,
  },
];

const simEventTypes = [
  "Regular Service", "Corporate Lunch", "Wedding Banquet",
  "Festival / Buffet", "Private Dinner", "Catering Off-site",
];

// ─── Decorative SVG background patterns ───────────────────────────────────────

function HexGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex" width="56" height="48" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
          <polygon points="14,2 42,2 56,24 42,46 14,46 0,24" fill="none" stroke="#4ade80" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  );
}

function DotGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#4ade80" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

function CircuitLines({ className = "" }: { className?: string }) {
  return (
    <svg className={`absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="circuit" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M0 40 H30 M50 40 H80 M40 0 V30 M40 50 V80" stroke="#4ade80" strokeWidth="1" fill="none" />
          <circle cx="40" cy="40" r="4" fill="none" stroke="#4ade80" strokeWidth="1" />
          <circle cx="0" cy="40" r="2" fill="#4ade80" />
          <circle cx="80" cy="40" r="2" fill="#4ade80" />
          <circle cx="40" cy="0" r="2" fill="#4ade80" />
          <circle cx="40" cy="80" r="2" fill="#4ade80" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#circuit)" />
    </svg>
  );
}

// ─── Tooltip style ────────────────────────────────────────────────────────────

const tooltipStyle = {
  backgroundColor: "#0d1a0f",
  border: "1px solid rgba(74,222,128,0.15)",
  borderRadius: "8px",
  color: "#ddeee1",
  fontSize: "12px",
  fontFamily: '"DM Mono", monospace',
};

// ─── Shared Components ────────────────────────────────────────────────────────

function StatCard({ label, value, unit, delta, icon: Icon, accent = false }: {
  label: string; value: string | number; unit?: string;
  delta?: { value: string; up: boolean }; icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl border bg-card p-5 flex flex-col gap-3 transition-all duration-300 hover:scale-[1.02] group overflow-hidden ${accent ? "border-primary/40 ring-1 ring-primary/20" : "border-border hover:border-primary/25"}`}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 group-hover:opacity-10 transition-opacity" style={{ background: accent ? "#4ade80" : "#142016" }} />
      <div className="flex items-start justify-between relative z-10">
        <span className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase">{label}</span>
        <span className={`p-2 rounded-xl ${accent ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground group-hover:text-primary transition-colors"}`}>
          <Icon size={13} />
        </span>
      </div>
      <div className="flex items-baseline gap-1.5 relative z-10">
        <span className="font-display text-4xl font-black text-foreground leading-none tracking-tight">{value}</span>
        {unit && <span className="text-sm text-muted-foreground font-mono">{unit}</span>}
      </div>
      {delta && (
        <div className="flex items-center gap-1.5 relative z-10">
          {delta.up ? <TrendingUp size={11} className="text-destructive" /> : <TrendingDown size={11} className="text-primary" />}
          <span className={`text-xs font-mono font-medium ${delta.up ? "text-destructive" : "text-primary"}`}>{delta.value}</span>
          <span className="text-xs text-muted-foreground">vs last week</span>
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 ${className}`}>
      <h3 className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-4">{title}</h3>
      {children}
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden bg-card border border-border p-8">
        <HexGrid />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-6 rounded-full bg-primary" />
            <span className="text-xs font-mono text-muted-foreground tracking-[0.2em] uppercase">Live Overview</span>
          </div>
          <h1 className="font-display text-4xl font-black text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Week of Jun 12 – Jun 18, 2025 · Greenleaf Kitchen</p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full border border-primary/10 opacity-60" />
        <div className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full border border-primary/5 opacity-60" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Prepared" value="3,240" unit="kg" delta={{ value: "+4.2%", up: true }} icon={Utensils} />
        <StatCard label="Total Wasted" value="451" unit="kg" delta={{ value: "−8.1%", up: false }} icon={Trash2} accent />
        <StatCard label="Waste Rate" value="13.9" unit="%" delta={{ value: "−1.6pp", up: false }} icon={Percent} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard title="Daily Waste Trend — This Week" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gPrepared" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gWasted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.06)" />
              <XAxis dataKey="date" tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area key="dash-prepared" type="monotone" dataKey="prepared" stroke="#4ade80" strokeWidth={2} fill="url(#gPrepared)" name="Prepared (kg)" />
              <Area key="dash-wasted" type="monotone" dataKey="wasted" stroke="#f59e0b" strokeWidth={2} fill="url(#gWasted)" name="Wasted (kg)" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            {[{ label: "Prepared", color: "bg-primary" }, { label: "Wasted", color: "bg-accent" }].map(l => (
              <span key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`w-3 h-0.5 ${l.color} rounded-full inline-block`} /> {l.label}
              </span>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Waste Causes">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={causeData} cx="50%" cy="50%" innerRadius={46} outerRadius={70} paddingAngle={3} dataKey="value">
                {causeData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} opacity={0.88} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(val: number) => [`${val}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {causeData.map((c) => (
              <div key={c.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="text-xs font-mono text-foreground">{c.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "CO₂ Equivalent Saved", value: "203 kg", sub: "vs baseline target", icon: "🌿" },
          { label: "Avg Waste / Service", value: "64.4 kg", sub: "7-day rolling", icon: "📊" },
          { label: "On-Target Days", value: "5 / 7", sub: "below 15% threshold", icon: "✓" },
        ].map((s) => (
          <div key={s.label} className="relative rounded-2xl border border-border bg-card p-5 overflow-hidden group hover:border-primary/20 transition-all">
            <DotGrid />
            <span className="absolute top-4 right-5 text-2xl opacity-20 group-hover:opacity-30 transition-opacity">{s.icon}</span>
            <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase relative z-10">{s.label}</p>
            <p className="font-display text-3xl font-black text-foreground mt-2 relative z-10">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1 relative z-10">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────

function AnalyticsPage() {
  const [view, setView] = useState<"day" | "week" | "month">("week");

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden border border-border p-8" style={{ background: "linear-gradient(135deg, #0d1a0f 0%, #0a1409 60%, #0f2212 100%)" }}>
        <CircuitLines />
        <div className="relative z-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-primary tracking-wider">LIVE ANALYSIS</span>
            </div>
            <h1 className="font-display text-4xl font-black text-foreground tracking-tight">Analytics</h1>
            <p className="text-muted-foreground text-sm mt-1">Waste patterns and trend analysis</p>
          </div>
          <div className="flex gap-1 bg-black/30 backdrop-blur rounded-xl p-1 border border-border">
            {(["day", "week", "month"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200 capitalize ${view === v ? "bg-primary text-primary-foreground font-medium shadow-lg" : "text-muted-foreground hover:text-foreground"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title={`Waste by ${view} — volume (kg)`}>
          <ResponsiveContainer width="100%" height={240}>
            {view === "month" ? (
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.06)" />
                <XAxis dataKey="month" tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar key="month-wasted" dataKey="wasted" fill="#f59e0b" name="Wasted (kg)" radius={[6, 6, 0, 0]} opacity={0.85} />
                <Bar key="month-target" dataKey="target" fill="#4ade80" name="Target (kg)" radius={[6, 6, 0, 0]} opacity={0.35} />
              </BarChart>
            ) : view === "week" ? (
              <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.06)" />
                <XAxis dataKey="week" tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar key="week-wasted" dataKey="wasted" fill="#f59e0b" name="Wasted (kg)" radius={[6, 6, 0, 0]} opacity={0.85} />
              </BarChart>
            ) : (
              <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gW2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.06)" />
                <XAxis dataKey="date" tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area key="day-wasted" type="monotone" dataKey="wasted" stroke="#f59e0b" strokeWidth={2} fill="url(#gW2)" name="Wasted (kg)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly: Saved vs. Wasted">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.06)" />
              <XAxis dataKey="week" tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#5e8464", fontFamily: "DM Mono" }} />
              <Bar key="vs-saved" dataKey="saved" fill="#4ade80" name="Saved (kg)" radius={[6, 6, 0, 0]} opacity={0.72} />
              <Bar key="vs-wasted" dataKey="wasted" fill="#f59e0b" name="Wasted (kg)" radius={[6, 6, 0, 0]} opacity={0.72} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Top Waste Causes — Breakdown">
          <div className="space-y-4 mt-1">
            {causeData.map((c, i) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground w-4">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm text-foreground">{c.name}</span>
                  </div>
                  <span className="text-xs font-mono font-medium" style={{ color: c.color }}>{c.value}%</span>
                </div>
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${c.value}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: i * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Monthly Waste vs. Target">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.06)" />
              <XAxis dataKey="month" tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5e8464", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line key="line-wasted" type="monotone" dataKey="wasted" stroke="#f59e0b" strokeWidth={2.5} dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }} name="Actual (kg)" />
              <Line key="line-target" type="monotone" dataKey="target" stroke="#4ade80" strokeWidth={2} strokeDasharray="6 3" dot={false} name="Target (kg)" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Best Week", value: "W25", sub: "255 kg wasted" },
          { label: "Worst Day", value: "Jun 14", sub: "91 kg — festival over-prep" },
          { label: "Avg Waste Rate", value: "14.2%", sub: "6-month rolling" },
          { label: "Reduction YTD", value: "−18.4%", sub: "vs Jan baseline" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 hover:border-primary/20 transition-all">
            <p className="text-[10px] font-mono text-muted-foreground tracking-[0.15em] uppercase">{s.label}</p>
            <p className="font-display text-xl font-black text-foreground mt-2">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Simulation Page ──────────────────────────────────────────────────────────

interface SimResult {
  estimatedWaste: number; wasteRate: number;
  suggestions: string[]; risk: "low" | "medium" | "high";
}

function SimulationPage() {
  const [prepared, setPrepared] = useState("");
  const [customers, setCustomers] = useState("");
  const [eventType, setEventType] = useState(simEventTypes[0]);
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);

  const simulate = () => {
    if (!prepared || !customers) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const prep = parseFloat(prepared), cust = parseFloat(customers);
      const baseRates: Record<string, number> = {
        "Regular Service": 0.13, "Corporate Lunch": 0.10, "Wedding Banquet": 0.18,
        "Festival / Buffet": 0.22, "Private Dinner": 0.09, "Catering Off-site": 0.15,
      };
      const ratio = prep / Math.max(cust, 1);
      const rateModifier = ratio > 1.5 ? 1.4 : ratio > 1.2 ? 1.1 : 0.9;
      const wasteRate = Math.min((baseRates[eventType] ?? 0.13) * rateModifier, 0.45);
      const estimatedWaste = Math.round(prep * wasteRate * 10) / 10;
      const risk: "low" | "medium" | "high" = wasteRate < 0.12 ? "low" : wasteRate < 0.18 ? "medium" : "high";
      const suggestions: string[] = [];
      if (ratio > 1.5) suggestions.push(`Reduce prep to ~${Math.round(cust * 1.15)} kg — current ratio is too high.`);
      if (eventType === "Festival / Buffet") suggestions.push("Batch cook in 3 rounds to minimize buffet surplus.");
      if (eventType === "Wedding Banquet") suggestions.push("Confirm final headcount 48 hours before to tighten portions.");
      suggestions.push("Refrigerate portioned surplus within 30 minutes of service close.");
      if (estimatedWaste > 50) suggestions.push("Arrange food bank pickup for estimated surplus above 30 kg.");
      setResult({ estimatedWaste, wasteRate: Math.round(wasteRate * 1000) / 10, suggestions, risk });
      setLoading(false);
    }, 1400);
  };

  const riskConfig = {
    low: { cls: "text-primary border-primary/30 bg-primary/10", label: "Low Risk", icon: CheckCircle2 },
    medium: { cls: "text-accent border-accent/30 bg-accent/10", label: "Medium Risk", icon: AlertTriangle },
    high: { cls: "text-destructive border-destructive/30 bg-destructive/10", label: "High Risk", icon: AlertTriangle },
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden bg-card border border-border p-8">
        <HexGrid />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <FlaskConical size={14} className="text-primary" />
            <span className="text-xs font-mono text-primary tracking-[0.2em] uppercase">Waste Modeler</span>
          </div>
          <h1 className="font-display text-4xl font-black text-foreground tracking-tight">Simulation</h1>
          <p className="text-muted-foreground text-sm mt-1">Model outcomes before service begins</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 space-y-5">
          <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase">Parameters</p>

          {[
            { id: "prepared", label: "Food Prepared", unit: "kg", val: prepared, set: setPrepared, ph: "e.g. 450" },
            { id: "customers", label: "Expected Customers", unit: "pax", val: customers, set: setCustomers, ph: "e.g. 320" },
          ].map((f) => (
            <div key={f.id} className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center justify-between" htmlFor={f.id}>
                {f.label} <span className="text-xs font-mono text-muted-foreground">{f.unit}</span>
              </label>
              <input id={f.id} type="number" value={f.val} onChange={(e) => f.set(e.target.value)} placeholder={f.ph}
                className="w-full rounded-xl bg-input-background border border-border px-4 py-3 text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
            </div>
          ))}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center justify-between" htmlFor="event">
              Event Type <ChevronDown size={12} className="text-muted-foreground" />
            </label>
            <select id="event" value={eventType} onChange={(e) => setEventType(e.target.value)}
              className="w-full rounded-xl bg-input-background border border-border px-4 py-3 text-foreground text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer">
              {simEventTypes.map((t) => <option key={t} value={t} className="bg-card">{t}</option>)}
            </select>
          </div>

          <button onClick={simulate} disabled={!prepared || !customers || loading}
            className="w-full rounded-xl bg-primary text-primary-foreground font-display font-bold py-3 px-4 transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Simulating…</>
            ) : (<><Zap size={15} /> Run Simulation</>)}
          </button>
        </div>

        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div key="result" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden">
                    <DotGrid />
                    <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase relative z-10">Est. Waste</p>
                    <p className="font-display text-4xl font-black text-accent mt-2 relative z-10">{result.estimatedWaste}</p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5 relative z-10">kg projected</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-5 relative overflow-hidden">
                    <DotGrid />
                    <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase relative z-10">Waste Rate</p>
                    <p className="font-display text-4xl font-black text-foreground mt-2 relative z-10">{result.wasteRate}%</p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5 relative z-10">of total prep</p>
                  </div>
                </div>
                {(() => { const rc = riskConfig[result.risk]; return (
                  <div className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${rc.cls}`}>
                    <rc.icon size={16} /> <span className="text-sm font-medium">{rc.label} Event</span>
                  </div>
                ); })()}
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-3">Mitigation Steps</p>
                  <ul className="space-y-3">
                    {result.suggestions.map((s, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex gap-3 text-sm text-foreground/80">
                        <CheckCircle2 size={14} className="text-primary mt-0.5 flex-shrink-0" /> {s}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-64 rounded-2xl border border-dashed border-border bg-card/40 flex flex-col items-center justify-center p-12 text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                    <FlaskConical size={24} className="text-muted-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-background bg-primary/20" />
                </div>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  Enter your service parameters and run the simulation to see projected waste and mitigation steps.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Recommendations Page ─────────────────────────────────────────────────────

function RecommendationsPage() {
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const priorityBadge = {
    high: "bg-destructive/15 text-destructive border-destructive/25",
    medium: "bg-accent/15 text-accent border-accent/25",
    low: "bg-primary/15 text-primary border-primary/25",
  };

  const filtered = filter === "all" ? recommendations : recommendations.filter((r) => r.priority === filter);

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl overflow-hidden border border-border p-8" style={{ background: "linear-gradient(135deg, #0a1409 0%, #0d1a0f 50%, #0f1e10 100%)" }}>
        <CircuitLines />
        <div className="absolute top-6 right-8 opacity-10">
          <Sparkles size={80} className="text-primary" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-3">
            <Sparkles size={11} className="text-primary" />
            <span className="text-xs font-mono text-primary tracking-wider">AI-GENERATED</span>
          </div>
          <h1 className="font-display text-4xl font-black text-foreground tracking-tight">Recommendations</h1>
          <p className="text-muted-foreground text-sm mt-1">Prioritised actions to cut waste this week</p>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 bg-card border border-border rounded-xl p-1">
          {(["all", "high", "medium", "low"] as const).map((p) => (
            <button key={p} onClick={() => setFilter(p)}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200 capitalize ${filter === p ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"}`}>
              {p}
            </button>
          ))}
        </div>
        <p className="text-xs font-mono text-muted-foreground">{filtered.length} action{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((rec, i) => (
            <motion.div key={rec.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ delay: i * 0.05, duration: 0.3 }}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/25 transition-all duration-200 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <div className="p-3 rounded-2xl bg-secondary group-hover:bg-primary/15 transition-colors">
                    <rec.icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-card ${rec.priority === "high" ? "bg-destructive" : rec.priority === "medium" ? "bg-accent" : "bg-primary"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-foreground">{rec.title}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border capitalize ${priorityBadge[rec.priority as keyof typeof priorityBadge]}`}>{rec.priority}</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground border border-border rounded-lg px-2 py-1 flex-shrink-0">{rec.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{rec.description}</p>
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-primary font-mono">
                      <Leaf size={10} /> {rec.impact}
                    </span>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono group/btn">
                      {rec.action} <ChevronRight size={11} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-4">Action Summary</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "High Priority", count: 2, color: "text-destructive", bg: "bg-destructive/10" },
            { label: "Medium", count: 2, color: "text-accent", bg: "bg-accent/10" },
            { label: "Low Priority", count: 1, color: "text-primary", bg: "bg-primary/10" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
              <span className={`font-display text-3xl font-black ${s.color}`}>{s.count}</span>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Food Input Page ──────────────────────────────────────────────────────────

type InputStage = "upload" | "detecting" | "questions" | "complete";

interface DetectedItem {
  name: string;
  quantity: string;
  confidence: number;
  category: string;
}

interface FollowUpQuestion {
  id: string;
  question: string;
  type: "choice" | "confirm" | "number";
  options?: string[];
  answered?: string;
}

const mockDetectedItems: DetectedItem[] = [
  { name: "Grilled Salmon Fillet", quantity: "~2.4 kg", confidence: 96, category: "Protein" },
  { name: "Steamed Jasmine Rice", quantity: "~3.8 kg", confidence: 91, category: "Grain" },
  { name: "Roasted Vegetables", quantity: "~1.9 kg", confidence: 88, category: "Produce" },
  { name: "Mixed Salad", quantity: "~1.1 kg", confidence: 83, category: "Produce" },
];

const mockQuestions: FollowUpQuestion[] = [
  {
    id: "q1", question: "Is this food from today's service or yesterday's surplus?",
    type: "choice", options: ["Today's service", "Yesterday's surplus", "Prepared 2+ days ago"],
  },
  {
    id: "q2", question: "Was this food kept at the correct temperature throughout service?",
    type: "choice", options: ["Yes, below 5°C / above 63°C", "Uncertain", "No — may have been in danger zone"],
  },
  {
    id: "q3", question: "The salmon has 96% confidence. Confirm this is correct?",
    type: "confirm",
  },
  {
    id: "q4", question: "How many covers were served this service?",
    type: "number",
  },
];

function ScanAnimation({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-video max-h-72 bg-secondary">
      <img src={imageUrl} alt="Uploaded food" className="w-full h-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
      {/* scan line */}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_12px_rgba(74,222,128,0.8)]"
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />
      {/* corner brackets */}
      {[["top-3 left-3", "border-t border-l"], ["top-3 right-3", "border-t border-r"], ["bottom-3 left-3", "border-b border-l"], ["bottom-3 right-3", "border-b border-r"]].map(([pos, borders], i) => (
        <div key={i} className={`absolute ${pos} w-5 h-5 ${borders} border-primary`} />
      ))}
      {/* grid overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(74,222,128,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      {/* label */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/60 backdrop-blur rounded-lg px-3 py-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-xs font-mono text-primary">SCANNING…</span>
      </div>
    </div>
  );
}

function FoodInputPage() {
  const [stage, setStage] = useState<InputStage>("upload");
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [questions, setQuestions] = useState<FollowUpQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [numberInput, setNumberInput] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).filter(f => f.type.startsWith("image/")).map(f => URL.createObjectURL(f));
    if (!urls.length) return;
    setImages(prev => [...prev, ...urls].slice(0, 4));
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const startDetection = () => {
    if (!images.length) return;
    setStage("detecting");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + Math.random() * 12 + 4;
      });
    }, 160);
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setDetectedItems(mockDetectedItems);
      setQuestions(mockQuestions.map(q => ({ ...q })));
      setCurrentQ(0);
      setTimeout(() => setStage("questions"), 400);
    }, 3200);
  };

  const answerQuestion = (answer: string) => {
    setQuestions(prev => prev.map((q, i) => i === currentQ ? { ...q, answered: answer } : q));
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(c => c + 1), 300);
    } else {
      setTimeout(() => setStage("complete"), 400);
    }
  };

  const reset = () => {
    setStage("upload"); setImages([]); setDetectedItems([]);
    setQuestions([]); setCurrentQ(0); setNumberInput(""); setProgress(0);
  };

  const currentQuestion = questions[currentQ];
  const answeredCount = questions.filter(q => q.answered).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden border border-border p-8" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(74,222,128,0.06) 0%, transparent 60%), linear-gradient(135deg, #080f09 0%, #0d1a0f 100%)" }}>
        <DotGrid />
        <div className="relative z-10 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-3">
              <Camera size={11} className="text-primary" />
              <span className="text-xs font-mono text-primary tracking-wider">AI VISION</span>
            </div>
            <h1 className="font-display text-4xl font-black text-foreground tracking-tight">Food Input</h1>
            <p className="text-muted-foreground text-sm mt-1">Upload photos — AI detects food items and guides you through logging</p>
          </div>
          {(stage !== "upload") && (
            <button onClick={reset} className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground border border-border rounded-xl px-4 py-2 hover:border-border/80 transition-all">
              <RefreshCcw size={12} /> Start over
            </button>
          )}
        </div>
      </div>

      {/* Stage: Upload */}
      <AnimatePresence mode="wait">
        {stage === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden group ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-card/60"}`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <motion.div animate={isDragging ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300 }}
                  className="relative mb-5">
                  <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Upload size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-3xl border border-primary/30" />
                </motion.div>
                <h3 className="font-display font-bold text-foreground text-lg">Drop food photos here</h3>
                <p className="text-muted-foreground text-sm mt-1">or click to browse · JPG, PNG, HEIC up to 20MB each</p>
                <div className="flex items-center gap-3 mt-5 flex-wrap justify-center">
                  {["Buffet trays", "Plated dishes", "Prep bowls", "Storage containers"].map(hint => (
                    <span key={hint} className="text-xs font-mono text-muted-foreground border border-border rounded-full px-3 py-1">{hint}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview grid */}
            {images.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative group rounded-2xl overflow-hidden aspect-square bg-secondary">
                    <img src={url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={(e) => { e.stopPropagation(); setImages(prev => prev.filter((_, idx) => idx !== i)); }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black">
                      <X size={11} className="text-white" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 rounded-lg px-2 py-0.5">
                      <span className="text-[10px] font-mono text-white">Photo {i + 1}</span>
                    </div>
                  </div>
                ))}
                {images.length < 4 && (
                  <button onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/40 flex items-center justify-center transition-all group">
                    <Upload size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                )}
              </motion.div>
            )}

            {images.length > 0 && (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={startDetection}
                className="w-full rounded-2xl bg-primary text-primary-foreground font-display font-bold py-4 flex items-center justify-center gap-2 text-base hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-[0.99] transition-all">
                <ScanLine size={18} /> Analyse {images.length} Photo{images.length > 1 ? "s" : ""}
              </motion.button>
            )}
          </motion.div>
        )}

        {/* Stage: Detecting */}
        {stage === "detecting" && (
          <motion.div key="detecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <ScanAnimation imageUrl={images[0]} />

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-mono text-primary">AI Vision Processing</span>
                </div>
                <span className="text-sm font-mono text-muted-foreground">{Math.min(Math.round(progress), 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} transition={{ duration: 0.2 }} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { step: "Identify food items", done: progress > 25 },
                  { step: "Estimate quantities", done: progress > 50 },
                  { step: "Classify categories", done: progress > 72 },
                  { step: "Generate questions", done: progress > 90 },
                ].map(({ step, done }) => (
                  <div key={step} className={`flex items-center gap-2 text-xs font-mono transition-colors ${done ? "text-primary" : "text-muted-foreground"}`}>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${done ? "border-primary bg-primary/20" : "border-border"}`}>
                      {done && <Check size={8} />}
                    </div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage: Questions */}
        {stage === "questions" && (
          <motion.div key="questions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Detected items */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={14} className="text-primary" />
                <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase">Detected Items</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {detectedItems.map((item, i) => (
                  <motion.div key={item.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3 gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs font-mono text-muted-foreground">{item.quantity} · {item.category}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm font-mono font-bold" style={{ color: item.confidence > 90 ? "#4ade80" : item.confidence > 80 ? "#f59e0b" : "#f472b6" }}>
                        {item.confidence}%
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground">conf.</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress bar for questions */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${((answeredCount) / questions.length) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-muted-foreground flex-shrink-0">{answeredCount}/{questions.length} answered</span>
            </div>

            {/* Question cards (answered + current) */}
            <div className="space-y-3">
              {questions.slice(0, currentQ + 1).map((q, idx) => {
                const isActive = idx === currentQ && !q.answered;
                const isDone = !!q.answered;

                return (
                  <motion.div key={q.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border p-5 transition-all duration-300 ${isActive ? "border-primary/30 bg-card" : "border-border bg-card/60"}`}>

                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isDone ? "bg-primary/20" : "bg-secondary"}`}>
                        {isDone ? <Check size={13} className="text-primary" /> : <MessageSquare size={13} className="text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium leading-relaxed ${isDone ? "text-muted-foreground" : "text-foreground"}`}>{q.question}</p>

                        {isDone ? (
                          <div className="mt-2 inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1">
                            <span className="text-xs font-mono text-primary">{q.answered}</span>
                          </div>
                        ) : isActive ? (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-3 space-y-2">
                            {q.type === "choice" && q.options?.map((opt) => (
                              <button key={opt} onClick={() => answerQuestion(opt)}
                                className="w-full text-left rounded-xl border border-border bg-secondary hover:border-primary/40 hover:bg-primary/5 px-4 py-3 text-sm text-foreground transition-all duration-150 hover:text-primary">
                                {opt}
                              </button>
                            ))}
                            {q.type === "confirm" && (
                              <div className="flex gap-2">
                                <button onClick={() => answerQuestion("Confirmed")}
                                  className="flex-1 rounded-xl bg-primary text-primary-foreground font-medium py-2.5 text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                  <Check size={14} /> Confirm
                                </button>
                                <button onClick={() => answerQuestion("Needs correction")}
                                  className="flex-1 rounded-xl border border-border text-foreground font-medium py-2.5 text-sm hover:border-primary/30 transition-all">
                                  Edit
                                </button>
                              </div>
                            )}
                            {q.type === "number" && (
                              <div className="flex gap-2">
                                <input type="number" value={numberInput} onChange={(e) => setNumberInput(e.target.value)} placeholder="Enter number…"
                                  className="flex-1 rounded-xl bg-input-background border border-border px-4 py-2.5 text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
                                <button onClick={() => numberInput && answerQuestion(numberInput + " covers")} disabled={!numberInput}
                                  className="rounded-xl bg-primary text-primary-foreground px-5 font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40">
                                  OK
                                </button>
                              </div>
                            )}
                          </motion.div>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Stage: Complete */}
        {stage === "complete" && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="relative rounded-3xl border border-primary/30 bg-card p-10 text-center overflow-hidden">
              <HexGrid />
              <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-3xl bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-5 relative z-10">
                <CheckCircle2 size={32} className="text-primary" />
              </motion.div>
              <h2 className="font-display text-3xl font-black text-foreground relative z-10">Log Submitted</h2>
              <p className="text-muted-foreground text-sm mt-2 max-w-sm mx-auto relative z-10">
                Food data has been recorded and AI recommendations will update within 60 seconds.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 relative z-10">
                {detectedItems.map((item) => (
                  <div key={item.name} className="rounded-xl bg-secondary border border-border p-3 text-center">
                    <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs font-mono text-primary mt-1">{item.quantity}</p>
                  </div>
                ))}
              </div>
              <button onClick={reset} className="mt-6 inline-flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-foreground transition-colors relative z-10">
                <RefreshCcw size={13} /> Log another batch
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase mb-3">Your Responses</p>
              <div className="space-y-2">
                {questions.map((q) => (
                  <div key={q.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                    <Check size={12} className="text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{q.question}</p>
                      <p className="text-sm text-foreground font-medium mt-0.5">{q.answered}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "input", label: "Food Input", icon: Camera },
  { id: "simulation", label: "Simulation", icon: FlaskConical },
  { id: "recommendations", label: "Recommendations", icon: Lightbulb },
];

function Sidebar({ page, onNavigate, onClose }: { page: Page; onNavigate: (p: Page) => void; onClose?: () => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#060d07", borderRight: "1px solid rgba(74,222,128,0.08)" }}>
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(74,222,128,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Leaf size={15} className="text-primary-foreground" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary/30 border border-primary animate-ping opacity-60" />
          </div>
          <div>
            <p className="font-display font-black text-foreground text-base leading-none tracking-tight">FoodSense</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono tracking-widest uppercase">Waste Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-mono text-muted-foreground tracking-[0.2em] uppercase px-2 pb-3">Navigation</p>
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = page === id;
          return (
            <button key={id} onClick={() => { onNavigate(id); onClose?.(); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group relative ${active ? "bg-primary/15 text-primary font-medium" : "text-foreground/50 hover:bg-white/5 hover:text-foreground/80"}`}>
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />}
              <Icon size={15} className="flex-shrink-0" />
              {label}
              {id === "input" && (
                <span className="ml-auto text-[10px] font-mono bg-primary/20 text-primary rounded-full px-1.5 py-0.5 leading-none">NEW</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(74,222,128,0.08)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center border border-border">
            <span className="text-[10px] font-mono text-muted-foreground font-bold">GL</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Greenleaf Kitchen</p>
            <p className="text-[10px] text-muted-foreground font-mono">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageMap: Record<Page, React.ReactNode> = {
    dashboard: <DashboardPage />,
    analytics: <AnalyticsPage />,
    simulation: <SimulationPage />,
    recommendations: <RecommendationsPage />,
    input: <FoodInputPage />,
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
        <Sidebar page={page} onNavigate={setPage} />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -224 }} animate={{ x: 0 }} exit={{ x: -224 }} transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-56">
              <Sidebar page={page} onNavigate={setPage} onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-xl hover:bg-secondary transition-colors">
            <Menu size={17} className="text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-primary flex items-center justify-center">
              <Leaf size={9} className="text-primary-foreground" />
            </div>
            <span className="font-display font-black text-sm text-foreground">FoodSense</span>
          </div>
          <span className="ml-auto text-xs font-mono text-muted-foreground capitalize">{page}</span>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: "easeOut" }}>
                {pageMap[page]}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
