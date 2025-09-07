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
  
  // Clinic Resources
  chairs: number;
  dentists: number;
  assistants: number;
  
  // Active Elements
  patients: Patient[];
  treatments: Treatment[];
  
  // Statistics
  stats: {
    patientsServed: number;
    patientsLost: number;
    totalRevenue: number;
  };
  
  // Game Settings
  autoAssign: boolean;
  logs: string[];
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

// === GAME CONSTANTS ===
export const GAME_CONFIG = {
  // Game Timing (Realistic clinic operations)
  TICK_INTERVAL: 1000, // 1 second
  DAY_DURATION: 60, // 60 seconds = 1 business day
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
} as const;

// === PATIENT TYPES ===
export type PatientType = 'checkup' | 'scaling' | 'filling' | 'whitening' | 'braces';

export const PATIENT_TYPES = {
  checkup: {
    name: 'Checkup',
    emoji: '🪥',
    treatmentTime: 4, // 4 seconds - quick and smooth
    revenue: 80,
    patience: 12, // 12 seconds patience (3x treatment time)
    hygieneCost: 3,
  },
  scaling: {
    name: 'Scaling',
    emoji: '🫧',
    treatmentTime: 5, // 5 seconds
    revenue: 150,
    patience: 15, // 15 seconds patience (3x treatment time)
    hygieneCost: 5,
  },
  filling: {
    name: 'Filling',
    emoji: '🧱',
    treatmentTime: 6, // 6 seconds
    revenue: 220,
    patience: 18, // 18 seconds patience (3x treatment time)
    hygieneCost: 7,
  },
  whitening: {
    name: 'Whitening',
    emoji: '✨',
    treatmentTime: 7, // 7 seconds
    revenue: 300,
    patience: 21, // 21 seconds patience (3x treatment time)
    hygieneCost: 8,
  },
  braces: {
    name: 'Braces Consult',
    emoji: '😬',
    treatmentTime: 5, // 5 seconds
    revenue: 180,
    patience: 15, // 15 seconds patience (3x treatment time)
    hygieneCost: 4,
  },
} as const;

// === UPGRADES ===
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  maxLevel: number;
  currentLevel: number;
}

export const UPGRADES = {
  chair: {
    name: 'Extra Chair',
    description: 'Add one more treatment chair',
    baseCost: 800, // More expensive
    maxLevel: 5,
  },
  dentist: {
    name: 'Extra Dentist',
    description: 'Hire another dentist for parallel treatments',
    baseCost: 1200, // Much more expensive
    maxLevel: 4,
  },
  assistant: {
    name: 'Dental Assistant',
    description: 'Speed up treatments by 20%',
    baseCost: 600, // More expensive
    maxLevel: 3,
  },
  marketing: {
    name: 'Marketing Campaign',
    description: 'Increase patient arrival rate',
    baseCost: 500, // More expensive
    maxLevel: 5,
  },
  cleaning: {
    name: 'Professional Cleaning',
    description: 'Improve hygiene maintenance',
    baseCost: 400, // More expensive
    maxLevel: 1,
  },
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
