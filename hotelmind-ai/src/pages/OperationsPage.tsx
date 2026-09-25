import { useState, useEffect } from 'react';
import {
  Wrench, Sparkles, Phone, Coffee, Shield,
  CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { hotelStateStore } from '../services/hotelStateService';
import type { Department, Task, DepartmentStats } from '../types';

const deptIcons: Record<string, React.ElementType> = {
  housekeeping: Sparkles,
  maintenance: Wrench,
  front_desk: Phone,
  room_service: Coffee,
  security: Shield,
};

const deptColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  housekeeping: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800/30',
    text: 'text-blue-700 dark:text-blue-400',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  maintenance: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800/30',
    text: 'text-amber-700 dark:text-amber-400',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  front_desk: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800/30',
    text: 'text-purple-700 dark:text-purple-400',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  room_service: {
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800/30',
    text: 'text-emerald-700 dark:text-emerald-400',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  security: {
    bg: 'bg-slate-100 dark:bg-slate-800/40',
    border: 'border-slate-300 dark:border-slate-700/50',
    text: 'text-slate-700 dark:text-slate-400',
    icon: 'text-slate-600 dark:text-slate-400',
  },
};

const priorityBadge: Record<string, string> = {
  critical: 'badge-red',
  high: 'badge-red',
  medium: 'badge-amber',
  low: 'badge-slate',
};

const statusStyle: Record<string, string> = {
  pending: 'badge-slate',
  in_progress: 'badge-blue',
  completed: 'badge-green',
};

const statusLabel: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const deptLabel: Record<string, string> = {
  housekeeping: 'Housekeeping',
  maintenance: 'Maintenance',
  front_desk: 'Front Desk',
  room_service: 'Room Service',
  security: 'Security',
};

export default function OperationsPage() {
  const [tasksList, setTasksList] = useState<Task[]>(() => hotelStateStore.getTasks());
  const [deptStats, setDeptStats] = useState<DepartmentStats[]>(() => hotelStateStore.getDepartmentStats());
  const [filterDept, setFilterDept] = useState<Department | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['maintenance', 'housekeeping', 'room_service']));

  useEffect(() => {
    const unsub = hotelStateStore.subscribe(() => {
      setTasksList(hotelStateStore.getTasks());
      setDeptStats(hotelStateStore.getDepartmentStats());
    });
    return unsub;
  }, []);

  function toggleDept(dept: string) {
    setExpandedDepts((prev) => {
      const next = new Set(prev);
      if (next.has(dept)) next.delete(dept);
      else next.add(dept);
      return next;
    });
  }

  const filteredTasks = tasksList.filter((t) => {
    if (filterDept !== 'all' && t.department !== filterDept) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hotel Operations</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
          Department task management — coordinated by the Hotel Operations Agent.
        </p>
      </div>

      {/* Department Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {deptStats.map((dept) => {
          const Icon = deptIcons[dept.department] || Sparkles;
          const colors = deptColors[dept.department];
          const isExpanded = expandedDepts.has(dept.department);

          return (
            <div
              key={dept.department}
              className={`stat-card border ${colors.border} ${colors.bg} cursor-pointer hover:opacity-90 transition-opacity shadow-xs`}
              onClick={() => toggleDept(dept.department)}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${colors.icon}`} />
                {isExpanded
                  ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                  : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
              </div>
              <div className={`text-sm font-semibold ${colors.text} mb-3`}>{dept.name}</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Active</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">{dept.activeTasks}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Pending</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{dept.pendingTasks}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Done</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{dept.completedTasks}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Department</label>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value as Department | 'all')}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-xs"
            >
              <option value="all">All Departments</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="maintenance">Maintenance</option>
              <option value="front_desk">Front Desk</option>
              <option value="room_service">Room Service</option>
              <option value="security">Security</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 shadow-xs"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>{filteredTasks.length} tasks</span>
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div className="card overflow-hidden">
        <h2 className="section-title mb-4">Task Queue</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                {['Task', 'Room', 'Department', 'Priority', 'Assigned To', 'ETA', 'Status'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 pr-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
              {filteredTasks.map((task) => {
                const colors = deptColors[task.department];
                return (
                  <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-200">{task.title}</td>
                    <td className="py-3 pr-4">
                      <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs font-mono text-slate-700 dark:text-slate-300">
                        {task.roomNumber}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`badge text-[10px] ${colors.bg} ${colors.border} ${colors.text} border`}>
                        {deptLabel[task.department]}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`badge ${priorityBadge[task.priority] || 'badge-slate'} text-[10px]`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-xs text-slate-500 dark:text-slate-400">{task.assignedTo}</td>
                    <td className="py-3 pr-4 text-xs text-slate-500 dark:text-slate-400">
                      {task.status === 'completed'
                        ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">Done {task.completedAt}</span>
                        : task.eta || '—'
                      }
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        {task.status === 'completed'
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          : task.status === 'in_progress'
                          ? <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          : <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                        }
                        <span className={`badge ${statusStyle[task.status]} text-[10px]`}>
                          {statusLabel[task.status]}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
