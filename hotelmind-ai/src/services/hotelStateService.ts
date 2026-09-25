import { tasks as initialTasks, aiActivities as initialActivities, departmentStats as initialDeptStats } from '../data/mockData';
import type { Task, AIActivity, DepartmentStats, Department, Priority } from '../types';

export interface FoodMenuItem {
  id: string;
  name: string;
  category: 'Mains' | 'Quick Bites' | 'Beverages' | 'Desserts';
  price: number;
  description: string;
  prepTime: string;
  isVeg: boolean;
  popular?: boolean;
}

export interface HotelFacility {
  floor: string;
  name: string;
  category: 'Dining' | 'Wellness' | 'Recreation' | 'Services' | 'Rooms';
  hours: string;
  directions: string;
  highlight?: string;
}

export const HOTEL_MENU: FoodMenuItem[] = [
  {
    id: 'food-01',
    name: 'Gourmet Club Sandwich with Truffle Fries',
    category: 'Quick Bites',
    price: 380,
    description: 'Triple-decker with smoked chicken or roasted veggies, aged cheddar & herbed mayo',
    prepTime: '15-20 min',
    isVeg: false,
    popular: true,
  },
  {
    id: 'food-02',
    name: 'Artisan Wood-Fired Margherita Pizza',
    category: 'Mains',
    price: 520,
    description: 'San Marzano tomato sauce, fresh buffalo mozzarella & sweet garden basil',
    prepTime: '20-25 min',
    isVeg: true,
    popular: true,
  },
  {
    id: 'food-03',
    name: 'Penne all’Arrabbiata',
    category: 'Mains',
    price: 450,
    description: 'Al dente penne in fiery garlic & crushed chili tomato ragù with parmesan shavings',
    prepTime: '18-22 min',
    isVeg: true,
  },
  {
    id: 'food-04',
    name: 'Crispy Caesar Salad with Grilled Chicken',
    category: 'Quick Bites',
    price: 420,
    description: 'Baby romaine hearts, garlic croutons, shaved grana padano & house dressing',
    prepTime: '12-15 min',
    isVeg: false,
  },
  {
    id: 'food-05',
    name: 'Handcrafted Artisan Cappuccino',
    category: 'Beverages',
    price: 210,
    description: 'Double espresso shot with velvety microfoam and dusted cinnamon',
    prepTime: '5-8 min',
    isVeg: true,
    popular: true,
  },
  {
    id: 'food-06',
    name: 'Warm Belgian Chocolate Brownie',
    category: 'Desserts',
    price: 280,
    description: 'Valrhona dark chocolate fudge with Madagascar bourbon vanilla gelato',
    prepTime: '10-12 min',
    isVeg: true,
  },
];

export const HOTEL_DIRECTORY: HotelFacility[] = [
  {
    floor: 'Floor 7 (Rooftop)',
    name: 'Sky Lounge & Infinity Pool',
    category: 'Recreation',
    hours: '06:00 AM – 10:00 PM',
    directions: 'Take North Elevator to 7th floor, turn left through glass skybridge',
    highlight: 'Panoramic city sunset view',
  },
  {
    floor: 'Floor 5',
    name: 'Executive Boardroom & Business Center',
    category: 'Services',
    hours: '24/7 Access for In-House Guests',
    directions: 'Elevator to 5th floor, suites wing adjacent to room 501',
    highlight: 'High-speed printing & private meeting pods',
  },
  {
    floor: 'Floor 3',
    name: 'Deluxe Guest Wing (Your Room: 304)',
    category: 'Rooms',
    hours: 'Quiet hours 10:00 PM – 07:00 AM',
    directions: 'Center corridor from elevator bank',
    highlight: 'Dedicated floor butler station at 310',
  },
  {
    floor: 'Floor 2',
    name: 'Serenity Spa & 24/7 Fitness Center',
    category: 'Wellness',
    hours: 'Spa: 08:00 AM – 09:00 PM | Gym: 24 Hours',
    directions: 'Take South Elevator to 2nd floor, turn right past the bamboo court',
    highlight: 'Steam, sauna & personal trainers available',
  },
  {
    floor: 'Floor 1 (Mezzanine)',
    name: 'The Grand Palms All-Day Dining',
    category: 'Dining',
    hours: 'Breakfast: 07:00–10:30 AM | All-Day Dining: 12:00–11:00 PM',
    directions: 'Grand spiral staircase or elevator to Level 1',
    highlight: 'Live breakfast counters & international buffet',
  },
  {
    floor: 'Ground Lobby',
    name: 'Front Desk, Concierge & Valet',
    category: 'Services',
    hours: '24 Hours Attended',
    directions: 'Main entrance hall next to the crystal chandelier lounge',
    highlight: 'Express checkout & luggage assistance',
  },
];

class HotelStateStore {
  private tasksList: Task[] = [...initialTasks];
  private activityList: AIActivity[] = [...initialActivities];
  private deptStatsList: DepartmentStats[] = [...initialDeptStats];
  private listeners: Array<() => void> = [];

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getTasks(): Task[] {
    return this.tasksList;
  }

  public getActivities(): AIActivity[] {
    return this.activityList;
  }

  public getDepartmentStats(): DepartmentStats[] {
    return this.deptStatsList;
  }

  public addTask(
    title: string,
    roomNumber: string,
    department: Department,
    priority: Priority,
    assignedTo: string,
    eta: string
  ): Task {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const taskId = `TASK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTask: Task = {
      id: taskId,
      title,
      roomNumber,
      department,
      priority,
      assignedTo,
      status: 'in_progress',
      eta,
      createdAt: timeStr,
    };

    this.tasksList = [newTask, ...this.tasksList];

    // Update department stats
    this.deptStatsList = this.deptStatsList.map((dept) => {
      if (dept.department === department) {
        return {
          ...dept,
          activeTasks: dept.activeTasks + 1,
        };
      }
      return dept;
    });

    // Add activity events
    this.addActivity(
      timeStr,
      'Hotel Operations Agent',
      `Auto-dispatched ${title} to ${assignedTo}`,
      `Room ${roomNumber} | Priority: ${priority.toUpperCase()} | ETA: ${eta}`,
      'action'
    );

    this.notify();
    return newTask;
  }

  public addActivity(
    time: string,
    agent: string,
    action: string,
    details?: string,
    type: AIActivity['type'] = 'request'
  ) {
    const newAct: AIActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 4)}`,
      time,
      agent,
      action,
      details,
      type,
    };
    this.activityList = [newAct, ...this.activityList].slice(0, 40);
    this.notify();
  }
}

export const hotelStateStore = new HotelStateStore();
