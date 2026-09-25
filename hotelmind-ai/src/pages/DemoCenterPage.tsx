import { useState } from 'react';
import {
  Play, Loader2, CheckCircle2, Users, Settings,
  TrendingUp, ArrowDown, Brain, Bell, RotateCcw,
  Headphones, Wrench, MessageSquare,
} from 'lucide-react';
import { processGuestRequest } from '../services/agentService';
import type { DemoStep } from '../types';

interface DemoScenarioConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  agents: string[];
  trigger: string;
  defaultMessage: string;
  defaultRoom: string;
  color: string;
  icon: React.ElementType;
}

const scenarios: DemoScenarioConfig[] = [
  {
    id: 'maintenance',
    title: 'Guest Maintenance Request',
    subtitle: 'Demo Scenario 1',
    description: 'A guest reports a broken AC. Watch the Guest Experience Agent classify the issue and route it to the Maintenance department.',
    agents: ['Guest Experience Agent', 'Hotel Operations Agent'],
    trigger: 'Guest reports AC issue in room',
    defaultMessage: 'My AC is not working and I need it fixed immediately.',
    defaultRoom: '304',
    color: 'red',
    icon: Wrench,
  },
  {
    id: 'housekeeping',
    title: 'Housekeeping Request',
    subtitle: 'Demo Scenario 2',
    description: 'A guest requests extra towels. The agent chain processes the request and routes it to Housekeeping.',
    agents: ['Guest Experience Agent', 'Hotel Operations Agent', 'Housekeeping'],
    trigger: 'Guest requests additional amenities',
    defaultMessage: 'Can I get some extra towels please? Also need more shampoo.',
    defaultRoom: '218',
    color: 'blue',
    icon: Users,
  },
  {
    id: 'revenue',
    title: 'Revenue Opportunity Detected',
    subtitle: 'Demo Scenario 3',
    description: 'The Revenue Intelligence Agent detects high weekend demand at 94% and recommends pricing adjustments.',
    agents: ['Revenue Intelligence Agent'],
    trigger: 'Weekend occupancy forecast reaches 94%',
    defaultMessage: 'Weekend occupancy forecast 94%',
    defaultRoom: 'N/A',
    color: 'emerald',
    icon: TrendingUp,
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; btn: string }> = {
  red: { bg: 'bg-rose-50 dark:bg-red-900/20', border: 'border-rose-200 dark:border-red-800/30', text: 'text-rose-600 dark:text-red-400', btn: 'bg-rose-600 hover:bg-rose-700 dark:bg-red-700 dark:hover:bg-red-600' },
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800/30', text: 'text-blue-600 dark:text-blue-400', btn: 'bg-brand-600 hover:bg-brand-700 dark:bg-blue-700 dark:hover:bg-blue-600' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800/30', text: 'text-emerald-600 dark:text-emerald-400', btn: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600' },
};

const revenueSteps: DemoStep[] = [
  {
    stepNumber: 1,
    agent: 'Revenue Intelligence Agent',
    title: 'Hotel Data Analysis',
    details: {
      'Occupancy': '82% current | 94% weekend forecast',
      'ADR': '₹6,850',
      'Cancellation Rate': '8%',
      'Data Source': 'Mock hotel performance data',
    },
    delay: 800,
  },
  {
    stepNumber: 2,
    agent: 'Demand Analysis',
    title: 'Demand Signal Detected',
    details: {
      'Demand Level': 'HIGH',
      'Weekend Forecast': '94% occupancy',
      'Confidence': '89%',
      'Pattern': 'Seasonal peak demand',
    },
    delay: 900,
  },
  {
    stepNumber: 3,
    agent: 'Revenue Intelligence Agent',
    title: 'Revenue Recommendation Generated',
    details: {
      'Recommendation 1': 'Increase weekend rates by 12–18%',
      'Recommendation 2': 'Pause promotional discounts',
      'Opportunity': '₹1.8L additional revenue potential',
    },
    delay: 700,
  },
  {
    stepNumber: 4,
    agent: 'Manager Dashboard',
    title: 'Insight Delivered to Management',
    details: {
      'Alert Type': 'Revenue Opportunity',
      'Priority': 'High',
      'Action Required': 'Review pricing before weekend',
      'Status': 'Delivered',
    },
    delay: 600,
  },
];

const stepColorStyles: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800/30', text: 'text-blue-600 dark:text-blue-400' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800/30', text: 'text-purple-600 dark:text-purple-400' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800/30', text: 'text-amber-600 dark:text-amber-400' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800/30', text: 'text-emerald-600 dark:text-emerald-400' },
};

const stepColorKeys = ['blue', 'purple', 'amber', 'emerald'];
const stepIcons: React.ElementType[] = [Headphones, Settings, Brain, Bell];

function ScenarioCard({
  scenario,
  onRun,
  isRunning,
  isDone,
  completedSteps,
  onReset,
}: {
  scenario: DemoScenarioConfig;
  onRun: () => void;
  isRunning: boolean;
  isDone: boolean;
  completedSteps: DemoStep[];
  onReset: () => void;
}) {
  const colors = colorMap[scenario.color];
  const Icon = scenario.icon;

  return (
    <div className="card flex flex-col">
      {/* Header */}
      <div className={`flex items-start gap-3 mb-4 p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
        <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <div className={`text-[10px] font-semibold ${colors.text} uppercase tracking-wider`}>{scenario.subtitle}</div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{scenario.title}</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{scenario.description}</p>
        </div>
      </div>

      {/* Trigger */}
      <div className="mb-4">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Trigger</div>
        <div className="bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span className="text-xs text-slate-700 dark:text-slate-300 italic">"{scenario.defaultMessage}"</span>
          </div>
          {scenario.defaultRoom !== 'N/A' && (
            <div className="text-[10px] text-slate-500 mt-1 ml-5">Room {scenario.defaultRoom}</div>
          )}
        </div>
      </div>

      {/* Agents Involved */}
      <div className="mb-4">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Agents</div>
        <div className="flex flex-wrap gap-1.5">
          {scenario.agents.map((a) => (
            <span key={a} className="badge-blue text-[10px]">{a}</span>
          ))}
        </div>
      </div>

      {/* Run Button */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex-1 ${colors.btn} disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Demo
            </>
          )}
        </button>
        {(completedSteps.length > 0 || isDone) && (
          <button onClick={onReset} className="btn-secondary flex items-center gap-1.5 px-3">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Steps Output */}
      {completedSteps.length > 0 && (
        <div className="flex-1 space-y-2 max-h-64 overflow-y-auto">
          {completedSteps.map((step, idx) => {
            const SIcon = stepIcons[idx % stepIcons.length];
            const colorKey = stepColorKeys[idx % stepColorKeys.length];
            const style = stepColorStyles[colorKey];
            return (
              <div
                key={step.stepNumber}
                className={`${style.bg} border ${style.border} rounded-xl p-3 animate-fade-in`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <SIcon className={`w-3.5 h-3.5 ${style.text}`} />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Step {step.stepNumber} — {step.agent}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 ml-auto" />
                </div>
                <div className={`text-xs font-semibold ${style.text} mb-1.5`}>{step.title}</div>
                <div className="space-y-1">
                  {Object.entries(step.details).slice(0, 3).map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-[10px]">
                      <span className="text-slate-500 w-20 flex-shrink-0 uppercase font-semibold">{k}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {isRunning && (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3">
              <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
              <span className="text-xs text-slate-600 dark:text-slate-400">Processing...</span>
            </div>
          )}

          {isDone && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-3 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Demo Complete</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DemoCenterPage() {
  const [runningId, setRunningId] = useState<string | null>(null);
  const [completedStepsMap, setCompletedStepsMap] = useState<Record<string, DemoStep[]>>({});
  const [doneMap, setDoneMap] = useState<Record<string, boolean>>({});

  async function runScenario(scenario: DemoScenarioConfig) {
    if (runningId) return;
    setRunningId(scenario.id);
    setCompletedStepsMap((prev) => ({ ...prev, [scenario.id]: [] }));
    setDoneMap((prev) => ({ ...prev, [scenario.id]: false }));

    if (scenario.id === 'revenue') {
      for (const step of revenueSteps) {
        await new Promise((r) => setTimeout(r, step.delay));
        setCompletedStepsMap((prev) => ({
          ...prev,
          [scenario.id]: [...(prev[scenario.id] || []), step],
        }));
      }
    } else {
      await processGuestRequest(
        scenario.defaultMessage,
        scenario.defaultRoom,
        (step) => {
          setCompletedStepsMap((prev) => ({
            ...prev,
            [scenario.id]: [...(prev[scenario.id] || []), step],
          }));
        }
      );
    }

    setDoneMap((prev) => ({ ...prev, [scenario.id]: true }));
    setRunningId(null);
  }

  function resetScenario(id: string) {
    setCompletedStepsMap((prev) => ({ ...prev, [id]: [] }));
    setDoneMap((prev) => ({ ...prev, [id]: false }));
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Demo Center</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Explore how HotelMind AI coordinates specialized agents to automate hotel workflows.
        </p>
      </div>

      {/* Demo Intro */}
      <div className="bg-gradient-to-r from-brand-50 to-white dark:from-brand-900/30 dark:to-slate-900 border border-brand-200 dark:border-brand-800/30 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-brand-500/10 dark:bg-brand-600/20 border border-brand-500/20 dark:border-brand-600/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Multi-Agent Orchestration Demo</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Each scenario below demonstrates how multiple AI agents communicate and collaborate to handle
              real hotel management challenges. Click "Run Demo" on any scenario to see the agent workflow in action.
            </p>
          </div>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onRun={() => runScenario(scenario)}
            isRunning={runningId === scenario.id}
            isDone={!!doneMap[scenario.id]}
            completedSteps={completedStepsMap[scenario.id] || []}
            onReset={() => resetScenario(scenario.id)}
          />
        ))}
      </div>

      {/* Agent Communication Flow Diagram */}
      <div className="card">
        <h2 className="section-title mb-5">Agent Communication Architecture</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-6">
          {[
            { label: 'Guest Request', icon: MessageSquare, bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800/40', text: 'text-blue-600 dark:text-blue-400', desc: 'Entry Point' },
            { label: 'Guest Experience\nAgent', icon: Headphones, bg: 'bg-purple-50 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800/40', text: 'text-purple-600 dark:text-purple-400', desc: 'Intent & Priority' },
            { label: 'Hotel Operations\nAgent', icon: Settings, bg: 'bg-amber-50 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800/40', text: 'text-amber-600 dark:text-amber-400', desc: 'Routing & Tasks' },
            { label: 'Department', icon: Wrench, bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800/40', text: 'text-emerald-600 dark:text-emerald-400', desc: 'Execution' },
            { label: 'Guest\nNotified', icon: Bell, bg: 'bg-slate-100 dark:bg-slate-800/60', border: 'border-slate-300 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300', desc: 'Outcome' },
          ].map((node, idx) => {
            const Icon = node.icon;
            return (
              <div key={node.label} className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-xl ${node.bg} border ${node.border} flex items-center justify-center mb-2`}>
                    <Icon className={`w-5 h-5 ${node.text}`} />
                  </div>
                  <div className="text-[10px] font-semibold text-slate-800 dark:text-slate-300 text-center whitespace-pre-line leading-tight">{node.label}</div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">{node.desc}</div>
                </div>
                {idx < 4 && (
                  <div className="hidden md:flex items-center">
                    <div className="w-8 h-0.5 bg-slate-300 dark:bg-slate-700" />
                    <div className="w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-slate-400 dark:border-l-slate-600" />
                  </div>
                )}
                {idx < 4 && (
                  <div className="flex md:hidden flex-col items-center">
                    <ArrowDown className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">Revenue Intelligence (Parallel)</div>
            <div className="flex items-center gap-3">
              {[
                { label: 'Hotel Data', icon: Brain },
                { label: 'Revenue Agent', icon: TrendingUp },
                { label: 'Manager Insight', icon: Bell },
              ].map((n, i) => {
                const Icon = n.icon;
                return (
                  <div key={n.label} className="flex items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 text-center">{n.label}</div>
                    </div>
                    {i < 2 && <div className="w-4 h-0.5 bg-emerald-200 dark:bg-emerald-900" />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg px-4 py-3">
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Both workflows run independently and can communicate when needed.
                The Revenue Intelligence Agent provides strategic insights while the
                Guest Experience + Operations pipeline handles real-time requests.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
