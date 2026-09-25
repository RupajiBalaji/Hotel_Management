import { useState, useRef } from 'react';
import {
  Send, Brain, Headphones, Settings, CheckCircle2,
  Loader2, Bell, RotateCcw, Zap,
} from 'lucide-react';
import { guestRequests } from '../data/mockData';
import { processGuestRequest } from '../services/agentService';
import type { DemoStep } from '../types';

const exampleRequests = [
  'The AC in my room is not working and it is very hot.',
  'Can I get extra towels and pillows in room 304?',
  'I would like to order room service: club sandwich and coffee.',
  'Could I get a late checkout tomorrow until 2 PM?',
  'Please arrange a cab to the airport tomorrow at 6 AM.',
  'The shower in bathroom is leaking water continuously.',
];

const priorityColors: Record<string, string> = {
  critical: 'text-red-600 dark:text-red-400 font-semibold',
  high: 'text-red-600 dark:text-red-400 font-medium',
  medium: 'text-amber-600 dark:text-amber-400',
  low: 'text-slate-600 dark:text-slate-400',
};

const stepAgentIcons: Record<number, React.ElementType> = {
  0: Headphones,
  1: Settings,
  2: Zap,
  3: Bell,
};

const stepThemeColors = [
  {
    box: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800/50 text-blue-600 dark:text-blue-400',
    title: 'text-blue-700 dark:text-blue-400',
  },
  {
    box: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/30',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-800/50 text-purple-600 dark:text-purple-400',
    title: 'text-purple-700 dark:text-purple-400',
  },
  {
    box: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30',
    iconBg: 'bg-amber-100 dark:bg-amber-900/50 border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400',
    title: 'text-amber-700 dark:text-amber-400',
  },
  {
    box: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400',
    title: 'text-emerald-700 dark:text-emerald-400',
  },
];

const intentColors: Record<string, string> = {
  maintenance: 'badge-red',
  housekeeping: 'badge-blue',
  room_service: 'badge-amber',
  late_checkout: 'badge-green',
  cab_booking: 'badge-blue',
  concierge: 'badge-slate',
  complaint: 'badge-red',
  general: 'badge-slate',
};

export default function GuestRequestsPage() {
  const [inputMessage, setInputMessage] = useState('The AC in my room is not working and it is very hot.');
  const [roomNumber, setRoomNumber] = useState('304');
  const [running, setRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<DemoStep[]>([]);
  const [done, setDone] = useState(false);
  const stepsRef = useRef<HTMLDivElement>(null);

  async function runAgentDemo() {
    if (!inputMessage.trim() || running) return;

    setRunning(true);
    setCompletedSteps([]);
    setDone(false);

    await processGuestRequest(inputMessage, roomNumber, (step) => {
      setCompletedSteps((prev) => [...prev, step]);
      setTimeout(() => {
        stepsRef.current?.scrollTo({ top: stepsRef.current.scrollHeight, behavior: 'smooth' });
      }, 50);
    });

    setDone(true);
    setRunning(false);
  }

  function reset() {
    setCompletedSteps([]);
    setDone(false);
    setRunning(false);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Guest Requests</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Submit guest messages and watch multi-agent coordination unfold in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input + Examples */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="section-title mb-4 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Guest Request Demo
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Room Number</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-500 transition-colors shadow-xs"
                  placeholder="304"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Guest Message</label>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Enter a guest request..."
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none shadow-xs"
                />
              </div>

              {/* Example Requests */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">Quick Examples</label>
                <div className="flex flex-wrap gap-2">
                  {exampleRequests.map((req) => (
                    <button
                      key={req}
                      onClick={() => setInputMessage(req)}
                      className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 px-2.5 py-1.5 rounded-lg transition-colors shadow-xs"
                    >
                      {req.length > 30 ? req.slice(0, 28) + '…' : req}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={runAgentDemo}
                  disabled={running || !inputMessage.trim()}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {running ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Run AI Agent
                    </>
                  )}
                </button>
                {(completedSteps.length > 0 || done) && (
                  <button onClick={reset} className="btn-secondary flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Recent Requests Table */}
          <div className="card">
            <h2 className="section-title mb-4">Recent Requests</h2>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {guestRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-3 hover:border-slate-300 dark:hover:border-slate-600 cursor-pointer transition-colors shadow-xs"
                  onClick={() => { setInputMessage(req.message); setRoomNumber(req.roomNumber); }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-300">Room {req.roomNumber} — {req.guestName}</span>
                    <span className={`badge ${intentColors[req.intent] || 'badge-slate'} text-[10px]`}>
                      {req.intent.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{req.message}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className={`text-[10px] ${priorityColors[req.priority]}`}>
                      {req.priority.charAt(0).toUpperCase() + req.priority.slice(1)} Priority
                    </span>
                    <span className="text-[10px] text-slate-500">{req.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Processing Panel */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              Agent Processing
            </h2>
            {running && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-pulse" />
                <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">Processing</span>
              </div>
            )}
          </div>

          {completedSteps.length === 0 && !running && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700">
                <Brain className="w-8 h-8 text-slate-400 dark:text-slate-600" />
              </div>
              <div className="text-slate-600 dark:text-slate-500 text-sm">Enter a guest request and click</div>
              <div className="text-slate-700 dark:text-slate-400 text-sm font-medium">"Run AI Agent" to see the demo</div>
            </div>
          )}

          <div ref={stepsRef} className="flex-1 space-y-3 overflow-y-auto">
            {completedSteps.map((step, idx) => {
              const Icon = stepAgentIcons[idx] || Brain;
              const theme = stepThemeColors[idx] || stepThemeColors[0];

              return (
                <div
                  key={step.stepNumber}
                  className={`${theme.box} rounded-xl p-4 animate-fade-in shadow-xs`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-7 h-7 rounded-lg ${theme.iconBg} flex items-center justify-center`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        STEP {step.stepNumber} — {step.agent.toUpperCase()}
                      </div>
                      <div className={`text-xs font-medium ${theme.title}`}>
                        {step.title}
                      </div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 ml-auto" />
                  </div>

                  <div className="space-y-1.5 ml-9">
                    {Object.entries(step.details).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2">
                        <span className="text-[10px] font-semibold text-slate-500 w-24 flex-shrink-0 pt-0.5 uppercase tracking-wide">
                          {key}
                        </span>
                        <span className="text-xs text-slate-700 dark:text-slate-300 flex-1">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Running Indicator */}
            {running && (
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 animate-pulse shadow-xs">
                <Loader2 className="w-5 h-5 text-brand-600 dark:text-brand-400 animate-spin" />
                <div className="text-sm text-slate-600 dark:text-slate-400">Agent processing...</div>
              </div>
            )}

            {/* Completion Message */}
            {done && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-4 animate-fade-in shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Workflow Completed</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  All agents have successfully processed the guest request. The guest has been notified.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
