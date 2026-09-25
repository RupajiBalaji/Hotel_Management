import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import {
  Brain, LayoutDashboard, Users, Inbox, Settings,
  TrendingUp, PlayCircle, LogOut, Hotel,
  ChevronLeft, Menu, X, Activity, Sparkles, Sun, Moon,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/guest-portal', icon: Sparkles, label: 'Guest Concierge (In-Room)' },
  { to: '/agents', icon: Users, label: 'AI Agents' },
  { to: '/guest-requests', icon: Inbox, label: 'Guest Requests' },
  { to: '/operations', icon: Settings, label: 'Operations' },
  { to: '/revenue', icon: TrendingUp, label: 'Revenue Intelligence' },
  { to: '/demo', icon: PlayCircle, label: 'Demo Center' },
];

export default function AppLayout() {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const timeStr = currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const dateStr = currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative z-30 flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-[18px] h-[18px] text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  HotelMind <span className="text-brand-600 dark:text-brand-400">AI</span>
                </div>
                <div className="text-[10px] text-slate-500">Smart Hotel Operations</div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center mx-auto">
              <Brain className="w-[18px] h-[18px] text-white" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {!collapsed && (
            <div className="px-2 py-1.5 mb-2">
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Navigation</span>
            </div>
          )}
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                isActive ? 'nav-item-active' : 'nav-item-inactive'
              }
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-2 px-3 py-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-500">Demo Environment</span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="nav-item-inactive w-full"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex-shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mr-2"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800/40 rounded-lg px-3 py-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">All Systems Active</span>
            </div>
            <NavLink
              to="/guest-portal"
              className="hidden sm:flex items-center gap-1.5 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 dark:hover:bg-brand-900/60 border border-brand-200 dark:border-brand-700/50 rounded-lg px-3 py-1.5 transition-colors"
              title="Open Guest In-Room Concierge Chat"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">Room 304 Concierge</span>
              <span className="badge badge-green text-[9px] px-1.5 py-0">Guest View</span>
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switcher Segmented Control */}
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
                aria-pressed={theme === 'light'}
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
                aria-pressed={theme === 'dark'}
              >
                <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-blue-100' : 'text-slate-400'}`} />
                <span>Dark</span>
              </button>
            </div>

            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{timeStr}</div>
              <div className="text-xs text-slate-500">{dateStr}</div>
            </div>

            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2">
              <div className="w-7 h-7 bg-brand-100 dark:bg-brand-600/20 border border-brand-200 dark:border-brand-600/30 rounded-lg flex items-center justify-center">
                <Hotel className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Demo Hotel</div>
                <div className="text-[10px] text-slate-500">Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 transition-colors duration-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
