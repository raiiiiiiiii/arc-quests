import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';
import { ZONES, ARC_TESTNET } from '../constants/arcChain';
import './Dashboard.css';

// Node Positions on the Map (0-100 percentages)
const MAP_LAYOUT = [
  { id: 1, x: 15, y: 50 }, // Genesis
  { id: 2, x: 35, y: 25 }, // Token
  { id: 3, x: 55, y: 45 }, // Contract
  { id: 4, x: 75, y: 20 }, // DeFi
  { id: 5, x: 85, y: 65 }, // NFT
  { id: 6, x: 50, y: 85 }, // Summit
];

// Final Boss Node
const BOSS_NODE = { id: 999, name: 'Arc Core (Final Boss)', icon: '👹', x: 50, y: 50 };

export default function Dashboard() {
  const navigate = useNavigate();
  const { address, balance, isOnArcTestnet, walletType, isReconnecting } = useWallet();
  const { gameState, getXPProgress, getXPForNextLevel, updateLoginStreak } = useGame();

  const [transitioningTo, setTransitioningTo] = useState(null);
  const [termLog, setTermLog] = useState('Initializing connection to Arc Testnet...');

  useEffect(() => {
    if (!address && !isReconnecting) navigate('/connect');
    updateLoginStreak();
  }, [address, isReconnecting, navigate, updateLoginStreak]);

  useEffect(() => {
    if (gameState.txHistory.length > 0) {
      const lastTx = gameState.txHistory[0];
      setTermLog(`[TX_LOG] ${lastTx.type || 'Mission'} executed ${lastTx.hash ? `(Hash: ${lastTx.hash.slice(0, 10)}...)` : 'successfully.'}`);
    } else {
      setTermLog(`[SYSTEM] Connection secure. Welcome Agent ${gameState.username || address?.slice(0, 6) || 'Unknown'}.`);
    }
  }, [gameState.txHistory, gameState.username, address]);

  if (!address) return null;

  const xpProgress = getXPProgress(gameState.xp);
  const nextLevelXP = getXPForNextLevel(gameState.xp);
  const walletIcons = { metamask: '🦊', coinbase: '🔵', walletconnect: '🔗', sandbox: '🎮' };
  
  const allZonesCompleted = gameState.unlockedZones.length >= ZONES.length;

  const handleZoneClick = (zone) => {
    const isUnlocked = gameState.unlockedZones.includes(zone.id) || (zone.id === 999 && allZonesCompleted);
    
    if (isUnlocked) {
      setTransitioningTo(zone);
      setTimeout(() => {
        navigate('/missions');
      }, 2500); // 2.5s cinematic transition
    }
  };

  return (
    <div className="world-dashboard">
      {/* ── CINEMATIC TRANSITION OVERLAY ── */}
      <AnimatePresence>
        {transitioningTo && (
          <motion.div
            className="zone-transition-overlay scanlines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="transition-content">
              <motion.div
                className="transition-icon"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, delay: 0.2 }}
              >
                {transitioningTo.icon}
              </motion.div>
              <motion.h1
                className="transition-title"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {transitioningTo.name}
              </motion.h1>
              <motion.div
                className="transition-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                INITIALIZING COMBAT PROTOCOLS...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GAME HUD ── */}
      <div className="game-hud">
        <div className="hud-left hud-panel">
          <div className="hud-avatar">
            {walletIcons[walletType] || '👤'}
            <div className="hud-level">{gameState.level}</div>
          </div>
          <div className="hud-player-info">
            <span className="hud-player-name">{gameState.username || `${address.slice(0, 8)}...`}</span>
            <div className="hud-xp-bar-container">
              <div className="hud-xp-fill" style={{ width: `${xpProgress}%` }} />
            </div>
            <div className="hud-xp-text">
              <span>{gameState.xp.toLocaleString()} XP</span>
              <span>NEXT: {nextLevelXP.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="hud-right">
          <div className="hud-stat">
            <span className="hud-stat-label">Balance</span>
            <span className="hud-stat-value blue">{parseFloat(balance).toFixed(2)} USDC</span>
          </div>
          <div className="hud-stat">
            <span className="hud-stat-label">Quests</span>
            <span className="hud-stat-value gold">{gameState.completedMissions.length}</span>
          </div>
          <div className="hud-stat">
            <span className="hud-stat-label">Network</span>
            <span className={`hud-stat-value ${isOnArcTestnet ? 'green' : 'pink'}`} style={{ fontSize: '0.9rem', marginTop: '4px' }}>
              {isOnArcTestnet ? '✓ CONNECTED' : '⚠ WRONG NET'}
            </span>
          </div>
        </div>
      </div>

      {/* ── WORLD MAP ── */}
      <motion.div
        className="world-map-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="map-grid-bg" />
        
        <div className="map-interactive-area">
          {/* SVG Paths connecting nodes */}
          <svg className="map-path-svg" preserveAspectRatio="none">
            {MAP_LAYOUT.map((pos, i) => {
              if (i === MAP_LAYOUT.length - 1) return null;
              const next = MAP_LAYOUT[i + 1];
              const isUnlocked = gameState.unlockedZones.includes(ZONES[i].id) && gameState.unlockedZones.includes(ZONES[i+1]?.id);
              return (
                <line
                  key={`line-${i}`}
                  x1={`${pos.x}%`} y1={`${pos.y}%`}
                  x2={`${next.x}%`} y2={`${next.y}%`}
                  className={`map-path-line ${isUnlocked ? 'active' : ''}`}
                />
              );
            })}
            
            {/* Path to Boss */}
            {allZonesCompleted && (
              <>
                <line x1={`${MAP_LAYOUT[2].x}%`} y1={`${MAP_LAYOUT[2].y}%`} x2="50%" y2="50%" className="map-path-line active" stroke="#ff0055" />
                <line x1={`${MAP_LAYOUT[5].x}%`} y1={`${MAP_LAYOUT[5].y}%`} x2="50%" y2="50%" className="map-path-line active" stroke="#ff0055" />
              </>
            )}
          </svg>

          {/* Standard Zone Nodes */}
          {ZONES.map((zone, i) => {
            const pos = MAP_LAYOUT[i];
            const isUnlocked = gameState.unlockedZones.includes(zone.id);
            const isCompleted = isUnlocked && gameState.level > zone.unlockLevel + 4; // Arbitrary logic for "completed" look
            
            return (
              <motion.div
                key={zone.id}
                className={`map-node ${isUnlocked ? (isCompleted ? 'completed' : 'unlocked') : 'locked'}`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => handleZoneClick(zone)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={isUnlocked ? { zIndex: 20 } : {}}
              >
                {isUnlocked && <div className="node-ring" />}
                <div className="node-icon-wrapper">
                  {isUnlocked ? zone.icon : '🔒'}
                </div>
                <div className="node-label">{zone.name}</div>
                {!isUnlocked && <div className="node-level-req">Requires Lv {zone.unlockLevel}</div>}
              </motion.div>
            );
          })}

          {/* Final Boss Node */}
          <motion.div
            className={`map-node ${allZonesCompleted ? 'boss unlocked' : 'locked'}`}
            style={{ left: '50%', top: '50%' }}
            onClick={() => handleZoneClick(BOSS_NODE)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            whileHover={allZonesCompleted ? { zIndex: 20 } : {}}
          >
            {allZonesCompleted && <div className="node-ring" />}
            <div className="node-icon-wrapper" style={{ background: allZonesCompleted ? 'rgba(255,0,85,0.1)' : '' }}>
              {allZonesCompleted ? BOSS_NODE.icon : '❓'}
            </div>
            <div className="node-label">{allZonesCompleted ? BOSS_NODE.name : 'Unknown Signal'}</div>
            {!allZonesCompleted && <div className="node-level-req">Clear all zones</div>}
          </motion.div>

        </div>
      </motion.div>

      {/* ── TERMINAL LOG ── */}
      <div className="terminal-log">
        <span className="term-prefix">ARC_NEXUS@ROOT:~#</span>
        <span>{termLog}</span>
        <span className="term-cursor" />
      </div>
    </div>
  );
}
