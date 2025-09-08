// Game Data Structure - All constants and types in one place
// This makes it easy to modify game balance and add new features

// === CORE GAME STATE ===
export interface GameState {
  // Core Resources
  cash: number;
  reputation: number;
  hygiene: number;
  energy: number;
  
  // Game Progress
  day: number;
  gameStartDate: Date;
  currentGameTime: number; // seconds since game started
  isRunning: boolean;
  isGameOver: boolean;
  isGameWon: boolean;
  
  // Clinic Resources
  chairs: number;
  dentists: number;
  assistants: number;
  
  // Upgrade Levels
  upgradeLevels: {
    chair: number;
    dentist: number;
    assistant: number;
    marketing: number;
    cleaning: number;
  };
  
  // Active Elements
  patients: Patient[];
  treatments: Treatment[];
  
  // Statistics
  stats: {
    patientsServed: number;
    patientsLost: number;
    totalRevenue: number;
  };
  
  // P&L Tracking
  dailyPnL: {
    day: number;
    revenue: number;
    expenses: number;
    netProfit: number;
    breakdown: {
      patientRevenue: number;
      eventIncome: number;
      rent: number;
      salaries: number;
      utilities: number;
      cleaning: number;
      eventExpenses: number;
    };
  }[];
  
  // Game Settings
  autoAssign: boolean;
  logs: string[];
  
  // Achievements
  completedAchievements: string[];
  
  // Events
  activeEvent: Event | null;
  isPaused: boolean;
  
  // Daily P&L Tracking (reset each day)
  dailyRevenue: number;
  dailyExpenses: number;
  dailyEventIncome: number;
  dailyEventExpenses: number;
  
  // P&L Popup
  showPnLPopup: boolean;
  pnlPopupTimer: number | null;
}

// === PATIENT TYPES ===
export interface Patient {
  id: string;
  name: string;
  type: PatientType;
  emoji: string;
  humanEmoji: string; // Human emoji for the patient
  treatmentTime: number;
  revenue: number;
  patience: number;
  maxPatience: number;
  hygieneCost: number;
  createdAt: number;
}

export interface Treatment {
  id: string;
  patientId: string;
  patientName: string;
  type: PatientType;
  emoji: string;
  humanEmoji: string; // Human emoji for the patient
  totalTime: number;
  remainingTime: number;
  revenue: number;
  chairId: number;
  startedAt: number;
}

// === EVENTS ===
export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'neutral';
  emoji: string;
  choices: readonly EventChoice[];
}

export interface EventChoice {
  id: string;
  text: string;
  cost?: number; // Cost to take this choice (optional)
  outcomes: readonly EventOutcome[];
}

export interface EventOutcome {
  probability: number; // 0-100, chance this outcome happens
  description: string;
  cashChange: number; // Positive or negative cash change
  reputationChange?: number; // Optional reputation change
  hygieneChange?: number; // Optional hygiene change
}

// === GAME CONSTANTS ===
export const GAME_CONFIG = {
  // Game Timing (Faster for better gameplay)
  TICK_INTERVAL: 1000, // 1 second
  DAY_DURATION: 20, // 20 seconds = 1 business day (balanced)
  BUSINESS_HOURS_START: 9, // 9 AM
  BUSINESS_HOURS_END: 17, // 5 PM
  
  
  // Starting Values
  STARTING_CASH: 300, // Reduced starting cash for more challenge
  STARTING_REPUTATION: 0,
  STARTING_HYGIENE: 70, // Lower starting hygiene
  STARTING_ENERGY: 100,
  STARTING_CHAIRS: 1,
  STARTING_DENTISTS: 1,
  STARTING_ASSISTANTS: 0,
  
  // Patient Arrival (Balanced for gameplay)
  BASE_ARRIVAL_RATE: 0.2, // 20% chance per second during business hours
  
  // Daily Costs (More realistic business expenses)
  DAILY_RENT: 80, // Higher rent
  DAILY_SALARIES: 50, // Higher salaries per dentist/assistant
  DAILY_UTILITIES: 20, // Basic utilities
  
  // Hygiene System (More challenging)
  HYGIENE_LOSS_PER_TREATMENT: 5, // More hygiene loss
  HYGIENE_CLEANING_COST: 30, // Cost to clean
  HYGIENE_CLEANING_GAIN: 20, // Hygiene gained from cleaning
  
  // Limits
  MAX_HYGIENE: 100,
  MAX_ENERGY: 100,
  MAX_REPUTATION: 100,
  MIN_REPUTATION: -50,
  
  // Events
  EVENT_CHANCE_PER_DAY: 0.8, // 80% chance of an event each day (more frequent!)
} as const;

// === PATIENT TYPES ===
export type PatientType = 'checkup' | 'scaling' | 'filling' | 'whitening' | 'braces';

export const PATIENT_TYPES = {
  checkup: {
    name: 'Checkup',
    emoji: '🪥',
    treatmentTime: 3,
    revenue: 80,
    patience: 8,
    hygieneCost: 3
  },
  scaling: {
    name: 'Scaling',
    emoji: '🫧',
    treatmentTime: 4,
    revenue: 150,
    patience: 10,
    hygieneCost: 5
  },
  filling: {
    name: 'Filling',
    emoji: '🧱',
    treatmentTime: 5,
    revenue: 220,
    patience: 12,
    hygieneCost: 7
  },
  whitening: {
    name: 'Whitening',
    emoji: '✨',
    treatmentTime: 6,
    revenue: 300,
    patience: 14,
    hygieneCost: 8
  },
  braces: {
    name: 'Braces Consult',
    emoji: '😬',
    treatmentTime: 4,
    revenue: 180,
    patience: 10,
    hygieneCost: 4
  }
} as const;

// === UPGRADES ===
export const UPGRADES = {
  chair: {
    name: 'Extra Chair',
    description: 'Add one more treatment chair',
    baseCost: 800,
    maxLevel: 5,
    icon: '🪑',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'from-blue-100 to-blue-200'
  },
  dentist: {
    name: 'Extra Dentist',
    description: 'Hire another dentist for parallel treatments',
    baseCost: 1200,
    maxLevel: 4,
    icon: '👨‍⚕️',
    color: 'from-green-500 to-green-600',
    bgColor: 'from-green-100 to-green-200'
  },
  assistant: {
    name: 'Dental Assistant',
    description: 'Speed up treatments by 20%',
    baseCost: 600,
    maxLevel: 3,
    icon: '👩‍⚕️',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'from-purple-100 to-purple-200'
  },
  marketing: {
    name: 'Marketing Campaign',
    description: 'Increase patient arrival rate',
    baseCost: 500,
    maxLevel: 5,
    icon: '📢',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'from-orange-100 to-orange-200'
  },
  cleaning: {
    name: 'Professional Cleaning',
    description: 'Improve hygiene maintenance',
    baseCost: 400,
    maxLevel: 1,
    icon: '🧽',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'from-cyan-100 to-cyan-200'
  }
} as const;

// === ACHIEVEMENTS ===
export const ACHIEVEMENTS = {
  'first-patient': {
    title: 'First Patient',
    description: 'Treat your first patient',
    icon: '🎯',
    reward: 50,
    condition: {
      type: 'patients_served',
      value: 1
    }
  },
  'first-1000': {
    title: 'First $1000',
    description: 'Earn your first $1000',
    icon: '💰',
    reward: 100,
    condition: {
      type: 'total_revenue',
      value: 1000
    }
  },
  'expansion': {
    title: 'Expansion',
    description: 'Buy your first extra chair',
    icon: '🪑',
    reward: 200,
    condition: {
      type: 'upgrade_level',
      upgrade: 'chair',
      value: 2
    }
  },
  'reputation-builder': {
    title: 'Reputation Builder',
    description: 'Reach 50 reputation points',
    icon: '⭐',
    reward: 300,
    condition: {
      type: 'reputation',
      value: 50
    }
  },
  'efficiency-expert': {
    title: 'Efficiency Expert',
    description: 'Hire your first dental assistant',
    icon: '👩‍⚕️',
    reward: 250,
    condition: {
      type: 'upgrade_level',
      upgrade: 'assistant',
      value: 1
    }
  },
  'marketing-master': {
    title: 'Marketing Master',
    description: 'Launch your first marketing campaign',
    icon: '📢',
    reward: 150,
    condition: {
      type: 'upgrade_level',
      upgrade: 'marketing',
      value: 1
    }
  }
} as const;

// === PATIENT NAMES ===
export const PATIENT_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James', 'Isabella', 'Benjamin',
  'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Mia', 'Alexander', 'Harper', 'Mason', 'Evelyn', 'Michael',
  'Abigail', 'Ethan', 'Emily', 'Daniel', 'Elizabeth', 'Jacob', 'Sofia', 'Logan', 'Avery', 'Jackson',
  'Ella', 'Levi', 'Madison', 'Sebastian', 'Scarlett', 'Mateo', 'Victoria', 'Jack', 'Aria', 'Owen',
  'Grace', 'Theodore', 'Chloe', 'Aiden', 'Camila', 'Samuel', 'Penelope', 'Joseph', 'Riley', 'John',
  'Layla', 'David', 'Lillian', 'Wyatt', 'Nora', 'Matthew', 'Zoey', 'Luke', 'Mila', 'Asher',
  'Aubrey', 'Carter', 'Hannah', 'Julian', 'Lily', 'Grayson', 'Addison', 'Leo', 'Eleanor', 'Jayden',
  'Natalie', 'Gabriel', 'Luna', 'Isaac', 'Savannah', 'Oliver', 'Leah', 'Jonathan', 'Bella', 'Ezra',
  'Samantha', 'Thomas', 'Maya', 'Charles', 'Skylar', 'Christopher', 'Allison', 'Jaxon', 'Anna', 'Maverick',
  'Caroline', 'Josiah', 'Genesis', 'Isaiah', 'Aaliyah', 'Andrew', 'Kennedy', 'Elias', 'Kinsley', 'Joshua',
  'Allison', 'Nathan', 'Maya', 'Aaron', 'Sarah', 'Eli', 'Hailey', 'Landon', 'Autumn', 'Adrian'
];

// === HUMAN EMOJIS ===
export const HUMAN_EMOJIS = ['👨', '👩', '👦', '👧', '🧑', '👨‍🦱', '👩‍🦱', '👨‍🦰', '👩‍🦰'] as const;

// === EVENTS ===
export const EVENTS = {
  'marketing-opportunity': {
    id: 'marketing-opportunity',
    title: 'Marketing Opportunity',
    description: 'A local newspaper wants to feature your clinic in an article about dental health. This could bring in many new patients!',
    type: 'opportunity' as const,
    emoji: '📰',
    choices: [
      {
        id: 'invest',
        text: 'Invest $500 in professional photos and marketing materials',
        cost: 500,
        outcomes: [
          {
            probability: 70,
            description: 'The article is a huge success! New patients flood in.',
            cashChange: 1500,
            reputationChange: 10
          },
          {
            probability: 30,
            description: 'The article doesn\'t get much attention. You lose your investment.',
            cashChange: 0
          }
        ]
      },
      {
        id: 'decline',
        text: 'Decline the opportunity',
        cost: 0,
        outcomes: [
          {
            probability: 100,
            description: 'You miss out on potential new patients.',
            cashChange: 0
          }
        ]
      }
    ]
  },
  'equipment-breakdown': {
    id: 'equipment-breakdown',
    title: 'Equipment Breakdown',
    description: 'Your dental chair has broken down! You need to fix it immediately or lose patients.',
    type: 'risk' as const,
    emoji: '🔧',
    choices: [
      {
        id: 'repair',
        text: 'Pay $300 for immediate repair',
        cost: 300,
        outcomes: [
          {
            probability: 100,
            description: 'Equipment is fixed and working properly.',
            cashChange: 0
          }
        ]
      }
    ]
  },
  'happy-customer': {
    id: 'happy-customer',
    title: 'Happy Customer',
    description: 'A satisfied patient has left you a glowing review online!',
    type: 'opportunity' as const,
    emoji: '😊',
    choices: [
      {
        id: 'thank',
        text: 'Thank the patient and continue providing great service',
        cost: 0,
        outcomes: [
          {
            probability: 100,
            description: 'Your reputation improves from the positive review.',
            cashChange: 0,
            reputationChange: 5
          }
        ]
      }
    ]
  },
  'power-outage': {
    id: 'power-outage',
    title: 'Power Outage',
    description: 'There\'s a power outage in your area! You can\'t treat patients until it\'s fixed.',
    type: 'risk' as const,
    emoji: '⚡',
    choices: [
      {
        id: 'wait',
        text: 'Wait for power to be restored (lose a day of business)',
        cost: 0,
        outcomes: [
          {
            probability: 100,
            description: 'You lose a day of revenue and some patients are frustrated.',
            cashChange: -200,
            reputationChange: -2
          }
        ]
      },
      {
        id: 'generator',
        text: 'Rent a generator for $400 to continue operations',
        cost: 400,
        outcomes: [
          {
            probability: 100,
            description: 'You continue operating and impress patients with your dedication.',
            cashChange: 0,
            reputationChange: 3
          }
        ]
      }
    ]
  },
  'lawsuit': {
    id: 'lawsuit',
    title: 'Legal Trouble',
    description: 'A patient is threatening to sue over a treatment. You need to handle this carefully.',
    type: 'risk' as const,
    emoji: '⚖️',
    choices: [
      {
        id: 'settle',
        text: 'Pay $800 to settle out of court',
        cost: 800,
        outcomes: [
          {
            probability: 100,
            description: 'The case is settled quickly and quietly.',
            cashChange: 0,
            reputationChange: -1
          }
        ]
      },
      {
        id: 'fight',
        text: 'Fight the case in court (costs $300)',
        cost: 300,
        outcomes: [
          {
            probability: 60,
            description: 'You win the case! Your reputation is protected.',
            cashChange: 0,
            reputationChange: 2
          },
          {
            probability: 40,
            description: 'You lose the case and must pay $1200 in damages.',
            cashChange: -1200,
            reputationChange: -5
          }
        ]
      }
    ]
  },
  'staff-strike': {
    id: 'staff-strike',
    title: 'Staff Strike',
    description: 'Your dental assistants are demanding higher wages and threatening to strike!',
    type: 'risk' as const,
    emoji: '🚫',
    choices: [
      {
        id: 'raise',
        text: 'Give everyone a $50/day raise',
        cost: 0,
        outcomes: [
          {
            probability: 100,
            description: 'Staff is happy, but your daily costs increase permanently.',
            cashChange: 0,
            reputationChange: 3
          }
        ]
      },
      {
        id: 'fire',
        text: 'Fire the strikers and hire new staff',
        cost: 200,
        outcomes: [
          {
            probability: 70,
            description: 'New staff is hired quickly and works well.',
            cashChange: 0,
            reputationChange: -2
          },
          {
            probability: 30,
            description: 'It takes time to find good replacements. You lose efficiency.',
            cashChange: 0,
            reputationChange: -4
          }
        ]
      }
    ]
  },
  'insurance-deal': {
    id: 'insurance-deal',
    title: 'Insurance Partnership',
    description: 'A major insurance company wants to partner with your clinic for exclusive coverage.',
    type: 'opportunity' as const,
    emoji: '🏥',
    choices: [
      {
        id: 'accept',
        text: 'Accept the partnership (invest $1000 in equipment)',
        cost: 1000,
        outcomes: [
          {
            probability: 80,
            description: 'Partnership is successful! You get many new patients.',
            cashChange: 2000,
            reputationChange: 8
          },
          {
            probability: 20,
            description: 'Partnership falls through. You lose your investment.',
            cashChange: 0,
            reputationChange: -2
          }
        ]
      },
      {
        id: 'decline',
        text: 'Decline the partnership',
        cost: 0,
        outcomes: [
          {
            probability: 100,
            description: 'You maintain your independence but miss out on growth.',
            cashChange: 0,
            reputationChange: 0
          }
        ]
      }
    ]
  }
} as const;




// === UTILITY FUNCTIONS ===
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function getRandomPatientName(): string {
  return PATIENT_NAMES[Math.floor(Math.random() * PATIENT_NAMES.length)];
}

export function getPatientEmotion(patiencePercent: number): string {
  if (patiencePercent > 70) return '😊'; // Happy
  if (patiencePercent > 40) return '😐'; // Neutral
  if (patiencePercent > 20) return '😕'; // Worried
  return '😡'; // Angry
}

export function getRandomHumanEmoji(): string {
  return HUMAN_EMOJIS[Math.floor(Math.random() * HUMAN_EMOJIS.length)];
}

// === DATE AND TIME UTILITIES ===
export function getCurrentGameTime(gameStartDate: Date): number {
  return Math.floor((Date.now() - gameStartDate.getTime()) / 1000);
}

export function getCurrentDay(gameTime: number): number {
  return Math.floor(gameTime / GAME_CONFIG.DAY_DURATION) + 1;
}

export function getCurrentBusinessHour(gameTime: number): number {
  const dayProgress = (gameTime % GAME_CONFIG.DAY_DURATION) / GAME_CONFIG.DAY_DURATION;
  return GAME_CONFIG.BUSINESS_HOURS_START + (dayProgress * (GAME_CONFIG.BUSINESS_HOURS_END - GAME_CONFIG.BUSINESS_HOURS_START));
}

export function isBusinessHours(gameTime: number): boolean {
  const currentHour = getCurrentBusinessHour(gameTime);
  return currentHour >= GAME_CONFIG.BUSINESS_HOURS_START && currentHour < GAME_CONFIG.BUSINESS_HOURS_END;
}

export function formatGameTime(gameTime: number): string {
  const day = getCurrentDay(gameTime);
  const hour = getCurrentBusinessHour(gameTime);
  const minute = Math.floor((hour % 1) * 60);
  return `${Math.floor(hour).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}
