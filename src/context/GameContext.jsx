import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MISSIONS, ACHIEVEMENTS, XP_PER_LEVEL, ZONES } from '../constants/arcChain';

const GameContext = createContext(null);

const STORAGE_KEY = 'arcquest_game_state';

const defaultState = {
  xp: 0,
  level: 1,
  completedMissions: [],
  missionLastCompleted: {},
  unlockedZones: [1],
  achievements: [],
  nftBadges: [],
  loginStreak: 0,
  lastLoginDate: null,
  txHistory: [],
  leaderboardRank: null,
  username: '',
  joinedAt: null,
};

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });
  const [showAchievement, setShowAchievement] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(null);
  const [showMissionComplete, setShowMissionComplete] = useState(null);
  const [showNFTUnlock, setShowNFTUnlock] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  const getCurrentLevel = useCallback((xp) => {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
  }, []);

  const getXPForNextLevel = useCallback((xp) => {
    const level = getCurrentLevel(xp);
    return level * XP_PER_LEVEL;
  }, [getCurrentLevel]);

  const getXPProgress = useCallback((xp) => {
    const level = getCurrentLevel(xp);
    const xpInCurrentLevel = xp - ((level - 1) * XP_PER_LEVEL);
    return (xpInCurrentLevel / XP_PER_LEVEL) * 100;
  }, [getCurrentLevel]);

  const addXP = useCallback((amount) => {
    setGameState(prev => {
      const newXP = prev.xp + amount;
      const oldLevel = getCurrentLevel(prev.xp);
      const newLevel = getCurrentLevel(newXP);

      // Check zone unlocks
      const newUnlockedZones = [...prev.unlockedZones];
      ZONES.forEach(zone => {
        if (newLevel >= zone.unlockLevel && !newUnlockedZones.includes(zone.id)) {
          newUnlockedZones.push(zone.id);
        }
      });

      if (newLevel > oldLevel) {
        setTimeout(() => setShowLevelUp(newLevel), 500);
      }

      return { ...prev, xp: newXP, level: newLevel, unlockedZones: newUnlockedZones };
    });
  }, [getCurrentLevel]);

  const completeMission = useCallback((missionId) => {
    const mission = MISSIONS.find(m => m.id === missionId);
    if (!mission) return false;

    setGameState(prev => {
      const now = Date.now();
      const lastCompleted = prev.missionLastCompleted[missionId];

      if (!mission.repeatable && prev.completedMissions.includes(missionId)) return prev;
      if (mission.repeatable && lastCompleted && (now - lastCompleted) < mission.cooldown) return prev;

      const newCompleted = mission.repeatable
        ? prev.completedMissions
        : [...prev.completedMissions, missionId];

      return {
        ...prev,
        completedMissions: newCompleted,
        missionLastCompleted: { ...prev.missionLastCompleted, [missionId]: now },
      };
    });

    addXP(mission.xp, missionId);
    setTimeout(() => setShowMissionComplete(mission), 300);
    return true;
  }, [addXP]);

  const unlockAchievement = useCallback((achievementId) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return;

    setGameState(prev => {
      if (prev.achievements.includes(achievementId)) return prev;
      setTimeout(() => setShowAchievement(achievement), 500);
      return { ...prev, achievements: [...prev.achievements, achievementId] };
    });
  }, []);

  const addNFTBadge = useCallback((badge) => {
    setGameState(prev => {
      if (prev.nftBadges.some(b => b.id === badge.id)) return prev;
      setTimeout(() => setShowNFTUnlock(badge), 500);
      return { ...prev, nftBadges: [...prev.nftBadges, badge] };
    });
  }, []);

  const addTxToHistory = useCallback((tx) => {
    setGameState(prev => ({
      ...prev,
      txHistory: [{ ...tx, timestamp: Date.now() }, ...prev.txHistory].slice(0, 50),
    }));
  }, []);

  const updateLoginStreak = useCallback(() => {
    setGameState(prev => {
      const today = new Date().toDateString();
      const lastLogin = prev.lastLoginDate;
      if (lastLogin === today) return prev;

      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const streak = lastLogin === yesterday ? prev.loginStreak + 1 : 1;

      if (streak > 0) {
        setTimeout(() => completeMission('daily_login'), 500);
      }

      return { ...prev, loginStreak: streak, lastLoginDate: today };
    });
  }, [completeMission]);

  const setUsername = useCallback((name) => {
    setGameState(prev => ({
      ...prev,
      username: name,
      joinedAt: prev.joinedAt || Date.now(),
    }));
  }, []);

  const updateLeaderboardRank = useCallback((rank) => {
    setGameState(prev => ({ ...prev, leaderboardRank: rank }));
  }, []);

  const isMissionAvailable = useCallback((missionId) => {
    const mission = MISSIONS.find(m => m.id === missionId);
    if (!mission) return false;
    if (!mission.repeatable && gameState.completedMissions.includes(missionId)) return false;
    if (mission.repeatable) {
      const last = gameState.missionLastCompleted[missionId];
      if (last && (Date.now() - last) < mission.cooldown) return false;
    }
    return true;
  }, [gameState]);

  const resetGame = useCallback(() => {
    setGameState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <GameContext.Provider value={{
      gameState,
      showAchievement,
      showLevelUp,
      showMissionComplete,
      showNFTUnlock,
      setShowAchievement,
      setShowLevelUp,
      setShowMissionComplete,
      setShowNFTUnlock,
      addXP,
      completeMission,
      unlockAchievement,
      addNFTBadge,
      addTxToHistory,
      updateLoginStreak,
      setUsername,
      updateLeaderboardRank,
      isMissionAvailable,
      resetGame,
      getCurrentLevel,
      getXPForNextLevel,
      getXPProgress,
    }}>
      {children}
    </GameContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
