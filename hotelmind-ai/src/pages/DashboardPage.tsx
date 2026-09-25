import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BedDouble, ClipboardList, Zap, IndianRupee,
  TrendingUp, TrendingDown, ArrowRight, Brain, Clock,
  Activity, Play, Sparkles,
} from 'lucide-react';
import { agents, revenueMetrics } from '../data/mockData';
import { hotelStateStore } from '../services/hotelStateService';
import HospitalityDemo from '../components/HospitalityDemo';

const statCards = [
  {
    label: 'Occupancy',
    value: '82%',
    icon: BedDouble,
    color: 'text-brand-600 dark:text-brand-400',
    bg: 'bg-brand-50 border-brand-200 dark:bg-brand-900/30 dark:border-brand-800/40',
    trend: '+3% vs yesterday',
    up: true,
  },
  {
    label: 'Active Guests',
    value: '146',
    icon: Users,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800/40',
    trend: '12 checked in today',
    up: true,
  },
  {
    label: 'Open Requests',
    value: '18',
    icon: ClipboardList,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800/40',
    trend: '5 high priority',
    up: false,
  },
  {
    label: 'AI Automations',
    value: '27',
    icon: Zap,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800/40',
    trend: '+8 today',
    up: true,
  },
  {
    label: 'Revenue Opportunity',
    value: '₹1.8L',
    icon: IndianRupee,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800/40',
    trend: 'Weekend demand peak',
    up: true,
  },
];

const agentColorMap: Record<string, { bg: string; border: string; text: string }> = {
  'guest-experience': {
    bg: 'bg-blue-50 dark:bg-blue-900/40',
    border: 'border-blue-200 dark:border-blue-800/50',
    text: 'text-blue-600 dark:text-blue-400',
  },
  'hotel-operations': {
    bg: 'bg-purple-50 dark:bg-purple-900/40',
    border: 'border-purple-200 dark:border-purple-800/50',
    text: 'text-purple-600 dark:text-purple-400',
  },
  'revenue-intelligence': {
    bg: 'bg-emerald-50 dark:bg-emerald-900/40',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
};

const activityTypeStyles: Record<string, string> = {
  request: 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400',
  classification: 'bg-purple-50 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-400',
  routing: 'bg-amber-50 dark:bg-amber-900/40 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400',
  action: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400',
  notification: 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400',
  insight: 'bg-rose-50 dark:bg-rose-900/40 border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400',
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [activityFeed, setActivityFeed] = useState(() => hotelStateStore.getActivities());
  const [deptStats, setDeptStats] = useState(() => hotelStateStore.getDepartmentStats());

  useEffect(() => {
    const unsub = hotelStateStore.subscribe(() => {
      setActivityFeed(hotelStateStore.getActivities());
      setDeptStats(hotelStateStore.getDepartmentStats());
    });
    return unsub;
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Hotel operations overview powered by AI agents</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/guest-portal')}
            className="btn-secondary flex items-center gap-2 text-xs py-2 px-3 border-brand-300 dark:border-brand-700/50 text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-white shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            In-Room Concierge (Guest View)
          </button>
          <button
            onClick={() => setShowDemo(true)}
            className="btn-primary flex items-center gap-2 text-xs py-2 shadow-sm"
          >
            <Play className="w-4 h-4" />
            Run Demo
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} border flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                {stat.up
                  ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  : <TrendingDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                }
              </div>
              <div className={`text-2xl font-bold ${stat.color} mb-0.5`}>{stat.value}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-600 mt-1">{stat.trend}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Agent Status */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">AI Agent Status</h2>
              <p className="section-subtitle mt-0.5">Live status of your intelligent agents</p>
            </div>
            <button
              onClick={() => navigate('/agents')}
              className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 font-medium"
            >
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {agents.map((agent) => {
              const themeStyle = agentColorMap[agent.id] || {
                bg: 'bg-blue-50 dark:bg-blue-900/40',
                border: 'border-blue-200 dark:border-blue-800/50',
                text: 'text-blue-600 dark:text-blue-400',
              };

              return (
                <div
                  key={agent.id}
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer shadow-sm dark:shadow-none"
                  onClick={() => navigate('/agents')}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${themeStyle.bg} border ${themeStyle.border} flex items-center justify-center`}>
                        <Brain className={`w-[18px] h-[18px] ${themeStyle.text}`} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-200">{agent.name}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${themeStyle.text}`}>{agent.successRate}%</div>
                      <div className="text-[10px] text-slate-500">Success Rate</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{agent.description}</p>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/50 text-center">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-300">{agent.tasksProcessed}</div>
                      <div className="text-[10px] text-slate-500">Processed</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-300">{agent.avgResponse || '< 1s'}</div>
                      <div className="text-[10px] text-slate-500">Avg Response</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-300">{agent.capabilities.length}</div>
                      <div className="text-[10px] text-slate-500">Capabilities</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Departments & Revenue Snapshot */}
        <div className="space-y-6">
          {/* Dept Quick View */}
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="section-title">Departments</h2>
                <p className="section-subtitle mt-0.5">Active task distribution</p>
              </div>
              <button
                onClick={() => navigate('/operations')}
                className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 font-medium"
              >
                View <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {deptStats.map((dept) => {
                const total = dept.activeTasks + dept.pendingTasks;
                const pct = total > 0 ? Math.round((dept.activeTasks / total) * 100) : 0;
                return (
                  <div key={dept.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dept.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="badge-amber text-[10px]">{dept.activeTasks} active</span>
                        <span className="text-xs text-slate-500">{dept.completedTasks} done</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Revenue Snapshot */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Revenue Snapshot</h3>
                <button
                  onClick={() => navigate('/revenue')}
                  className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1 font-medium"
                >
                  Details <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 mb-1">Occupancy</div>
                  <div className="text-base font-bold text-brand-600 dark:text-brand-400">{revenueMetrics.occupancy}%</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 mb-1">ADR</div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">₹{revenueMetrics.adr.toLocaleString()}</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 mb-1">Weekend Forecast</div>
                  <div className="text-base font-bold text-amber-600 dark:text-amber-400">{revenueMetrics.weekendForecast}%</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg p-3">
                  <div className="text-[10px] text-slate-500 mb-1">RevPAR</div>
                  <div className="text-base font-bold text-purple-600 dark:text-purple-400">₹{revenueMetrics.revpar.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Activity Feed */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <Activity className="w-[18px] h-[18px] text-brand-600 dark:text-brand-400" />
              Live AI Activity
            </h2>
            <p className="section-subtitle mt-0.5">Real-time agent actions and decisions</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Live</span>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {activityFeed.map((activity, idx) => (
            <div
              key={activity.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${activityTypeStyles[activity.type]} animate-fade-in shadow-xs`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
                <Clock className="w-3 h-3 opacity-70" />
                <span className="text-[10px] font-mono">{activity.time}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold">{activity.agent}</div>
                <div className="text-xs opacity-90 mt-0.5">{activity.action}</div>
                {activity.details && (
                  <div className="text-[10px] opacity-75 mt-0.5 font-mono">{activity.details}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating "Run Hospitality AI Demo" CTA */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowDemo(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-2xl flex items-center gap-2.5 transition-all duration-200 hover:scale-105 glow-blue"
        >
          <Play className="w-4 h-4" />
          Run Hospitality AI Demo
        </button>
      </div>

      {/* Demo Modal */}
      {showDemo && <HospitalityDemo onClose={() => setShowDemo(false)} />}
    </div>
  );
}
