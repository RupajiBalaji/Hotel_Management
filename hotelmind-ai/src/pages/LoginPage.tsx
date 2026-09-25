import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Hotel, Brain, Shield, ChevronRight, Sun, Moon } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 500));

    const success = login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex transition-colors">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-slate-900 to-slate-950 border-r border-slate-800 p-12 text-white">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">HotelMind</span>
            <span className="text-xl font-bold text-brand-400 tracking-tight"> AI</span>
          </div>
        </div>

        {/* Hero Text */}
        <div>
          <div className="mb-6">
            <span className="text-xs font-semibold tracking-widest text-brand-400 uppercase">Hospitality AI Platform</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-4">
            Intelligent Agentic<br />
            <span className="text-brand-400">Operations</span> for<br />
            Smart Hotels
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Multiple specialized AI agents working together to enhance guest experience, optimize operations, and drive revenue.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="space-y-3">
          {[
            { icon: '🤖', label: 'Guest Experience Agent', desc: 'Understands guest intent instantly' },
            { icon: '⚙️', label: 'Hotel Operations Agent', desc: 'Routes tasks to the right team' },
            { icon: '📈', label: 'Revenue Intelligence Agent', desc: 'Detects revenue opportunities' },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <div className="text-sm font-semibold text-slate-200">{f.label}</div>
                <div className="text-xs text-slate-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-8">
        {/* Top bar with Theme Switcher */}
        <div className="flex justify-end w-full">
          <div className="flex items-center p-0.5 bg-slate-200/90 dark:bg-slate-800 rounded-xl border border-slate-300/80 dark:border-slate-700/80 shadow-inner">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Switch to Light Mode"
            >
              <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Light</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              title="Switch to Dark Mode"
            >
              <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-blue-100' : 'text-slate-400'}`} />
              <span>Dark</span>
            </button>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto my-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">HotelMind <span className="text-brand-500">AI</span></span>
          </div>

          {/* Demo Badge */}
          <div className="flex items-center gap-2 justify-center mb-6">
            <div className="flex items-center gap-2 bg-brand-50 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-700/50 rounded-full px-4 py-1.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-brand-600 dark:text-brand-400">Demo Environment</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Welcome back</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to your HotelMind AI dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-lg px-4 py-3 animate-fade-in">
                  <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-lg p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Demo Credentials</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Username</div>
                  <code className="text-xs text-brand-600 dark:text-brand-400 font-mono font-semibold">admin</code>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-medium">Password</div>
                  <code className="text-xs text-brand-600 dark:text-brand-400 font-mono font-semibold">admin123</code>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-600 text-xs">
              <Hotel className="w-3.5 h-3.5" />
              <span>Hospitality AI Concept Prototype</span>
            </div>
          </div>
        </div>

        <div />
      </div>
    </div>
  );
}
