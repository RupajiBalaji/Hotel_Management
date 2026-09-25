// Types for HotelMind AI

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'idle' | 'processing' | 'error';
  tasksProcessed: number;
  successRate: number;
  avgResponse?: string;
  capabilities: string[];
  icon: string;
  color: string;
}

export interface GuestRequest {
  id: string;
  roomNumber: string;
  guestName: string;
  message: string;
  timestamp: string;
  intent: RequestIntent;
  priority: Priority;
  status: RequestStatus;
  department?: Department;
}

export type RequestIntent =
  | 'maintenance'
  | 'housekeeping'
  | 'room_service'
  | 'late_checkout'
  | 'cab_booking'
  | 'concierge'
  | 'complaint'
  | 'general';

export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type RequestStatus =
  | 'received'
  | 'classifying'
  | 'classified'
  | 'routing'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'notified';

export type Department =
  | 'maintenance'
  | 'housekeeping'
  | 'front_desk'
  | 'room_service'
  | 'security'
  | 'concierge';

export interface Task {
  id: string;
  title: string;
  roomNumber: string;
  department: Department;
  priority: Priority;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed';
  eta?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DepartmentStats {
  name: string;
  department: Department;
  activeTasks: number;
  pendingTasks: number;
  completedTasks: number;
  staff: number;
}

export interface RevenueMetrics {
  occupancy: number;
  availableRooms: number;
  adr: number;
  revpar: number;
  todayBookings: number;
  weekendForecast: number;
  cancellationRate: number;
  revenueOpportunity: string;
}

export interface AIActivity {
  id: string;
  time: string;
  agent: string;
  action: string;
  details?: string;
  type: 'request' | 'classification' | 'routing' | 'action' | 'notification' | 'insight';
}

export interface WorkflowNode {
  id: string;
  type: 'input' | 'agent' | 'decision' | 'action' | 'output';
  label: string;
  description: string;
  agent?: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  trigger: string;
  agents: string[];
  steps: DemoStep[];
}

export interface DemoStep {
  stepNumber: number;
  agent: string;
  title: string;
  details: Record<string, string>;
  delay: number;
}

export interface Room {
  number: string;
  type: 'standard' | 'deluxe' | 'suite' | 'presidential';
  floor: number;
  status: 'occupied' | 'vacant' | 'cleaning' | 'maintenance';
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
}

export interface OccupancyData {
  day: string;
  occupancy: number;
  revenue: number;
}
