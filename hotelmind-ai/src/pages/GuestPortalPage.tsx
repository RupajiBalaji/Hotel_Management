import { useState, useRef, useEffect } from 'react';
import {
  Send, Utensils, Bell, MapPin, Compass,
  CheckCircle2, Clock, Sparkles, User,
  FileText, Loader2,
} from 'lucide-react';
import { HOTEL_MENU, HOTEL_DIRECTORY, hotelStateStore, type FoodMenuItem } from '../services/hotelStateService';
import { handleGuestChatMessage } from '../services/agentService';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  timestamp: string;
  text?: string;
  type?: 'text' | 'food_menu' | 'waiter_called' | 'hotel_map' | 'services' | 'booking_info' | 'order_confirmed';
  data?: any;
}

export default function GuestPortalPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      timestamp: 'Just now',
      type: 'text',
      text: 'Good day Mr. Mehta! I am your 24/7 In-Room AI Concierge for Room 304. Designed so you never have to pick up the telephone: you can order food right in this chat, call a waiter, explore the hotel map, check amenities, or ask for any assistance. How may I make your stay comfortable?',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Mains' | 'Quick Bites' | 'Beverages' | 'Desserts'>('All');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const addMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    setMessages((prev) => [
      ...prev,
      {
        ...msg,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: time,
      },
    ]);
  };

  const handleSendText = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    if (!textToSend) setInput('');

    // Add user message
    addMessage({ sender: 'user', type: 'text', text: query });
    setLoading(true);

    try {
      const result = await handleGuestChatMessage(query, '304');

      // If an operational task was created, register it into hotelStateStore
      if (result.taskCreated) {
        hotelStateStore.addTask(
          result.taskCreated.title,
          '304',
          result.taskCreated.department,
          result.taskCreated.priority,
          `${result.taskCreated.department.toUpperCase()} Team`,
          result.taskCreated.eta
        );
      }

      setTimeout(() => {
        addMessage({
          sender: 'bot',
          type: result.type,
          text: result.text,
          data: result.data,
        });
        setLoading(false);
      }, 350);
    } catch {
      setTimeout(() => {
        addMessage({
          sender: 'bot',
          type: 'text',
          text: 'Thank you for reaching out Mr. Mehta. Your inquiry for Room 304 has been received by our Guest Experience Agent and automatically routed to the on-duty team.',
        });
        setLoading(false);
      }, 350);
    }
  };

  const handleOrderFood = (item: FoodMenuItem) => {
    // Dispatch task to Room Service
    const task = hotelStateStore.addTask(
      `F&B Order: ${item.name}`,
      '304',
      'room_service',
      'medium',
      'Room Service Kitchen',
      item.prepTime
    );

    addMessage({
      sender: 'bot',
      type: 'order_confirmed',
      text: `Order Confirmed! Your ${item.name} is being prepared.`,
      data: {
        item,
        taskId: task.id,
        eta: item.prepTime,
        room: '304',
      },
    });
  };

  const handleCallWaiter = () => {
    const task = hotelStateStore.addTask(
      'In-Room Waitstaff Call',
      '304',
      'room_service',
      'high',
      'Dining Stewards Team',
      '3-5 mins'
    );

    addMessage({
      sender: 'bot',
      type: 'waiter_called',
      text: 'A dining steward has been paged to Room 304.',
      data: {
        taskId: task.id,
        steward: 'Rahul S. (Floor 3 Steward)',
        eta: '3-5 minutes',
      },
    });
  };

  const handleLateCheckoutRequest = () => {
    hotelStateStore.addTask(
      'Late Checkout Request (Until 2:00 PM)',
      '304',
      'front_desk',
      'medium',
      'Front Desk Reception',
      '10 mins'
    );

    addMessage({
      sender: 'bot',
      type: 'text',
      text: 'Your late checkout request for 2:00 PM on Sep 20 has been submitted to the Front Desk team. Availability has been tentatively held for Room 304.',
    });
  };

  const filteredMenu =
    selectedCategory === 'All'
      ? HOTEL_MENU
      : HOTEL_MENU.filter((m) => m.category === selectedCategory);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-50 via-brand-50/50 to-slate-50 dark:from-slate-900 dark:via-brand-950/40 dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-xl transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-600/20 border border-brand-200 dark:border-brand-500/40 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">In-Room AI Concierge</h1>
                <span className="badge badge-green text-[10px]">Connected to PMS</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Room 304 • Guest: <strong className="text-slate-800 dark:text-slate-200">Arjun Mehta</strong> (Deluxe King)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCallWaiter()}
              className="bg-amber-100 dark:bg-amber-600/20 hover:bg-amber-200 dark:hover:bg-amber-600/30 border border-amber-300 dark:border-amber-600/40 text-amber-800 dark:text-amber-300 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Call Waiter
            </button>
            <button
              onClick={() => handleSendText('What food is available?')}
              className="bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Utensils className="w-3.5 h-3.5" />
              Order Food
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Quick Actions:
          </span>
          {[
            { label: '🍽️ Food Menu', query: 'What food is available?' },
            { label: '🛎️ Call Waiter', query: 'Can you call a waiter?' },
            { label: '🗺️ Hotel Map', query: 'Show hotel map and directions' },
            { label: '🏊 Hotel Services', query: 'What services are available?' },
            { label: '📋 My Booking & Wi-Fi', query: 'Show my booking info' },
            { label: '🛏️ Extra Towels', query: 'I need extra fresh towels please' },
          ].map((chip) => (
            <button
              key={chip.label}
              onClick={() => handleSendText(chip.query)}
              className="text-xs bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="card h-[600px] flex flex-col p-0 overflow-hidden bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((m) => {
            const isBot = m.sender === 'bot';

            return (
              <div
                key={m.id}
                className={`flex gap-3 animate-fade-in ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-600/20 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center flex-shrink-0 text-brand-600 dark:text-brand-400 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] md:max-w-2xl space-y-2.5 ${isBot ? 'text-left' : 'text-right'}`}>
                  {/* Text bubble */}
                  {m.text && (
                    <div
                      className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${
                        isBot
                          ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-tl-none shadow-xs'
                          : 'bg-brand-600 text-white rounded-tr-none shadow-md'
                      }`}
                    >
                      {m.text}
                    </div>
                  )}

                  {/* Rich Type: In-Chat Food Menu */}
                  {m.type === 'food_menu' && (
                    <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3.5 text-left mt-2">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Utensils className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            In-Room Dining Menu (Room 304)
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Kitchen: Open 24/7</span>
                      </div>

                      {/* Category Tabs */}
                      <div className="flex flex-wrap gap-1.5">
                        {(['All', 'Quick Bites', 'Mains', 'Beverages', 'Desserts'] as const).map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                              selectedCategory === cat
                                ? 'bg-brand-600 text-white'
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-transparent'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Items Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                        {filteredMenu.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-brand-300 dark:hover:border-slate-700 transition-colors shadow-xs"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.name}</div>
                                <span
                                  className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                                    item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                                  }`}
                                  title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                                />
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{item.description}</p>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                              <div>
                                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">₹{item.price}</span>
                                <span className="text-[10px] text-slate-500 ml-1.5">({item.prepTime})</span>
                              </div>
                              <button
                                onClick={() => handleOrderFood(item)}
                                className="btn-primary text-xs py-1 px-3"
                              >
                                Order Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rich Type: Order Confirmed Card */}
                  {m.type === 'order_confirmed' && m.data && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 space-y-2 text-left mt-2">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        Room Service Dispatch Active
                      </div>
                      <div className="bg-white dark:bg-slate-900/80 rounded-xl p-3 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs shadow-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Item:</span>
                          <span className="text-slate-900 dark:text-white font-semibold">{m.data.item.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Price:</span>
                          <span className="text-brand-600 dark:text-brand-400 font-bold">₹{m.data.item.price} (Billed to Room 304)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Task Tracking ID:</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{m.data.taskId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Estimated Delivery:</span>
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">{m.data.eta}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Dispatched via Hotel Operations Agent to Kitchen Line #2. You will receive a notification when the steward is outside your door.
                      </p>
                    </div>
                  )}

                  {/* Rich Type: Waiter Called Card */}
                  {m.type === 'waiter_called' && m.data && (
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 space-y-2 text-left mt-2">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
                        <Bell className="w-4 h-4 animate-bounce" />
                        On-Floor Steward Dispatched
                      </div>
                      <div className="bg-white dark:bg-slate-900/80 rounded-xl p-3 border border-slate-200 dark:border-slate-800 space-y-1 text-xs shadow-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Location:</span>
                          <span className="text-slate-900 dark:text-white font-semibold">Room 304</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Assigned Steward:</span>
                          <span className="text-amber-700 dark:text-amber-300 font-semibold">{m.data.steward}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 dark:text-slate-400">Estimated Arrival:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{m.data.eta}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rich Type: Interactive Hotel Map & Directory */}
                  {m.type === 'hotel_map' && (
                    <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 text-left mt-2">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Interactive Hotel Wayfinding & Floor Guide
                          </span>
                        </div>
                        <span className="text-[10px] text-brand-600 dark:text-brand-400 font-mono font-medium">You Are At: Floor 3 (Room 304)</span>
                      </div>

                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {HOTEL_DIRECTORY.map((fac) => (
                          <div
                            key={fac.name}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 hover:border-brand-400 dark:hover:border-brand-600/40 transition-colors shadow-xs"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="badge badge-blue text-[9px] mb-1">{fac.floor}</span>
                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{fac.name}</div>
                              </div>
                              <span className="badge badge-slate text-[10px]">{fac.hours}</span>
                            </div>
                            <div className="flex items-start gap-1.5 mt-2 text-[11px] text-slate-600 dark:text-slate-400">
                              <MapPin className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                              <span>{fac.directions}</span>
                            </div>
                            {fac.highlight && (
                              <div className="text-[10px] text-emerald-600 dark:text-emerald-400/90 mt-1 pl-5 font-medium">
                                ★ {fac.highlight}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rich Type: Hotel Services */}
                  {m.type === 'services' && (
                    <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 text-left mt-2">
                      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          In-House Guest Services Directory
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { title: 'Serenity Spa & Hydrotherapy', timing: '08:00 AM – 09:00 PM', desc: 'Full body Swedish massage, sauna, steam & aromatherapy' },
                          { title: '24/7 In-Room Dining', timing: 'Always Available', desc: 'Fresh gourmet meals, late-night snacks & hot beverages' },
                          { title: 'Express Laundry & Dry Cleaning', timing: '07:00 AM – 08:00 PM', desc: 'Same-day return within 4 hours for garment care' },
                          { title: 'Executive Airport Chauffeur', timing: 'On Request', desc: 'Mercedes E-Class & BMW 5-Series luxury transfers' },
                        ].map((srv) => (
                          <div key={srv.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{srv.title}</div>
                            <div className="text-[10px] text-brand-600 dark:text-brand-400 font-medium mt-0.5">{srv.timing}</div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{srv.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rich Type: Booking Info */}
                  {m.type === 'booking_info' && (
                    <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3 text-left mt-2">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                          <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Stay Folio & Room Credentials
                          </span>
                        </div>
                        <span className="badge badge-green text-[10px]">Verified Guest</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                          <div className="text-[10px] text-slate-500">Room Number</div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Room 304 (King Deluxe)</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                          <div className="text-[10px] text-slate-500">Scheduled Checkout</div>
                          <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">Sep 20, 11:00 AM</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                          <div className="text-[10px] text-slate-500">High-Speed Wi-Fi</div>
                          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">HotelMind-Guest (Pass: Welcome304)</div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                          <div className="text-[10px] text-slate-500">Room Folio Balance</div>
                          <div className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-0.5">₹14,200 (Express Pay Active)</div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex justify-end">
                        <button
                          onClick={handleLateCheckoutRequest}
                          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                        >
                          <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                          Request 2:00 PM Late Checkout
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 px-1">{m.timestamp}</div>
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center flex-shrink-0 text-slate-700 dark:text-slate-300 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2.5 text-xs text-brand-600 dark:text-brand-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl max-w-xs animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI Concierge is processing your request...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 md:p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="Ask anything (e.g., 'What food is available?', 'Call waiter', 'Where is the pool?')..."
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors shadow-xs"
          />
          <button
            onClick={() => handleSendText()}
            disabled={!input.trim() || loading}
            className="btn-primary px-5 py-3 rounded-xl disabled:opacity-50 flex items-center gap-1.5 shadow-md"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
