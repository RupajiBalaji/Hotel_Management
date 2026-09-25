import { useState } from 'react';
import {
  Play, X, Loader2, CheckCircle2, Headphones,
  Settings, Wrench, Bell, User, ArrowDown,
} from 'lucide-react';
import { processGuestRequest } from '../services/agentService';
import type { DemoStep } from '../types';

const DEMO_MESSAGE = 'My AC is not working and I need it fixed immediately.';
const DEMO_ROOM = '304';

const flowNodes = [
  { label: 'Guest (Room 304)', icon: User, color: 'blue', desc: '"AC is not working. Need it fixed immediately."' },
  { label: 'Guest Experience Agent', icon: Headphones, color: 'purple', desc: 'Classifying intent & detecting priority...' },
  { label: 'Intent Detection', icon: Settings, color: 'amber', desc: 'Maintenance Request | Confidence: 96% | Priority: High' },
  { label: 'Hotel Operations Agent', icon: Settings, color: 'purple', desc: 'Routing to Maintenance department...' },
  { label: 'Maintenance Department', icon: Wrench, color: 'red', desc: 'Task received: Inspect AC in Room 304' },
  { label: 'Task Completed', icon: CheckCircle2, color: 'emerald', desc: 'AC issue resolved' },
  { label: 'Guest Notified', icon: Bell, color: 'emerald', desc: '"Your request has been resolved. Team attended successfully."' },
];

const stepColors = ['blue', 'purple', 'amber', 'purple', 'red', 'emerald', 'emerald'];

const stepColorStyles: Record<string, {
  active: string;
  past: string;
  upcoming: string;
  text: string;
  connector: string;
  arrow: string;
}> = {
  blue: {
    active: 'bg-blue-50 dark:bg-blue-900/40 border-blue-500 scale-105 shadow-md',
    past: 'bg-blue-50/60 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50',
    upcoming: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 opacity-40',
    text: 'text-blue-600 dark:text-blue-400',
    connector: 'bg-blue-400 dark:bg-blue-700',
    arrow: 'text-blue-500 dark:text-blue-600',
  },
  purple: {
    active: 'bg-purple-50 dark:bg-purple-900/40 border-purple-500 scale-105 shadow-md',
    past: 'bg-purple-50/60 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/50',
    upcoming: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 opacity-40',
    text: 'text-purple-600 dark:text-purple-400',
    connector: 'bg-purple-400 dark:bg-purple-700',
    arrow: 'text-purple-500 dark:text-purple-600',
  },
  amber: {
    active: 'bg-amber-50 dark:bg-amber-900/40 border-amber-500 scale-105 shadow-md',
    past: 'bg-amber-50/60 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50',
    upcoming: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 opacity-40',
    text: 'text-amber-600 dark:text-amber-400',
    connector: 'bg-amber-400 dark:bg-amber-700',
    arrow: 'text-amber-500 dark:text-amber-600',
  },
  red: {
    active: 'bg-rose-50 dark:bg-red-900/40 border-rose-500 scale-105 shadow-md',
    past: 'bg-rose-50/60 dark:bg-red-900/20 border-rose-200 dark:border-red-800/50',
    upcoming: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 opacity-40',
    text: 'text-rose-600 dark:text-rose-400',
    connector: 'bg-rose-400 dark:bg-rose-700',
    arrow: 'text-rose-500 dark:text-rose-600',
  },
  emerald: {
    active: 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-500 scale-105 shadow-md',
    past: 'bg-emerald-50/60 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50',
    upcoming: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 opacity-40',
    text: 'text-emerald-600 dark:text-emerald-400',
    connector: 'bg-emerald-400 dark:bg-emerald-700',
    arrow: 'text-emerald-500 dark:text-emerald-600',
  },
};

export default function HospitalityDemo({ onClose }: { onClose: () => void }) {
  const [activeNodeIdx, setActiveNodeIdx] = useState(-1);
  const [completedSteps, setCompletedSteps] = useState<DemoStep[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  async function runDemo() {
    setRunning(true);
    setStarted(true);
    setActiveNodeIdx(0);

    // Animate flow nodes with delays
    for (let i = 0; i < flowNodes.length; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      setActiveNodeIdx(i);
    }

    // Also run the agent steps
    await processGuestRequest(DEMO_MESSAGE, DEMO_ROOM, (step) => {
      setCompletedSteps((prev) => [...prev, step]);
    });

    setDone(true);
    setRunning(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">Hospitality AI Demo</div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Run Hospitality AI Demo</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Watch how AI agents handle a guest maintenance request end-to-end.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Scenario */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 mb-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Scenario</div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800/50 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Guest in Room 304</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 italic mt-0.5">"{DEMO_MESSAGE}"</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Flow Visualization */}
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Agent Flow</div>
              <div className="flex flex-col items-center gap-1">
                {flowNodes.map((node, idx) => {
                  const Icon = node.icon;
                  const colorKey = stepColors[idx];
                  const style = stepColorStyles[colorKey] || stepColorStyles.blue;
                  const isActive = idx === activeNodeIdx;
                  const isPast = idx < activeNodeIdx || done;
                  const isUpcoming = idx > activeNodeIdx && !done;

                  return (
                    <div key={node.label} className="w-full flex flex-col items-center">
                      <div
                        className={`
                          w-full max-w-xs rounded-xl border-2 p-3 transition-all duration-500
                          ${isActive ? style.active : ''}
                          ${isPast ? style.past : ''}
                          ${isUpcoming ? style.upcoming : ''}
                          ${!started ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50' : ''}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isPast || isActive ? style.text : 'text-slate-400 dark:text-slate-600'}`} />
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-semibold ${isPast || isActive ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'}`}>
                              {node.label}
                            </div>
                            {(isActive || (isPast && idx <= activeNodeIdx)) && (
                              <div className={`text-[10px] ${style.text} mt-0.5 animate-fade-in`}>{node.desc}</div>
                            )}
                          </div>
                          {(isPast && idx < activeNodeIdx) && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                          )}
                          {isActive && running && (
                            <Loader2 className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-spin flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      {idx < flowNodes.length - 1 && (
                        <div className="flex flex-col items-center my-1">
                          <div className={`w-0.5 h-3 ${isPast ? style.connector : 'bg-slate-300 dark:bg-slate-700'} transition-colors duration-500`} />
                          <ArrowDown className={`w-3 h-3 ${isPast ? style.arrow : 'text-slate-300 dark:text-slate-700'} transition-colors duration-500`} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step Details */}
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Agent Decisions</div>

              {!started && (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-3">
                    <Play className="w-7 h-7 text-slate-400 dark:text-slate-600" />
                  </div>
                  <div className="text-slate-500 text-sm">Click "Run Demo" to begin the<br />AI agent demonstration</div>
                </div>
              )}

              <div className="space-y-3">
                {completedSteps.map((step, idx) => {
                  const colorKey = ['blue', 'purple', 'amber', 'emerald'][idx % 4];
                  const style = stepColorStyles[colorKey];
                  return (
                    <div key={step.stepNumber} className={`${style.past} rounded-xl p-4 animate-fade-in border`}>
                      <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
                        Step {step.stepNumber} — {step.agent}
                      </div>
                      <div className={`text-xs font-semibold ${style.text} mb-2`}>{step.title}</div>
                      {Object.entries(step.details).map(([k, v]) => (
                        <div key={k} className="flex gap-2 text-[10px] mb-0.5">
                          <span className="text-slate-500 uppercase font-semibold w-20 flex-shrink-0">{k}</span>
                          <span className="text-slate-700 dark:text-slate-300 flex-1">{v.length > 60 ? v.slice(0, 58) + '…' : v}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}

                {running && (
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 animate-pulse">
                    <Loader2 className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-spin" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">Agent processing request...</span>
                  </div>
                )}
              </div>

              {/* Completion Summary */}
              {done && (
                <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-4 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">Workflow Completed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Request', value: 'AC Maintenance' },
                      { label: 'Room', value: '304' },
                      { label: 'Department', value: 'Maintenance' },
                      { label: 'Priority', value: 'High' },
                      { label: 'ETA', value: '15 minutes' },
                      { label: 'Guest Notified', value: 'Yes' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white dark:bg-slate-900/50 border border-emerald-100 dark:border-transparent rounded-lg px-3 py-2 shadow-sm">
                        <div className="text-[10px] text-slate-500 uppercase font-semibold">{label}</div>
                        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
            {!started && (
              <button
                onClick={runDemo}
                className="btn-primary flex items-center gap-2 px-8 py-3 text-base shadow-sm"
              >
                <Play className="w-5 h-5" />
                Run Hospitality AI Demo
              </button>
            )}
            {done && (
              <button
                onClick={() => { setActiveNodeIdx(-1); setCompletedSteps([]); setDone(false); setStarted(false); }}
                className="btn-secondary flex items-center gap-2"
              >
                Run Again
              </button>
            )}
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
