import { useState } from 'react';
import {
  TrendingUp, TrendingDown, BarChart3, Zap,
  AlertTriangle, CheckCircle2, RefreshCw, Info,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { revenueMetrics, occupancyData } from '../data/mockData';
import { generateRevenueInsight } from '../services/agentService';

const insight = generateRevenueInsight(
  revenueMetrics.occupancy,
  revenueMetrics.weekendForecast,
  revenueMetrics.cancellationRate,
  revenueMetrics.adr
);

const metricCards = [
  { label: 'Occupancy', value: `${revenueMetrics.occupancy}%`, trend: '+3%', up: true, color: 'text-brand-400' },
  { label: 'ADR', value: `₹${revenueMetrics.adr.toLocaleString()}`, trend: '₹6,500 yesterday', up: true, color: 'text-emerald-400' },
  { label: 'RevPAR', value: `₹${revenueMetrics.revpar.toLocaleString()}`, trend: 'Calculated metric', up: true, color: 'text-purple-400' },
  { label: 'Weekend Forecast', value: `${revenueMetrics.weekendForecast}%`, trend: 'High demand', up: true, color: 'text-amber-400' },
  { label: "Today's Bookings", value: `${revenueMetrics.todayBookings}`, trend: '+12 vs avg', up: true, color: 'text-blue-400' },
  { label: 'Cancellation Rate', value: `${revenueMetrics.cancellationRate}%`, trend: 'Within normal range', up: false, color: 'text-rose-400' },
];

const demandColors: Record<string, string> = {
  'LOW': 'text-blue-400',
  'MEDIUM': 'text-amber-400',
  'HIGH': 'text-orange-400',
  'VERY HIGH': 'text-red-400',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs shadow-lg">
        <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.name} style={{ color: p.color }}>
            {p.name === 'occupancy' ? `Occupancy: ${p.value}%` : `Revenue: ₹${(p.value / 1000).toFixed(0)}K`}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function RevenuePage() {
  const [refreshing, setRefreshing] = useState(false);

  async function handleRefresh() {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRefreshing(false);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Revenue Intelligence</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            AI-powered demand analysis and revenue recommendations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg px-3 py-2">
            <Info className="w-3.5 h-3.5" />
            Demo Data
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((m) => (
          <div key={m.label} className="stat-card">
            <div className={`text-xl font-bold ${m.color} mb-0.5`}>{m.value}</div>
            <div className="text-xs text-slate-400 font-medium mb-1">{m.label}</div>
            <div className="flex items-center gap-1">
              {m.up
                ? <TrendingUp className="w-3 h-3 text-emerald-400" />
                : <TrendingDown className="w-3 h-3 text-amber-400" />}
              <span className="text-[10px] text-slate-500">{m.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insight Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Insight Header */}
          <div className="bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/40 dark:to-slate-900 border border-brand-200 dark:border-brand-800/50 shadow-sm rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-brand-500/10 dark:bg-brand-600/20 border border-brand-500/20 dark:border-brand-600/30 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">AI Revenue Insight</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Revenue Intelligence Agent</div>
              </div>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{insight.headline}</p>
          </div>

          {/* Signal Gauges */}
          <div className="card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Demand Level</div>
                <div className={`text-lg font-bold ${demandColors[insight.demandLevel]}`}>
                  {insight.demandLevel}
                </div>
              </div>
              <AlertTriangle className={`w-6 h-6 ${demandColors[insight.demandLevel]}`} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Pricing Opportunity</div>
                <div className={`text-lg font-bold ${insight.pricingOpportunity ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'}`}>
                  {insight.pricingOpportunity ? 'DETECTED' : 'NOT DETECTED'}
                </div>
              </div>
              {insight.pricingOpportunity
                ? <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                : <CheckCircle2 className="w-6 h-6 text-slate-400 dark:text-slate-600" />}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Forecast Confidence</div>
                <div className="text-lg font-bold text-brand-600 dark:text-brand-400">{insight.forecastConfidence}%</div>
              </div>
              <BarChart3 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>

            {/* Confidence Bar */}
            <div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-1000"
                  style={{ width: `${insight.forecastConfidence}%` }}
                />
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-brand-600 dark:text-brand-400" />
              AI Recommendations
            </div>
            <div className="space-y-2.5">
              {insight.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 bg-brand-50/70 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/20 rounded-lg p-3"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900 border border-brand-300 dark:border-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-brand-600 dark:text-brand-400">{idx + 1}</span>
                  </div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Occupancy Trend */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="section-title">Weekly Occupancy Trend</h2>
                <p className="section-subtitle mt-0.5">7-day occupancy percentage</p>
              </div>
              <div className="badge-blue">Demo Data</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={occupancyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d94e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d94e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="occupancy"
                  stroke="#0d94e9"
                  strokeWidth={2.5}
                  fill="url(#occGrad)"
                  dot={{ fill: '#0d94e9', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="section-title">Daily Revenue Estimate</h2>
                <p className="section-subtitle mt-0.5">Based on mock occupancy × ADR</p>
              </div>
              <div className="badge-slate">₹ INR</div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={occupancyData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {occupancyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.occupancy >= 90 ? '#10b981' : entry.occupancy >= 80 ? '#0d94e9' : '#6470f7'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-[10px] text-slate-500">≥90% Occ.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-brand-500" />
                <span className="text-[10px] text-slate-500">80–90% Occ.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-purple-500" />
                <span className="text-[10px] text-slate-500">&lt;80% Occ.</span>
              </div>
            </div>
          </div>

          {/* Insight Detail */}
          <div className="bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-400 mb-1">About This Insight</div>
                <p className="text-xs text-slate-600 dark:text-slate-500 leading-relaxed">{insight.detail}</p>
                <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-600">
                  ⚠️ This insight is generated from demo mock data. Not connected to live hotel systems.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
