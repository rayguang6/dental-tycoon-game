'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, Patient, Treatment, GAME_CONFIG, PATIENT_TYPES, generateId, clamp, getRandomPatientName, getRandomHumanEmoji, getCurrentGameTime, getCurrentDay, isBusinessHours } from '../gameData';

// Initial game state
const initialState: GameState = {
  // Core Resources
  cash: GAME_CONFIG.STARTING_CASH,
  reputation: GAME_CONFIG.STARTING_REPUTATION,
  hygiene: GAME_CONFIG.STARTING_HYGIENE,
  energy: GAME_CONFIG.STARTING_ENERGY,
  
  // Game Progress
  day: 1,
  gameStartDate: new Date(),
  currentGameTime: 0,
  isRunning: true, // Auto-start the game
  
  // Clinic Resources
  chairs: GAME_CONFIG.STARTING_CHAIRS,
  dentists: GAME_CONFIG.STARTING_DENTISTS,
  assistants: GAME_CONFIG.STARTING_ASSISTANTS,
  
  // Active Elements
  patients: [],
  treatments: [],
  
  // Statistics
  stats: {
    patientsServed: 0,
    patientsLost: 0,
    totalRevenue: 0,
  },
  
  // Game Settings
  autoAssign: true,
  logs: ['Welcome! Your dental clinic is now open for business.'],
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialState);

  // Create a new patient
  const createPatient = useCallback((): Patient => {
    const patientTypes = Object.keys(PATIENT_TYPES) as Array<keyof typeof PATIENT_TYPES>;
    const randomType = patientTypes[Math.floor(Math.random() * patientTypes.length)];
    const typeData = PATIENT_TYPES[randomType];
    
    return {
      id: generateId(),
      name: getRandomPatientName(),
      type: randomType,
      emoji: typeData.emoji,
      humanEmoji: getRandomHumanEmoji(),
      treatmentTime: typeData.treatmentTime,
      revenue: typeData.revenue,
      patience: typeData.patience,
      maxPatience: typeData.patience,
      hygieneCost: typeData.hygieneCost,
      createdAt: Date.now(),
    };
  }, []);

  // Create a treatment from a patient
  const createTreatment = useCallback((patient: Patient, chairId: number): Treatment => {
    return {
      id: generateId(),
      patientId: patient.id,
      patientName: patient.name,
      type: patient.type,
      emoji: patient.emoji,
      humanEmoji: patient.humanEmoji,
      totalTime: patient.treatmentTime,
      remainingTime: patient.treatmentTime,
      revenue: patient.revenue,
      chairId,
      startedAt: Date.now(),
    };
  }, []);

  // Spawn a new patient
  const spawnPatient = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      patients: [...prev.patients, createPatient()],
      logs: [`New patient arrived!`, ...prev.logs.slice(0, 7)],
    }));
  }, [createPatient]);

  // Auto-assign patients to available chairs
  const autoAssignPatients = useCallback(() => {
    setGameState(prev => {
      const availableChairs = Array.from({ length: prev.chairs }, (_, i) => i)
        .filter(chairId => !prev.treatments.some(t => t.chairId === chairId));
      
      if (prev.patients.length === 0 || availableChairs.length === 0) {
        return prev;
      }

      const patient = prev.patients[0];
      const chairId = availableChairs[0];
      const treatment = createTreatment(patient, chairId);
      
      return {
        ...prev,
        patients: prev.patients.slice(1),
        treatments: [...prev.treatments, treatment],
        logs: [`${patient.name} assigned to chair ${chairId + 1}`, ...prev.logs.slice(0, 7)],
      };
    });
  }, [createTreatment]);

  // Update treatment progress
  const updateTreatments = useCallback(() => {
    setGameState(prev => {
      const updatedTreatments = prev.treatments.map(treatment => ({
        ...treatment,
        remainingTime: Math.max(0, treatment.remainingTime - 1),
      }));

      // Find completed treatments
      const completedTreatments = updatedTreatments.filter(t => t.remainingTime <= 0);
      const ongoingTreatments = updatedTreatments.filter(t => t.remainingTime > 0);

      if (completedTreatments.length === 0) {
        return { ...prev, treatments: updatedTreatments };
      }

      // Process completed treatments
      let newCash = prev.cash;
      let newReputation = prev.reputation;
      let newHygiene = prev.hygiene;
      let newLogs = [...prev.logs];

      completedTreatments.forEach(treatment => {
        newCash += treatment.revenue;
        newReputation = clamp(newReputation + 1, GAME_CONFIG.MIN_REPUTATION, GAME_CONFIG.MAX_REPUTATION);
        newHygiene = clamp(newHygiene - GAME_CONFIG.HYGIENE_LOSS_PER_TREATMENT, 0, GAME_CONFIG.MAX_HYGIENE); // More hygiene loss
        newLogs.unshift(`Treated ${treatment.patientName} - Earned ${treatment.revenue}`);
      });

      return {
        ...prev,
        cash: newCash,
        reputation: newReputation,
        hygiene: newHygiene,
        treatments: ongoingTreatments,
        stats: {
          ...prev.stats,
          patientsServed: prev.stats.patientsServed + completedTreatments.length,
          totalRevenue: prev.stats.totalRevenue + completedTreatments.reduce((sum, t) => sum + t.revenue, 0),
        },
        logs: newLogs.slice(0, 8),
      };
    });
  }, []);

  // Remove patients who lost patience
  const removeImpatientPatients = useCallback(() => {
    setGameState(prev => {
      const now = Date.now();
      const remainingPatients = prev.patients.filter(patient => {
        const timeWaiting = (now - patient.createdAt) / 1000;
        return timeWaiting < patient.patience;
      });

      const lostPatients = prev.patients.length - remainingPatients.length;
      
      if (lostPatients === 0) {
        return prev;
      }

      return {
        ...prev,
        patients: remainingPatients,
        reputation: clamp(prev.reputation - lostPatients, GAME_CONFIG.MIN_REPUTATION, GAME_CONFIG.MAX_REPUTATION),
        stats: {
          ...prev.stats,
          patientsLost: prev.stats.patientsLost + lostPatients,
        },
        logs: [`${lostPatients} patient(s) left due to long wait time`, ...prev.logs.slice(0, 7)],
      };
    });
  }, []);

  // Main game tick
  const gameTick = useCallback(() => {
    if (!gameState.isRunning) return;

    // Update game time and day progression
    setGameState(prev => {
      const newGameTime = getCurrentGameTime(prev.gameStartDate);
      const newDay = getCurrentDay(newGameTime);
      
      // Check if we've moved to a new day
      const dayChanged = newDay !== prev.day;
      
      if (dayChanged) {
        // Process end of day: pay daily costs
        const dailyCosts = GAME_CONFIG.DAILY_RENT + 
                          (GAME_CONFIG.DAILY_SALARIES * prev.dentists) + 
                          GAME_CONFIG.DAILY_UTILITIES;
        
        return {
          ...prev,
          day: newDay,
          currentGameTime: newGameTime,
          cash: Math.max(0, prev.cash - dailyCosts), // Can't go below 0
          logs: [`Day ${newDay} started! Daily costs: ${dailyCosts}`, ...prev.logs.slice(0, 7)],
        };
      }

      return {
        ...prev,
        currentGameTime: newGameTime,
      };
    });

    // Only spawn patients during business hours
    const currentGameTime = getCurrentGameTime(gameState.gameStartDate);
    if (isBusinessHours(currentGameTime) && Math.random() < GAME_CONFIG.BASE_ARRIVAL_RATE) {
      spawnPatient();
    }

    // Auto-assign patients to chairs (always available)
    autoAssignPatients();

    // Update treatment progress (always available)
    updateTreatments();

    // Remove impatient patients (always available)
    removeImpatientPatients();
  }, [gameState.isRunning, gameState.gameStartDate, spawnPatient, autoAssignPatients, updateTreatments, removeImpatientPatients]);

  // Game loop
  useEffect(() => {
    const interval = setInterval(gameTick, GAME_CONFIG.TICK_INTERVAL);
    return () => clearInterval(interval);
  }, [gameTick]);

  // Buy upgrade
  const buyUpgrade = useCallback((upgradeId: string, cost: number) => {
    setGameState(prev => {
      if (prev.cash < cost) {
        return {
          ...prev,
          logs: ['Not enough cash for this upgrade!', ...prev.logs.slice(0, 7)],
        };
      }

      let newState = {
        ...prev,
        cash: prev.cash - cost,
        logs: [`Purchased ${upgradeId} for $${cost}`, ...prev.logs.slice(0, 7)],
      };

      // Apply upgrade effects
      switch (upgradeId) {
        case 'chair':
          newState.chairs += 1;
          break;
        case 'dentist':
          newState.dentists += 1;
          break;
        case 'assistant':
          newState.assistants += 1;
          break;
        // Add more upgrades as needed
      }

      return newState;
    });
  }, []);

  // Clean clinic
  const cleanClinic = useCallback(() => {
    setGameState(prev => {
      if (prev.cash < GAME_CONFIG.HYGIENE_CLEANING_COST) {
        return {
          ...prev,
          logs: ['Not enough cash to clean the clinic!', ...prev.logs.slice(0, 7)],
        };
      }

      return {
        ...prev,
        cash: prev.cash - GAME_CONFIG.HYGIENE_CLEANING_COST,
        hygiene: clamp(prev.hygiene + GAME_CONFIG.HYGIENE_CLEANING_GAIN, 0, GAME_CONFIG.MAX_HYGIENE),
        logs: [`Clinic cleaned! +${GAME_CONFIG.HYGIENE_CLEANING_GAIN} hygiene`, ...prev.logs.slice(0, 7)],
      };
    });
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState({
      ...initialState,
      gameStartDate: new Date(), // Reset to current date
    });
  }, []);

  return {
    gameState,
    buyUpgrade,
    cleanClinic,
    resetGame,
  };
}
