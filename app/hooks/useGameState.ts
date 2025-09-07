'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, Patient, Treatment, GAME_CONFIG, PATIENT_TYPES, UPGRADES, ACHIEVEMENTS, generateId, clamp, getRandomPatientName, getRandomHumanEmoji, getCurrentGameTime, getCurrentDay, isBusinessHours } from '../gameData';

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
  isGameOver: false,
  isGameWon: false,
  
  // Clinic Resources
  chairs: GAME_CONFIG.STARTING_CHAIRS,
  dentists: GAME_CONFIG.STARTING_DENTISTS,
  assistants: GAME_CONFIG.STARTING_ASSISTANTS,
  
  // Upgrade Levels
  upgradeLevels: {
    chair: 1, // Start with 1 chair
    dentist: 1, // Start with 1 dentist
    assistant: 0,
    marketing: 0,
    cleaning: 0,
  },
  
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
  
  // Achievements
  completedAchievements: [],
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

  // Check win condition
  const checkWinCondition = useCallback((prevState: GameState) => {
    // Win condition: Reach $100,000 total revenue
    const hasEnoughRevenue = prevState.stats.totalRevenue >= 100000;
    
    if (hasEnoughRevenue && !prevState.isGameWon) {
      return {
        ...prevState,
        isGameWon: true,
        isRunning: false,
        logs: [`🎉 VICTORY! You earned $100,000 and built a successful dental empire!`, ...prevState.logs.slice(0, 7)],
      };
    }
    
    return prevState;
  }, []);

  // Check and unlock achievements
  const checkAchievements = useCallback((prevState: GameState) => {
    const newAchievements: string[] = [];
    
    Object.entries(ACHIEVEMENTS).forEach(([id, achievement]) => {
      // Skip if already completed
      if (prevState.completedAchievements.includes(id)) return;
      
      let shouldUnlock = false;
      
      switch (achievement.condition.type) {
        case 'patients_served':
          shouldUnlock = prevState.stats.patientsServed >= achievement.condition.value;
          break;
        case 'total_revenue':
          shouldUnlock = prevState.stats.totalRevenue >= achievement.condition.value;
          break;
        case 'reputation':
          shouldUnlock = prevState.reputation >= achievement.condition.value;
          break;
        case 'upgrade_level':
          shouldUnlock = prevState.upgradeLevels[achievement.condition.upgrade as keyof typeof prevState.upgradeLevels] >= achievement.condition.value;
          break;
      }
      
      if (shouldUnlock) {
        newAchievements.push(id);
      }
    });
    
    if (newAchievements.length > 0) {
      const updatedState = {
        ...prevState,
        completedAchievements: [...prevState.completedAchievements, ...newAchievements],
        cash: prevState.cash + newAchievements.reduce((total, id) => total + ACHIEVEMENTS[id as keyof typeof ACHIEVEMENTS].reward, 0),
        logs: [
          ...newAchievements.map(id => `🏆 Achievement Unlocked: ${ACHIEVEMENTS[id as keyof typeof ACHIEVEMENTS].title}! +$${ACHIEVEMENTS[id as keyof typeof ACHIEVEMENTS].reward}`),
          ...prevState.logs.slice(0, 7 - newAchievements.length)
        ],
      };

      // Check for win condition after achievements
      return checkWinCondition(updatedState);
    }
    
    return checkWinCondition(prevState);
  }, [checkWinCondition]);

  // Update treatment progress
  const updateTreatments = useCallback(() => {
    setGameState(prev => {
      // Calculate assistant speed bonus (20% per assistant)
      const assistantSpeedBonus = 1 + (prev.upgradeLevels.assistant * 0.2);
      
      const updatedTreatments = prev.treatments.map(treatment => ({
        ...treatment,
        remainingTime: Math.max(0, treatment.remainingTime - assistantSpeedBonus),
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

      const newState = {
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

      return checkAchievements(newState);
    });
  }, [checkAchievements]);

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
    if (!gameState.isRunning || gameState.isGameOver || gameState.isGameWon) return;

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
        
        const newCash = Math.max(0, prev.cash - dailyCosts);
        
        // Check for game over (bankruptcy)
        if (newCash === 0 && prev.cash > 0) {
          return {
            ...prev,
            day: newDay,
            currentGameTime: newGameTime,
            cash: newCash,
            isGameOver: true,
            isRunning: false,
            logs: [`💸 GAME OVER! You went bankrupt on Day ${newDay}!`, ...prev.logs.slice(0, 7)],
          };
        }
        
        return {
          ...prev,
          day: newDay,
          currentGameTime: newGameTime,
          cash: newCash,
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
    if (isBusinessHours(currentGameTime)) {
      // Calculate arrival rate with marketing bonus
      const marketingBonus = gameState.upgradeLevels.marketing * 0.1; // 10% per level
      const arrivalRate = GAME_CONFIG.BASE_ARRIVAL_RATE + marketingBonus;
      
      if (Math.random() < arrivalRate) {
        spawnPatient();
      }
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
      // Validation checks
      if (prev.cash < cost) {
        return {
          ...prev,
          logs: ['Not enough cash for this upgrade!', ...prev.logs.slice(0, 7)],
        };
      }

      const currentLevel = prev.upgradeLevels[upgradeId as keyof typeof prev.upgradeLevels];
      const maxLevel = UPGRADES[upgradeId as keyof typeof UPGRADES]?.maxLevel || 0;
      
      if (currentLevel >= maxLevel) {
        return {
          ...prev,
          logs: [`${upgradeId} is already at maximum level!`, ...prev.logs.slice(0, 7)],
        };
      }

      // Calculate new state immutably
      const newLevel = currentLevel + 1;
      const newUpgradeLevels = {
        ...prev.upgradeLevels,
        [upgradeId]: newLevel,
      };

      // Apply upgrade effects immutably
      let updatedState = {
        ...prev,
        cash: prev.cash - cost,
        upgradeLevels: newUpgradeLevels,
        logs: [`Purchased ${upgradeId} (Level ${newLevel}) for $${cost}`, ...prev.logs.slice(0, 7)],
      };

      // Apply specific upgrade effects
      switch (upgradeId) {
        case 'chair':
          updatedState = {
            ...updatedState,
            chairs: updatedState.chairs + 1,
          };
          break;
        case 'dentist':
          updatedState = {
            ...updatedState,
            dentists: updatedState.dentists + 1,
          };
          break;
        case 'assistant':
          updatedState = {
            ...updatedState,
            assistants: updatedState.assistants + 1,
          };
          break;
        case 'marketing':
          // Marketing increases patient arrival rate (handled in game tick)
          break;
        case 'cleaning':
          // Professional cleaning improves hygiene maintenance
          updatedState = {
            ...updatedState,
            hygiene: Math.min(100, updatedState.hygiene + 10),
          };
          break;
      }

      return checkAchievements(updatedState);
    });
  }, [checkAchievements]);

  // Clean clinic
  const cleanClinic = useCallback(() => {
    setGameState(prev => {
      if (prev.cash < GAME_CONFIG.HYGIENE_CLEANING_COST) {
        return {
          ...prev,
          logs: ['Not enough cash to clean the clinic!', ...prev.logs.slice(0, 7)],
        };
      }

      const newState = {
        ...prev,
        cash: prev.cash - GAME_CONFIG.HYGIENE_CLEANING_COST,
        hygiene: clamp(prev.hygiene + GAME_CONFIG.HYGIENE_CLEANING_GAIN, 0, GAME_CONFIG.MAX_HYGIENE),
        logs: [`Clinic cleaned! +${GAME_CONFIG.HYGIENE_CLEANING_GAIN} hygiene`, ...prev.logs.slice(0, 7)],
      };

      return checkAchievements(newState);
    });
  }, [checkAchievements]);

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
