import type { RequestIntent, Priority, Department, DemoStep } from '../types';
import { geminiRotationManager } from './geminiService';

// ─── Gemini-Augmented & Resilient AI Orchestration Services ─────────────────────
// Uses rotating Gemini API keys and rotating models on quota exhaustion (HTTP 429).
// Seamlessly falls back to heuristic engine if all keys/models are exhausted.

// ─── Intent Classifier ─────────────────────────────────────────────────────────

interface IntentRule {
  keywords: string[];
  intent: RequestIntent;
}

const intentRules: IntentRule[] = [
  { keywords: ['ac', 'air', 'conditioning', 'heat', 'cold', 'fan', 'temperature', 'broken', 'not working', 'repair', 'fix', 'light', 'bulb', 'plumb', 'leak', 'electric', 'tv', 'television', 'socket'], intent: 'maintenance' },
  { keywords: ['towel', 'clean', 'housekeeping', 'sheets', 'pillow', 'blanket', 'vacuum', 'mop'], intent: 'housekeeping' },
  { keywords: ['food', 'drink', 'breakfast', 'lunch', 'dinner', 'meal', 'room service', 'coffee', 'tea', 'snack', 'order', 'menu'], intent: 'room_service' },
  { keywords: ['late checkout', 'checkout', 'check-out', 'check out', 'extend', 'stay'], intent: 'late_checkout' },
  { keywords: ['cab', 'taxi', 'car', 'transport', 'airport', 'uber', 'pick up', 'pickup', 'ride'], intent: 'cab_booking' },
  { keywords: ['spa', 'pool', 'gym', 'restaurant', 'book', 'reservation', 'recommend', 'suggest', 'help', 'information'], intent: 'concierge' },
  { keywords: ['complaint', 'noise', 'loud', 'disturb', 'unhappy', 'problem', 'issue'], intent: 'complaint' },
];

export function classifyIntent(message: string): { intent: RequestIntent; confidence: number } {
  const lower = message.toLowerCase();

  for (const rule of intentRules) {
    const matched = rule.keywords.filter((kw) => lower.includes(kw));
    if (matched.length > 0) {
      const confidence = Math.min(94 + matched.length * 2, 99);
      return { intent: rule.intent, confidence };
    }
  }

  return { intent: 'general', confidence: 78 };
}

// ─── Priority Detector ──────────────────────────────────────────────────────────

export function detectPriority(message: string, intent: RequestIntent): Priority {
  const lower = message.toLowerCase();
  const urgentKeywords = ['urgent', 'immediately', 'now', 'asap', 'emergency', 'not working', 'broken', 'help'];
  const highKeywords = ['please', 'need', 'airport', 'quickly'];

  if (urgentKeywords.some((kw) => lower.includes(kw)) || intent === 'maintenance' || intent === 'complaint') {
    return lower.includes('emergency') ? 'critical' : 'high';
  }

  if (highKeywords.some((kw) => lower.includes(kw)) || intent === 'cab_booking') {
    return 'high';
  }

  if (intent === 'room_service' || intent === 'late_checkout') {
    return 'medium';
  }

  return 'low';
}

// ─── Department Router ──────────────────────────────────────────────────────────

const intentDepartmentMap: Record<RequestIntent, Department> = {
  maintenance: 'maintenance',
  housekeeping: 'housekeeping',
  room_service: 'room_service',
  late_checkout: 'front_desk',
  cab_booking: 'front_desk',
  concierge: 'front_desk',
  complaint: 'front_desk',
  general: 'front_desk',
};

export function routeDepartment(intent: RequestIntent): Department {
  return intentDepartmentMap[intent];
}

// ─── Label Helpers ──────────────────────────────────────────────────────────────

export function getIntentLabel(intent: RequestIntent): string {
  const labels: Record<RequestIntent, string> = {
    maintenance: 'Maintenance Request',
    housekeeping: 'Housekeeping Request',
    room_service: 'Room Service Request',
    late_checkout: 'Late Checkout Request',
    cab_booking: 'Transportation Request',
    concierge: 'Concierge Request',
    complaint: 'Guest Complaint',
    general: 'General Inquiry',
  };
  return labels[intent];
}

export function getDepartmentLabel(dept: Department): string {
  const labels: Record<Department, string> = {
    maintenance: 'Maintenance',
    housekeeping: 'Housekeeping',
    front_desk: 'Front Desk',
    room_service: 'Room Service',
    security: 'Security',
    concierge: 'Concierge',
  };
  return labels[dept];
}

export function getPriorityLabel(priority: Priority): string {
  const labels: Record<Priority, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  return labels[priority];
}

export function getTaskTitle(intent: RequestIntent, _dept: Department): string {
  const titles: Record<RequestIntent, string> = {
    maintenance: 'Inspect & Repair Issue',
    housekeeping: 'Fulfill Housekeeping Request',
    room_service: 'Process Room Service Order',
    late_checkout: 'Process Late Checkout Request',
    cab_booking: 'Arrange Transportation',
    concierge: 'Handle Concierge Request',
    complaint: 'Address Guest Complaint',
    general: 'Handle Guest Inquiry',
  };
  return titles[intent];
}

export function getETA(priority: Priority): string {
  const etas: Record<Priority, string> = {
    critical: '5 minutes',
    high: '15 minutes',
    medium: '25 minutes',
    low: '45 minutes',
  };
  return etas[priority];
}

export function generateGuestResponse(intent: RequestIntent, dept: Department, priority: Priority): string {
  const responses: Record<RequestIntent, string> = {
    maintenance: `Your maintenance request has been received and assigned to our ${getDepartmentLabel(dept)} team. ${priority === 'high' || priority === 'critical' ? 'Given the urgency, our team will attend to you within 15 minutes.' : 'Our team will attend to you shortly.'}`,
    housekeeping: `Your housekeeping request has been noted. Our ${getDepartmentLabel(dept)} team will be with you shortly.`,
    room_service: `Your room service order has been placed. Our ${getDepartmentLabel(dept)} team will deliver your order within 20–30 minutes.`,
    late_checkout: `Your late checkout request has been forwarded to the Front Desk. We will confirm the availability and update you soon.`,
    cab_booking: `Your cab booking request has been registered. Our Concierge will arrange transportation and confirm the details shortly.`,
    concierge: `Your request has been forwarded to our Concierge team. They will assist you shortly.`,
    complaint: `We sincerely apologize for the inconvenience. Your concern has been escalated to our management team for immediate attention.`,
    general: `Thank you for reaching out. Our Front Desk team has been notified and will assist you shortly.`,
  };
  return responses[intent];
}

// ─── Revenue AI ──────────────────────────────────────────────────────────────────

export interface RevenueInsight {
  headline: string;
  detail: string;
  recommendations: string[];
  demandLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY HIGH';
  pricingOpportunity: boolean;
  forecastConfidence: number;
}

export function generateRevenueInsight(
  occupancy: number,
  weekendForecast: number,
  cancellationRate: number,
  adr: number
): RevenueInsight {
  let demandLevel: RevenueInsight['demandLevel'] = 'MEDIUM';
  if (weekendForecast >= 92) demandLevel = 'VERY HIGH';
  else if (weekendForecast >= 85) demandLevel = 'HIGH';
  else if (weekendForecast < 70) demandLevel = 'LOW';

  const pricingOpportunity = weekendForecast > 88 && adr < 8000;

  const recommendations: string[] = [];
  if (weekendForecast >= 90) {
    recommendations.push('Consider increasing weekend room rates by 12–18% to maximize RevPAR.');
    recommendations.push('Promotional discounts are not recommended this weekend.');
  }
  if (cancellationRate > 10) {
    recommendations.push('Cancellation rate is elevated. Review cancellation policy and enforce stricter terms.');
  }
  if (occupancy > 80) {
    recommendations.push('High base occupancy detected. Upsell suite upgrades to increase ADR.');
  }
  if (cancellationRate < 10) {
    recommendations.push('Cancellation rate is healthy. Current booking policies are effective.');
  }

  return {
    headline: `Weekend demand is forecast at ${weekendForecast}% occupancy. ${pricingOpportunity ? 'A significant revenue opportunity has been identified.' : 'Current performance is on track.'}`,
    detail: `Current occupancy stands at ${occupancy}%, with a weekend forecast of ${weekendForecast}%. The system recommends reviewing room pricing and reducing unnecessary promotional discounts to capture incremental revenue.`,
    recommendations,
    demandLevel,
    pricingOpportunity,
    forecastConfidence: 89,
  };
}

// ─── Gemini Structured Parsing ───────────────────────────────────────────────────

export interface GeminiClassificationResult {
  intent: RequestIntent;
  confidence: number;
  priority: Priority;
  department: Department;
  reasoning: string;
  suggestedResponse?: string;
  modelUsed?: string;
  keyUsed?: string;
  isLiveGemini: boolean;
}

export async function classifyWithGemini(message: string): Promise<GeminiClassificationResult> {
  const prompt = `Analyze this hotel guest request and return ONLY a valid JSON object (no markdown, no backticks, just pure JSON):
Guest message: "${message}"

JSON schema required:
{
  "intent": "maintenance" | "housekeeping" | "room_service" | "late_checkout" | "cab_booking" | "concierge" | "complaint" | "general",
  "confidence": number between 75 and 99,
  "priority": "critical" | "high" | "medium" | "low",
  "department": "maintenance" | "housekeeping" | "front_desk" | "room_service" | "security",
  "reasoning": "brief explanation",
  "suggestedResponse": "polite guest acknowledgment message"
}`;

  try {
    const result = await geminiRotationManager.generateContent(
      prompt,
      'You are the Guest Experience AI Agent for HotelMind AI. You classify guest messages into hospitality intents with precision.'
    );

    // Clean any backticks or formatting
    const cleaned = result.text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    const validIntents: RequestIntent[] = [
      'maintenance', 'housekeeping', 'room_service', 'late_checkout',
      'cab_booking', 'concierge', 'complaint', 'general',
    ];
    const validPriorities: Priority[] = ['critical', 'high', 'medium', 'low'];
    const validDepts: Department[] = ['maintenance', 'housekeeping', 'front_desk', 'room_service', 'security'];

    const intent = validIntents.includes(parsed.intent) ? parsed.intent : classifyIntent(message).intent;
    const priority = validPriorities.includes(parsed.priority) ? parsed.priority : detectPriority(message, intent);
    const department = validDepts.includes(parsed.department) ? parsed.department : routeDepartment(intent);

    return {
      intent,
      confidence: typeof parsed.confidence === 'number' ? Math.min(99, Math.max(75, parsed.confidence)) : 96,
      priority,
      department,
      reasoning: parsed.reasoning || 'Classified via intelligent hospitality reasoning engine',
      suggestedResponse: parsed.suggestedResponse,
      modelUsed: result.modelUsed,
      keyUsed: result.keyUsed,
      isLiveGemini: true,
    };
  } catch (_err) {
    // Fallback gracefully to heuristic classifier
    const { intent, confidence } = classifyIntent(message);
    const priority = detectPriority(message, intent);
    const dept = routeDepartment(intent);
    return {
      intent,
      confidence,
      priority,
      department: dept,
      reasoning: 'Evaluated via deterministic local heuristic',
      isLiveGemini: false,
    };
  }
}

// ─── Demo Workflow Steps ─────────────────────────────────────────────────────────

export function buildDemoSteps(
  message: string,
  roomNumber: string,
  geminiResult?: GeminiClassificationResult
): DemoStep[] {
  const intent = geminiResult ? geminiResult.intent : classifyIntent(message).intent;
  const confidence = geminiResult ? geminiResult.confidence : classifyIntent(message).confidence;
  const priority = geminiResult ? geminiResult.priority : detectPriority(message, intent);
  const dept = geminiResult ? geminiResult.department : routeDepartment(intent);

  const step1Details: Record<string, string> = {
    'Intent Detected': getIntentLabel(intent),
    'Confidence': `${confidence}%`,
    'Room': roomNumber,
    'Message': `"${message}"`,
  };

  return [
    {
      stepNumber: 1,
      agent: 'Guest Experience Agent',
      title: 'Guest Request Received & Analyzed',
      details: step1Details,
      delay: 700,
    },
    {
      stepNumber: 2,
      agent: 'Hotel Operations Agent',
      title: 'Request Routed & Task Created',
      details: {
        'Department': getDepartmentLabel(dept),
        'Room': roomNumber,
        'Priority': getPriorityLabel(priority),
        'Task': getTaskTitle(intent, dept),
      },
      delay: 800,
    },
    {
      stepNumber: 3,
      agent: 'Task Management',
      title: 'Task Assigned',
      details: {
        'Assigned To': `${getDepartmentLabel(dept)} Team`,
        'ETA': getETA(priority),
        'Status': 'In Progress',
        'Task ID': `TASK-${Math.floor(Math.random() * 9000) + 1000}`,
      },
      delay: 600,
    },
    {
      stepNumber: 4,
      agent: 'Guest Experience Agent',
      title: 'Guest Notification Sent',
      details: {
        'Message': geminiResult?.suggestedResponse || generateGuestResponse(intent, dept, priority),
        'Channel': 'In-App / SMS',
        'Status': 'Delivered',
      },
      delay: 500,
    },
  ];
}

// ─── Process Guest Request (main entry point) ────────────────────────────────────

export async function processGuestRequest(
  message: string,
  roomNumber: string,
  onStep: (step: DemoStep, stepIndex: number) => void
): Promise<void> {
  // First attempt live classification with rotating keys & models
  const geminiResult = await classifyWithGemini(message);
  const steps = buildDemoSteps(message, roomNumber, geminiResult);

  for (let i = 0; i < steps.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, steps[i].delay));
    onStep(steps[i], i);
  }
}

// ─── Chatbot Conversational AI Engine ──────────────────────────────────────────

export interface ChatbotResponseResult {
  text: string;
  type: 'text' | 'food_menu' | 'waiter_called' | 'hotel_map' | 'services' | 'booking_info' | 'order_confirmed';
  data?: any;
  taskCreated?: {
    title: string;
    department: Department;
    priority: Priority;
    eta: string;
  };
}

export async function handleGuestChatMessage(
  query: string,
  roomNumber: string = '304'
): Promise<ChatbotResponseResult> {
  const lower = query.toLowerCase().trim();

  // 1. Food / In-Room Dining Menu
  if (
    lower.includes('food') || lower.includes('menu') || lower.includes('eat') ||
    lower.includes('dish') || lower.includes('hungry') || lower.includes('dinner') ||
    lower.includes('lunch') || lower.includes('pizza') || lower.includes('sandwich') ||
    lower.includes('coffee') || lower.includes('tea') || lower.includes('breakfast menu')
  ) {
    return {
      type: 'food_menu',
      text: `Here is our fresh In-Room Dining Menu. You can order any dish with one click directly to Room ${roomNumber} with zero phone calls:`,
    };
  }

  // 2. Waiter / Steward Call
  if (
    lower.includes('waiter') || lower.includes('steward') || lower.includes('server') ||
    lower.includes('call staff') || lower.includes('page staff') || lower.includes('call waiter')
  ) {
    return {
      type: 'waiter_called',
      text: `A dining steward has been paged to Room ${roomNumber}.`,
      taskCreated: {
        title: 'In-Room Waitstaff Call',
        department: 'room_service',
        priority: 'high',
        eta: '3-5 minutes',
      },
      data: {
        steward: 'Rahul S. (Floor 3 Steward)',
        eta: '3-5 minutes',
        room: roomNumber,
      },
    };
  }

  // 3. Hotel Map & Directions
  if (
    lower.includes('map') || lower.includes('direction') || lower.includes('where is') ||
    lower.includes('directory') || lower.includes('floor') || lower.includes('wayfinding')
  ) {
    return {
      type: 'hotel_map',
      text: 'Here is our interactive Hotel Wayfinding Map & Floor Directory:',
    };
  }

  // 4. Hotel Services / Operating Hours
  if (
    lower.includes('service') || lower.includes('amenities') || lower.includes('facility') ||
    lower.includes('laundry')
  ) {
    return {
      type: 'services',
      text: 'Here are the current hotel services and operating hours for in-house guests:',
    };
  }

  // 5. Booking / Checkout Information
  if (
    lower.includes('booking') || lower.includes('bill') || lower.includes('folio') ||
    lower.includes('reservation') || lower.includes('stay info')
  ) {
    return {
      type: 'booking_info',
      text: 'Here is your current stay summary and room details:',
    };
  }

  // 6. Breakfast Hours & Timings
  if (lower.includes('breakfast') || lower.includes('buffet') || lower.includes('morning meal')) {
    return {
      type: 'text',
      text: 'Breakfast is served daily from 07:00 AM to 10:30 AM at "The Grand Palms All-Day Dining" on Floor 1 (Mezzanine). It features live egg & dosa stations, freshly baked viennoiserie, and international hot dishes. If you prefer to dine in bed, you can also select dishes from our in-room menu right in this chat!',
    };
  }

  // 7. Swimming Pool
  if (lower.includes('pool') || lower.includes('swimming')) {
    return {
      type: 'text',
      text: 'Our Sky Lounge & Infinity Pool is situated on Floor 7 (Rooftop), open daily from 06:00 AM to 10:00 PM with panoramic city sunset views. Fresh poolside towels and loungers are provided complimentary.',
    };
  }

  // 8. Gym / Fitness Center
  if (lower.includes('gym') || lower.includes('fitness') || lower.includes('workout') || lower.includes('treadmill')) {
    return {
      type: 'text',
      text: `The 24/7 Fitness Center is located on Floor 2 and accessible round-the-clock using your Room ${roomNumber} keycard. It is equipped with cardio machines, free weights, resistance equipment, and yoga mats.`,
    };
  }

  // 9. Spa & Wellness
  if (lower.includes('spa') || lower.includes('massage') || lower.includes('wellness') || lower.includes('sauna') || lower.includes('steam')) {
    return {
      type: 'text',
      text: 'The Serenity Spa is located on Floor 2, open daily from 08:00 AM to 09:00 PM. We offer Swedish, Deep Tissue, and traditional Ayurvedic massage therapies along with complimentary steam and sauna. Let me know if you would like me to reserve a session for you!',
    };
  }

  // 10. Wi-Fi & Internet
  if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet') || lower.includes('password')) {
    return {
      type: 'text',
      text: `High-speed Wi-Fi is complimentary for all in-house guests. Connect to network "HotelMind-Guest" using password "Welcome2026", or authenticate using your Room ${roomNumber} and last name (Mehta).`,
    };
  }

  // 11. Checkout / Late Checkout
  if (lower.includes('checkout') || lower.includes('check out') || lower.includes('check-out') || lower.includes('extend')) {
    if (lower.includes('late') || lower.includes('extend') || lower.includes('delay') || lower.includes('pm') || lower.includes('hour')) {
      return {
        type: 'text',
        text: `Standard checkout is 11:00 AM. I have logged a complimentary Late Checkout Request for Room ${roomNumber} until 02:00 PM with the Front Desk. They will confirm the extension on your account shortly.`,
        taskCreated: {
          title: `Late Checkout Request (Room ${roomNumber})`,
          department: 'front_desk',
          priority: 'medium',
          eta: '10-15 min',
        },
      };
    }
    return {
      type: 'text',
      text: 'Standard checkout time is 11:00 AM. Express checkout is available directly from your In-Room portal without standing in queue at the front desk. Would you like me to request a late checkout until 02:00 PM?',
    };
  }

  // 12. Valet & Parking
  if (lower.includes('parking') || lower.includes('valet') || lower.includes('car')) {
    return {
      type: 'text',
      text: 'Complimentary 24/7 valet parking is available for all registered hotel guests at the main entrance porch. If you need your vehicle brought around, please let me know 15 minutes in advance and our concierge will have it ready.',
    };
  }

  // 13. Greetings & Chatbot Intro
  if (
    lower.startsWith('hi') || lower.startsWith('hello') || lower.startsWith('hey') ||
    lower.includes('good morning') || lower.includes('good evening') || lower.includes('good afternoon') ||
    lower === 'hi' || lower === 'hello' || lower === 'hey' || lower.includes('who are you') || lower.includes('what can you do')
  ) {
    return {
      type: 'text',
      text: `Good day Mr. Mehta! I am your 24/7 In-Room AI Concierge for Room ${roomNumber}. I can take food orders directly to your room, page a dining steward, log housekeeping or maintenance requests, answer questions about hotel timings (pool, breakfast, gym, spa), arrange airport cabs, or assist with checkout. What can I do for you right now?`,
    };
  }

  // 14. Actionable Requests (Maintenance, Housekeeping, Transportation, Complaints, etc.)
  // First attempt Gemini classification with fast-fail
  try {
    const gemini = await classifyWithGemini(query);
    if (gemini && gemini.intent !== 'general') {
      const taskTitle = `${getIntentLabel(gemini.intent)} — ${query.slice(0, 35)}`;
      const eta = getETA(gemini.priority);
      return {
        type: 'text',
        text: gemini.suggestedResponse || generateGuestResponse(gemini.intent, gemini.department, gemini.priority),
        taskCreated: {
          title: taskTitle,
          department: gemini.department,
          priority: gemini.priority,
          eta,
        },
      };
    }
  } catch (_e) {}

  // Fallback to local heuristic intelligence
  const { intent } = classifyIntent(query);
  const priority = detectPriority(query, intent);
  const department = routeDepartment(intent);

  if (intent !== 'general') {
    const taskTitle = `${getIntentLabel(intent)} — ${query.slice(0, 35)}`;
    const eta = getETA(priority);
    return {
      type: 'text',
      text: generateGuestResponse(intent, department, priority),
      taskCreated: {
        title: taskTitle,
        department,
        priority,
        eta,
      },
    };
  }

  // Contextual fallback for general questions
  return {
    type: 'text',
    text: `Thank you Mr. Mehta. Your inquiry regarding "${query.slice(0, 40)}" has been noted for Room ${roomNumber}. Our Front Desk butler team has been notified and will assist you immediately. You can also tap any quick option below to order food, call a waiter, or view hotel amenities!`,
  };
}

