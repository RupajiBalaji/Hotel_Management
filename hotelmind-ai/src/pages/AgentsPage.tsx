import { useState } from 'react';
import {
  Brain, Headphones, Settings, TrendingUp, CheckCircle2,
  ArrowRight, X, Zap, Shield, Clock,
} from 'lucide-react';
import { agents } from '../data/mockData';
import type { Agent } from '../types';

const agentIcons: Record<string, React.ElementType> = {
  'guest-experience': Headphones,
  'hotel-operations': Settings,
  'revenue-intelligence': TrendingUp,
};

const agentColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  'guest-experience': {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800/50',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50',
  },
  'hotel-operations': {
    bg: 'bg-purple-50 dark:bg-purple-900/30',
    border: 'border-purple-200 dark:border-purple-800/50',
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50',
  },
  'revenue-intelligence': {
    bg: 'bg-emerald-50 dark:bg-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    text: 'text-emerald-600 dark:text-emerald-400',
    badge: 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50',
  },
};

const agentDetails: Record<string, {
  input: string[];
  processing: string[];
  output: string[];
  connectedAgent?: string;
  tools: string[];
  recentActivity: string[];
}> = {
  'guest-experience': {
    input: ['Guest text message', 'Room number', 'Timestamp', 'Guest profile (future)'],
    processing: ['Intent classification', 'Context analysis', 'Priority detection', 'Sentiment analysis'],
    output: ['Classified intent', 'Priority score', 'Structured request', 'Operational handoff'],
    connectedAgent: 'Hotel Operations Agent',
    tools: ['NLP Intent Classifier', 'Priority Engine', 'Notification System', 'Guest Profile (future)'],
    recentActivity: [
      'Room 201 — Cab booking request processed',
      'Room 304 — AC repair request classified & routed',
      'Room 218 — Extra towels request handled',
      'Room 319 — Late checkout approved',
      'Room 506 — Room service order routed',
    ],
  },
  'hotel-operations': {
    input: ['Classified request from Guest Experience Agent', 'Department capacity data', 'Staff availability'],
    processing: ['Department routing logic', 'Priority-based scheduling', 'Staff assignment', 'ETA calculation'],
    output: ['Task assignment', 'Department notification', 'Task tracking record', 'Status updates'],
    connectedAgent: 'Guest Experience Agent',
    tools: ['Department Router', 'Task Manager', 'Staff Scheduler (future)', 'PMS Integration (future)'],
    recentActivity: [
      'Maintenance Team A — AC repair task assigned (Room 304)',
      'Housekeeping Team B — Extra towels task completed (Room 218)',
      'Concierge — Cab booking task created (Room 201)',
      'Room Service — Breakfast order in progress (Room 506)',
      'Housekeeping Team C — Room cleaning queued (Room 412)',
    ],
  },
  'revenue-intelligence': {
    input: ['Occupancy data', 'Historical booking trends', 'Seasonal patterns', 'Pricing data'],
    processing: ['Demand forecasting', 'Occupancy trend analysis', 'Revenue opportunity detection', 'Pricing recommendation'],
    output: ['Revenue insights', 'Pricing recommendations', 'Demand alerts', 'Manager dashboard updates'],
    connectedAgent: 'Hotel Operations Agent',
    tools: ['Demand Forecaster', 'Pricing Engine', 'Occupancy Analyzer', 'Revenue Alert System'],
    recentActivity: [
      'Weekend occupancy forecast: 94% — Pricing opportunity detected',
      'ADR below optimal for weekend — Recommendation generated',
      'Cancellation rate within normal range — No action needed',
      'High-demand alert issued for Saturday night',
      'RevPAR improvement insight shared with manager',
    ],
  },
};

function AgentDetailPanel({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const colors = agentColors[agent.id];
  const details = agentDetails[agent.id];
  const Icon = agentIcons[agent.id] || Brain;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${colors.text}`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{agent.name}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">{agent.description}</p>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 text-center">
              <div className={`text-xl font-bold ${colors.text}`}>{agent.tasksProcessed}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Tasks</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 text-center">
              <div className={`text-xl font-bold ${colors.text}`}>{agent.successRate}%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Success</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3 text-center">
              <div className={`text-xl font-bold ${colors.text}`}>{agent.avgResponse}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Avg Resp.</div>
            </div>
          </div>

          {/* IO Flow */}
          <div className="space-y-3">
            <div className={`bg-blue-50/40 dark:bg-slate-800/50 border border-blue-200 dark:border-blue-800/40 rounded-xl p-4`}>
              <div className={`text-xs font-semibold ${colors.text} uppercase tracking-wider mb-2`}>Input</div>
              {details.input.map((i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 mb-1">
                  <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                  {i}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center">
              <div style={{ width: '1px', height: '24px', background: 'linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)' }} />
            </div>

            <div className="bg-purple-50/40 dark:bg-slate-800/50 border border-purple-200 dark:border-purple-800/40 rounded-xl p-4">
              <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Zap className="w-3 h-3" />
                Processing
              </div>
              {details.processing.map((p) => (
                <div key={p} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 mb-1">
                  <div className="w-1 h-1 rounded-full bg-purple-500/50" />
                  {p}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center">
              <div style={{ width: '1px', height: '24px', background: 'linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)' }} />
            </div>

            <div className="bg-emerald-50/40 dark:bg-slate-800/50 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4">
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">Output</div>
              {details.output.map((o) => (
                <div key={o} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 mb-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  {o}
                </div>
              ))}
            </div>
          </div>

          {/* Connected Agent */}
          {details.connectedAgent && (
            <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800/30 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
                <ArrowRight className="w-3 h-3" />
                Connected Agent
              </div>
              <div className="text-sm text-slate-800 dark:text-slate-300 font-medium">{details.connectedAgent}</div>
            </div>
          )}

          {/* Capabilities */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Capabilities</div>
            <div className="flex flex-wrap gap-2">
              {agent.capabilities.map((cap) => (
                <span key={cap} className={`badge ${colors.badge} text-xs`}>{cap}</span>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tools & Integrations</div>
            <div className="space-y-1.5">
              {details.tools.map((tool) => (
                <div key={tool} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2">
                  <Shield className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">{tool}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Recent Activity</div>
            <div className="space-y-2">
              {details.recentActivity.map((act, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <Clock className="w-3 h-3 text-slate-400 dark:text-slate-600 mt-0.5 flex-shrink-0" />
                  {act}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const stepStyles = [
  {
    step: '01',
    agent: 'Guest Experience Agent',
    desc: 'Receives and classifies the guest request, detecting intent and priority.',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800/30',
    num: 'text-blue-200 dark:text-blue-900',
    title: 'text-blue-600 dark:text-blue-400',
  },
  {
    step: '02',
    agent: 'Hotel Operations Agent',
    desc: 'Routes the classified task to the appropriate department and assigns staff.',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800/30',
    num: 'text-purple-200 dark:text-purple-900',
    title: 'text-purple-600 dark:text-purple-400',
  },
  {
    step: '03',
    agent: 'Revenue Intelligence Agent',
    desc: 'Continuously monitors hotel performance and surfaces revenue opportunities.',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800/30',
    num: 'text-emerald-200 dark:text-emerald-900',
    title: 'text-emerald-600 dark:text-emerald-400',
  },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Agents</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Three specialized agents working in orchestration to automate hotel operations.
        </p>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const colors = agentColors[agent.id];
          const Icon = agentIcons[agent.id] || Brain;

          return (
            <div
              key={agent.id}
              className="card hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/40 rounded-full px-2.5 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
                </div>
              </div>

              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{agent.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">{agent.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-lg p-2.5">
                  <div className={`text-lg font-bold ${colors.text}`}>{agent.tasksProcessed}</div>
                  <div className="text-[10px] text-slate-500">Tasks Processed</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-lg p-2.5">
                  <div className={`text-lg font-bold ${colors.text}`}>{agent.successRate}%</div>
                  <div className="text-[10px] text-slate-500">Success Rate</div>
                </div>
              </div>

              {/* Capabilities */}
              <div className="mb-5">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Capabilities</div>
                <div className="flex flex-wrap gap-1.5">
                  {agent.capabilities.map((cap) => (
                    <span key={cap} className={`badge ${colors.badge} text-[10px]`}>{cap}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedAgent(agent)}
                className={`w-full border ${colors.border} ${colors.bg} ${colors.text} hover:opacity-80 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2`}
              >
                View Agent <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* How Agents Work Together */}
      <div className="card">
        <h2 className="section-title mb-4">How Agents Work Together</h2>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stepStyles.map((item, idx) => (
              <div key={item.step} className="relative">
                <div className={`${item.bg} border ${item.border} rounded-xl p-4`}>
                  <div className={`text-3xl font-black ${item.num} mb-2`}>{item.step}</div>
                  <div className={`text-sm font-semibold ${item.title} mb-2`}>{item.agent}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">{item.desc}</div>
                </div>
                {idx < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 z-10 items-center justify-center w-5 h-5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full shadow-sm">
                    <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Detail Panel */}
      {selectedAgent && (
        <AgentDetailPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}
