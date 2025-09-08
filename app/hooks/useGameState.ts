'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, GameLog, Patient, Treatment, GAME_CONFIG, PATIENT_TYPES, UPGRADES, ACHIEVEMENTS, EVENTS, Event, generateId, clamp, getRandomPatientName, getRandomHumanEmoji, isBusinessHours } from '../gameData';

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
  
  // P&L Tracking
  dailyPnL: [],
  
  // Game Settings
  autoAssign: true,
  logs: [{
    id: 'welcome',
    type: 'system',
    message: 'Welcome! Your dental clinic is now open for business.',
    timestamp: Date.now()
  }],
  
  // Achievements
  completedAchievements: [],
  
  // Events
  activeEvent: null,
  isPaused: false,
  
  // Daily P&L Tracking (reset each day)
  dailyRevenue: 0,
  dailyExpenses: 0,
  dailyEventIncome: 0,
  dailyEventExpenses: 0,
  
  // P&L Popup
  showPnLPopup: false,
  pnlPopupTimer: null,
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
      logs: [...prev.logs], // Remove patient arrival logs
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
        logs: [...prev.logs], // Remove assignment logs
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
        logs: [addLog('system', `🎉 VICTORY! You earned $100,000 and built a successful dental empire!`), ...prevState.logs.slice(0, 7)],
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
          ...newAchievements.map(id => addLog('achievement', `${ACHIEVEMENTS[id as keyof typeof ACHIEVEMENTS].title}!`, { cash: ACHIEVEMENTS[id as keyof typeof ACHIEVEMENTS].reward })),
          ...prevState.logs.slice(0, 7 - newAchievements.length)
        ],
      };

      // Check for win condition after achievements
      return checkWinCondition(updatedState);
    }
    
    return checkWinCondition(prevState);
  }, [checkWinCondition]);

  // Helper function to add logs
  const addLog = useCallback((type: GameLog['type'], message: string, effects?: GameLog['effects']) => {
    const log: GameLog = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      effects,
      timestamp: Date.now()
    };
    return log;
  }, []);

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
        // Get patient type info for better logging
        const patientType = PATIENT_TYPES[treatment.type];
        const serviceEmoji = patientType?.emoji || '🦷';
        const serviceName = patientType?.name || treatment.type;
        
        newLogs.unshift(addLog('treatment', `${treatment.patientName} ${serviceEmoji} ${serviceName}`, {
          cash: treatment.revenue,
          reputation: 1
        }));
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
        dailyRevenue: prev.dailyRevenue + completedTreatments.reduce((sum, t) => sum + t.revenue, 0),
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
        logs: [addLog('system', `${lostPatients} patient(s) left due to long wait time`), ...prev.logs.slice(0, 7)],
      };
    });
  }, []);

  // Main game tick
  const gameTick = useCallback(() => {
    if (!gameState.isRunning || gameState.isGameOver || gameState.isGameWon || gameState.isPaused) return;

    // Simple day progression - just increment day when duration passes
    setGameState(prev => {
      const newGameTime = prev.currentGameTime + GAME_CONFIG.TICK_INTERVAL / 1000;
      const newDay = Math.floor(newGameTime / GAME_CONFIG.DAY_DURATION) + 1;
      
      // Check if we've moved to a new day
      const dayChanged = newDay !== prev.day;
      
      if (dayChanged) {
        // Process end of day: pay daily costs
        const dailyCosts = GAME_CONFIG.DAILY_RENT + 
                          (GAME_CONFIG.DAILY_SALARIES * prev.dentists) + 
                          GAME_CONFIG.DAILY_UTILITIES;
        
        const newCash = Math.max(0, prev.cash - dailyCosts);
        
        // Record daily P&L
        const dailyPnLEntry = {
          day: prev.day,
          revenue: prev.dailyRevenue + prev.dailyEventIncome,
          expenses: dailyCosts + prev.dailyEventExpenses + prev.dailyExpenses,
          netProfit: prev.dailyRevenue + prev.dailyEventIncome - dailyCosts - prev.dailyEventExpenses - prev.dailyExpenses,
          breakdown: {
            patientRevenue: prev.dailyRevenue,
            eventIncome: prev.dailyEventIncome,
            rent: GAME_CONFIG.DAILY_RENT,
            salaries: GAME_CONFIG.DAILY_SALARIES * prev.dentists,
            utilities: GAME_CONFIG.DAILY_UTILITIES,
            cleaning: prev.dailyExpenses,
            eventExpenses: prev.dailyEventExpenses,
          }
        };
        
        // Check for game over (bankruptcy)
        if (newCash === 0 && prev.cash > 0) {
          return {
            ...prev,
            day: newDay,
            currentGameTime: newGameTime,
            cash: newCash,
            isGameOver: true,
            isRunning: false,
            dailyPnL: [...prev.dailyPnL, dailyPnLEntry],
            dailyRevenue: 0,
            dailyExpenses: 0,
            dailyEventIncome: 0,
            dailyEventExpenses: 0,
            logs: [addLog('system', `💸 GAME OVER! You went bankrupt on Day ${newDay}!`), ...prev.logs.slice(0, 7)],
          };
        }
        
        const newState = {
          ...prev,
          day: newDay,
          currentGameTime: newGameTime,
          cash: newCash,
          dailyPnL: [...prev.dailyPnL, dailyPnLEntry],
          dailyRevenue: 0,
          dailyExpenses: 0,
          dailyEventIncome: 0,
          dailyEventExpenses: 0,
          showPnLPopup: true, // Show P&L popup for the completed day
          isPaused: true, // Pause game during P&L popup
          logs: [addLog('system', `Day ${newDay} started! Daily costs: ${dailyCosts}`), ...prev.logs.slice(0, 7)],
        };

        // Events will be checked during game tick, not at day start

        return newState;
      }

      return {
        ...prev,
        currentGameTime: newGameTime,
      };
    });

    // Only spawn patients during business hours
    if (isBusinessHours(gameState.currentGameTime)) {
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

    // Check for random events during the day (only if no active event and not paused)
    if (!gameState.activeEvent && !gameState.isPaused && Math.random() < GAME_CONFIG.EVENT_CHANCE_PER_DAY / 20) { // Divide by 20 to make it less frequent per tick
      const eventIds = Object.keys(EVENTS);
      const randomEventId = eventIds[Math.floor(Math.random() * eventIds.length)];
      const randomEvent = EVENTS[randomEventId as keyof typeof EVENTS];
      
      setGameState(prev => ({
        ...prev,
        activeEvent: randomEvent,
        isPaused: true, // Pause the game when event appears
        logs: [...prev.logs], // Remove simple event trigger logs
      }));
    }
  }, [gameState.isRunning, gameState.isPaused, gameState.gameStartDate, spawnPatient, autoAssignPatients, updateTreatments, removeImpatientPatients]);

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
          logs: [addLog('system', 'Not enough cash for this upgrade!'), ...prev.logs.slice(0, 7)],
        };
      }

      const currentLevel = prev.upgradeLevels[upgradeId as keyof typeof prev.upgradeLevels];
      const maxLevel = UPGRADES[upgradeId as keyof typeof UPGRADES]?.maxLevel || 0;
      
      if (currentLevel >= maxLevel) {
        return {
          ...prev,
          logs: [addLog('system', `${upgradeId} is already at maximum level!`), ...prev.logs.slice(0, 7)],
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
        logs: [addLog('upgrade', `Purchased ${upgradeId} (Level ${newLevel})`, { cash: -cost }), ...prev.logs.slice(0, 7)],
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
          logs: [addLog('system', 'Not enough cash to clean the clinic!'), ...prev.logs.slice(0, 7)],
        };
      }

      const newState = {
        ...prev,
        cash: prev.cash - GAME_CONFIG.HYGIENE_CLEANING_COST,
        hygiene: clamp(prev.hygiene + GAME_CONFIG.HYGIENE_CLEANING_GAIN, 0, GAME_CONFIG.MAX_HYGIENE),
        dailyExpenses: prev.dailyExpenses + GAME_CONFIG.HYGIENE_CLEANING_COST,
        logs: [addLog('cost', `Clinic cleaned!`, { hygiene: GAME_CONFIG.HYGIENE_CLEANING_GAIN, cash: -GAME_CONFIG.HYGIENE_CLEANING_COST }), ...prev.logs.slice(0, 7)],
      };

      return checkAchievements(newState);
    });
  }, [checkAchievements]);

  // Handle event choice
  const handleEventChoice = useCallback((choiceId: string) => {
    setGameState(prev => {
      if (!prev.activeEvent) return prev;


      const choice = prev.activeEvent.choices.find(c => c.id === choiceId);
      if (!choice) return prev;

      // Check if player can afford the choice
      if (choice.cost && prev.cash < choice.cost) {
        return {
          ...prev,
          logs: [addLog('system', 'Not enough cash for this choice!'), ...prev.logs.slice(0, 7)],
        };
      }

      // Deduct cost if any
      let newCash = prev.cash;
      if (choice.cost) {
        newCash = prev.cash - choice.cost;
      }

      // Determine outcome based on probability
      const random = Math.random() * 100;
      let cumulativeProbability = 0;
      let selectedOutcome = choice.outcomes[0]; // Default to first outcome

      for (const outcome of choice.outcomes) {
        cumulativeProbability += outcome.probability;
        if (random <= cumulativeProbability) {
          selectedOutcome = outcome;
          break;
        }
      }

      // Apply outcome effects
      const finalCash = newCash + selectedOutcome.cashChange;
      const newReputation = clamp(
        prev.reputation + (selectedOutcome.reputationChange || 0),
        GAME_CONFIG.MIN_REPUTATION,
        GAME_CONFIG.MAX_REPUTATION
      );
      const newHygiene = clamp(
        prev.hygiene + (selectedOutcome.hygieneChange || 0),
        0,
        GAME_CONFIG.MAX_HYGIENE
      );

      // Track event income/expenses
      const eventIncome = selectedOutcome.cashChange > 0 ? selectedOutcome.cashChange : 0;
      const eventExpenses = selectedOutcome.cashChange < 0 ? Math.abs(selectedOutcome.cashChange) : 0;
      
      // Also track the choice cost as event expense
      const choiceCost = choice.cost || 0;

      return {
        ...prev,
        cash: finalCash,
        reputation: newReputation,
        hygiene: newHygiene,
        dailyEventIncome: prev.dailyEventIncome + eventIncome,
        dailyEventExpenses: prev.dailyEventExpenses + eventExpenses + choiceCost,
        activeEvent: null, // Close the event
        isPaused: false, // Resume the game
        logs: [
          // Log the event outcome first
          addLog('event', `${prev.activeEvent.title}: ${selectedOutcome.description}`, {
            cash: selectedOutcome.cashChange,
            reputation: selectedOutcome.reputationChange,
            hygiene: selectedOutcome.hygieneChange
          }),
          // Log the decision cost after (so it appears above the outcome)
          ...(choice.cost && choice.cost > 0 ? [addLog('cost', `Paid $${choice.cost} for ${choice.text}`, { cash: -choice.cost })] : []),
          ...prev.logs.slice(0, 5)
        ],
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

  // Close P&L popup
  const closePnLPopup = useCallback(() => {
    setGameState(prev => {
      // Clear any existing timer
      if (prev.pnlPopupTimer) {
        clearTimeout(prev.pnlPopupTimer);
      }
      
      return {
        ...prev,
        showPnLPopup: false,
        isPaused: false, // Resume game
        pnlPopupTimer: null,
      };
    });
  }, []);

  // Auto-close P&L popup after 5 seconds
  useEffect(() => {
    if (gameState.showPnLPopup && !gameState.pnlPopupTimer) {
      const timer = setTimeout(() => {
        closePnLPopup();
      }, 5000); // 5 seconds
      
      setGameState(prev => ({
        ...prev,
        pnlPopupTimer: timer as any, // TypeScript workaround for timer ID
      }));
    }
  }, [gameState.showPnLPopup, gameState.pnlPopupTimer, closePnLPopup]);

  return {
    gameState,
    buyUpgrade,
    cleanClinic,
    resetGame,
    handleEventChoice,
    closePnLPopup,
  };
}
