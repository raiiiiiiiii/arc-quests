import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useWallet } from '../context/WalletContext';
import { ARC_TESTNET } from '../constants/arcChain';
import './GameModals.css';

// XP Particle Generator
function XPParticles({ count = 20 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generated = Array.from({ length: count }).map((_, i) => ({
      id: i,
      scale: Math.random() * 0.5 + 0.5,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400 - 100,
      rotate: Math.random() * 360,
      duration: 1.5 + Math.random()
    }));
    const timer = setTimeout(() => {
      setParticles(generated);
    }, 0);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <div className="xp-particles-container">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="xp-particle"
          initial={{ opacity: 1, scale: p.scale, x: 0, y: 0 }}
          animate={{
            opacity: [1, 1, 0],
            x: p.x,
            y: p.y,
            rotate: p.rotate
          }}
          transition={{ duration: p.duration, ease: 'easeOut' }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}

// Achievement popup
export function AchievementPopup() {
  const { showAchievement, setShowAchievement } = useGame();

  useEffect(() => {
    if (showAchievement) {
      const timer = setTimeout(() => setShowAchievement(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [showAchievement, setShowAchievement]);

  return (
    <AnimatePresence>
      {showAchievement && (
        <motion.div
          className="achievement-popup"
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="achievement-popup-glow" />
          <div className="achievement-popup-icon">{showAchievement.icon}</div>
          <div className="achievement-popup-content">
            <p className="achievement-popup-label">Achievement Unlocked!</p>
            <p className="achievement-popup-name">{showAchievement.name}</p>
            <p className="achievement-popup-desc">{showAchievement.description}</p>
          </div>
          <button
            className="achievement-popup-close"
            onClick={() => setShowAchievement(null)}
          >✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Level Up modal
export function LevelUpModal() {
  const { showLevelUp, setShowLevelUp } = useGame();

  return (
    <AnimatePresence>
      {showLevelUp && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLevelUp(null)}
        >
          <motion.div
            className="level-up-modal premium-glass"
            initial={{ opacity: 0, scale: 0.1, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={e => e.stopPropagation()}
          >
            <XPParticles count={50} />
            <div className="level-up-rings">
              <motion.div className="ring ring-1" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} />
              <motion.div className="ring ring-2" animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} />
              <motion.div className="ring ring-3" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
            </div>
            <div className="level-up-content">
              <motion.p 
                className="level-up-label gradient-text"
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              >
                LEVEL UP!
              </motion.p>
              <motion.div 
                className="level-up-number neon-text-blue"
                initial={{ scale: 0 }} animate={{ scale: [1.5, 1] }} transition={{ delay: 0.5, type: 'spring' }}
              >
                {showLevelUp}
              </motion.div>
              <motion.p className="level-up-subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                You've reached Level {showLevelUp}!
              </motion.p>
              <motion.button
                className="btn-primary btn-lg level-up-btn"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                onClick={() => setShowLevelUp(null)}
              >
                Continue Quest ⚡
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Mission Complete popup
export function MissionCompletePopup() {
  const { showMissionComplete, setShowMissionComplete } = useGame();

  useEffect(() => {
    if (showMissionComplete) {
      const timer = setTimeout(() => setShowMissionComplete(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [showMissionComplete, setShowMissionComplete]);

  return (
    <AnimatePresence>
      {showMissionComplete && (
        <motion.div
          className="mission-complete-popup premium-glass"
          initial={{ opacity: 0, scale: 0.3, y: 100, rotateX: 45 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -100 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <XPParticles count={15} />
          <motion.div 
            className="mc-icon glow-pulse"
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            {showMissionComplete.icon}
          </motion.div>
          <div className="mc-content">
            <p className="mc-label gradient-text">MISSION COMPLETE</p>
            <p className="mc-title">{showMissionComplete.title}</p>
            <motion.p 
              className="mc-xp neon-text-green"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              +{showMissionComplete.xp} XP
            </motion.p>
          </div>
          <button
            className="mc-close"
            onClick={() => setShowMissionComplete(null)}
          >✕</button>
          <motion.div 
            className="mc-progress" 
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Transaction success popup (standalone)
export function TxSuccessPopup({ tx, onClose }) {
  const { walletType } = useWallet();
  if (!tx) return null;
  
  const explorerLink = walletType === 'sandbox' ? `/explorer/tx/${tx.hash}` : `${ARC_TESTNET.blockExplorerUrls[0]}/tx/${tx.hash}`;
  const targetAttr = walletType === 'sandbox' ? '_self' : '_blank';
  
  return (
    <AnimatePresence>
      <motion.div
        className="tx-success-popup"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="tx-success-icon">✅</div>
        <div className="tx-content">
          <p className="tx-label">Transaction Confirmed!</p>
          <p className="tx-hash">
            {tx.hash?.slice(0, 10)}...{tx.hash?.slice(-8)}
          </p>
          <a
            href={explorerLink}
            target={targetAttr}
            rel="noopener noreferrer"
            className="tx-explorer-link"
          >
            View on Explorer →
          </a>
        </div>
        <button className="tx-close" onClick={onClose}>✕</button>
      </motion.div>
    </AnimatePresence>
  );
}

// NFT Unlock Sequence
export function NFTUnlockModal() {
  const { showNFTUnlock, setShowNFTUnlock } = useGame();

  return (
    <AnimatePresence>
      {showNFTUnlock && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowNFTUnlock(null)}
        >
          <motion.div
            className="nft-unlock-modal premium-glass"
            initial={{ opacity: 0, scale: 0.1, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            onClick={e => e.stopPropagation()}
          >
            <XPParticles count={40} />
            <motion.div 
              className="nft-unlock-card"
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 1.5, type: 'spring', delay: 0.2 }}
            >
              <div className="nft-unlock-icon glow-pulse">{showNFTUnlock.icon}</div>
            </motion.div>
            <div className="nft-unlock-content">
              <motion.p className="nft-unlock-label gradient-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>NEW BADGE MINTED</motion.p>
              <motion.h2 className="nft-unlock-title" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }}>{showNFTUnlock.name}</motion.h2>
              <motion.p className="nft-unlock-rarity neon-text-purple" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>Rarity: {showNFTUnlock.rarity.toUpperCase()}</motion.p>
              <motion.button
                className="btn-primary btn-lg level-up-btn"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                onClick={() => setShowNFTUnlock(null)}
              >
                Claim to Wallet 💎
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
