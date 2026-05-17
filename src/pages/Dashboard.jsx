import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';
import { ZONES, MISSIONS, ARC_TESTNET } from '../constants/arcChain';
import './Dashboard.css';

function StatCard({ icon, label, value, color, suffix = '' }) {
  return (
    <motion.div
      className="stat-card glass-card"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 400 }}
    >
      <div className="stat-card-icon" style={{ color }}>{icon}</div>
      <div className="stat-card-info">
        <span className="stat-card-value" style={{ color }}>
          {value}<span className="stat-suffix">{suffix}</span>
        </span>
        <span className="stat-card-label">{label}</span>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { address, balance, isOnArcTestnet, switchToArcTestnet, walletType, isReconnecting } = useWallet();
  const { gameState, getXPProgress, getXPForNextLevel, updateLoginStreak, isMissionAvailable } = useGame();

  useEffect(() => {
    if (!address && !isReconnecting) navigate('/connect');
  }, [address, isReconnecting, navigate]);

  useEffect(() => {
    updateLoginStreak();
  }, [updateLoginStreak]);

  const xpProgress = getXPProgress(gameState.xp);
  const nextLevelXP = getXPForNextLevel(gameState.xp);

  const completedCount = gameState.completedMissions.length;
  const availableMissions = MISSIONS.filter(m => isMissionAvailable(m.id));

  const walletIcons = { metamask: '🦊', coinbase: '🔵', walletconnect: '🔗' };
  const shortAddr = address
    ? `${address.slice(0, 8)}...${address.slice(-6)}`
    : '';

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>
              Welcome back,{' '}
              <span className="gradient-text">
                {gameState.username || shortAddr}
              </span>
            </h1>
            <p className="dashboard-subtitle">
              {availableMissions.length > 0
                ? `${availableMissions.length} missions available · Keep your streak alive!`
                : 'All missions completed! Check back daily.'}
            </p>
          </div>

          {!isOnArcTestnet && (
            <motion.button
              className="switch-network-banner"
              onClick={switchToArcTestnet}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              ⚠️ Switch to Arc Testnet to play
            </motion.button>
          )}
        </motion.div>

        {/* Player Profile Card */}
        <motion.div
          className="profile-banner glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="profile-avatar">
            <div className="avatar-ring" />
            <span className="avatar-emoji">{walletIcons[walletType] || '👤'}</span>
            <div className="avatar-level-badge">{gameState.level}</div>
          </div>

          <div className="profile-info">
            <div className="profile-top">
              <span className="profile-name">{gameState.username || shortAddr}</span>
              <div className="profile-badges">
                <span className={`status-badge ${isOnArcTestnet ? 'status-connected' : 'status-warning'}`}>
                  <span className="glow-dot" style={{ background: isOnArcTestnet ? 'var(--neon-green)' : 'var(--neon-gold)' }} />
                  {isOnArcTestnet ? ARC_TESTNET.chainName : 'Wrong Network'}
                </span>
                <span className="tag tag-blue">Lv {gameState.level}</span>
              </div>
            </div>

            <div className="profile-xp-section">
              <div className="xp-label-row">
                <span className="xp-label">XP Progress</span>
                <span className="xp-value">{gameState.xp.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</span>
              </div>
              <div className="progress-bar profile-progress">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpProgress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <div className="xp-label-row">
                <span className="xp-sublabel">{xpProgress.toFixed(1)}% to Level {gameState.level + 1}</span>
                <span className="xp-sublabel">🔥 {gameState.loginStreak} day streak</span>
              </div>
            </div>
          </div>

          <div className="profile-wallet-info">
            <div className="wallet-detail">
              <span className="wallet-detail-label">Balance</span>
              <span className="wallet-detail-value neon-text-blue">{parseFloat(balance).toFixed(4)} ARC</span>
            </div>
            <div className="wallet-detail">
              <span className="wallet-detail-label">Quests Done</span>
              <span className="wallet-detail-value">{completedCount}</span>
            </div>
            <div className="wallet-detail">
              <span className="wallet-detail-label">NFT Badges</span>
              <span className="wallet-detail-value">{gameState.nftBadges.length}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="stats-row">
          {[
            { icon: '⭐', label: 'Total XP', value: gameState.xp.toLocaleString(), color: 'var(--neon-gold)' },
            { icon: '⚡', label: 'Level', value: gameState.level, color: 'var(--neon-blue)' },
            { icon: '✅', label: 'Missions', value: completedCount, color: 'var(--neon-green)' },
            { icon: '🔥', label: 'Streak', value: gameState.loginStreak, color: 'var(--neon-pink)', suffix: 'd' },
            { icon: '🏆', label: 'NFT Badges', value: gameState.nftBadges.length, color: 'var(--neon-purple)' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="dashboard-grid">
          {/* Zone Map */}
          <motion.div
            className="dashboard-card glass-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card-header">
              <h3>Zone Map</h3>
              <span className="tag tag-blue">{gameState.unlockedZones.length}/{ZONES.length} Unlocked</span>
            </div>
            <div className="zone-grid">
              {ZONES.map(zone => {
                const isUnlocked = gameState.unlockedZones.includes(zone.id);
                return (
                  <motion.div
                    key={zone.id}
                    className={`zone-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                    style={isUnlocked ? { borderColor: `${zone.color}40` } : {}}
                    whileHover={isUnlocked ? { scale: 1.04 } : {}}
                  >
                    <div
                      className="zone-icon"
                      style={isUnlocked ? { background: `${zone.color}20` } : {}}
                    >
                      {isUnlocked ? zone.icon : '🔒'}
                    </div>
                    <span className="zone-name">{zone.name}</span>
                    {!isUnlocked && (
                      <span className="zone-unlock-req">Lv {zone.unlockLevel}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Active Missions */}
          <motion.div
            className="dashboard-card glass-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="card-header">
              <h3>Active Missions</h3>
              <button
                className="btn-secondary btn-sm"
                onClick={() => navigate('/missions')}
              >
                View All →
              </button>
            </div>
            <div className="mission-list">
              {availableMissions.slice(0, 5).map(mission => (
                <div key={mission.id} className="mission-item">
                  <div className="mission-item-icon">{mission.icon}</div>
                  <div className="mission-item-info">
                    <span className="mission-item-name">{mission.title}</span>
                    <span className="mission-item-desc">{mission.description}</span>
                  </div>
                  <div className="mission-item-xp">+{mission.xp} XP</div>
                </div>
              ))}
              {availableMissions.length === 0 && (
                <div className="empty-state">
                  <span>🎉</span>
                  <p>All missions complete! Check back tomorrow.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="dashboard-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="activity-list">
              {gameState.txHistory.slice(0, 5).map((tx, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-dot" />
                  <div className="activity-info">
                    <span className="activity-type">{tx.type || 'Transaction'}</span>
                    {tx.hash ? (
                      <a
                        href={`${ARC_TESTNET.blockExplorerUrls[0]}/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="activity-hash-link"
                      >
                        {`${tx.hash.slice(0, 10)}...${tx.hash.slice(-6)}`} ↗
                      </a>
                    ) : (
                      <span className="activity-hash">Pending</span>
                    )}
                  </div>
                  <span className="activity-time">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {gameState.txHistory.length === 0 && (
                <div className="empty-state">
                  <span>📡</span>
                  <p>No transactions yet. Start a mission!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="dashboard-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-actions">
              <button className="quick-action" onClick={() => navigate('/missions')}>
                <span>⚡</span> Start Mission
              </button>
              <button
                className="quick-action"
                onClick={() => window.open(ARC_TESTNET.faucetUrl, '_blank')}
              >
                <span>💧</span> Get Test Tokens
              </button>
              <button className="quick-action" onClick={() => navigate('/nft-gallery')}>
                <span>🏆</span> View Badges
              </button>
              <button className="quick-action" onClick={() => navigate('/leaderboard')}>
                <span>📊</span> Leaderboard
              </button>
              <button
                className="quick-action"
                onClick={() => window.open(ARC_TESTNET.blockExplorerUrls[0], '_blank')}
              >
                <span>🔍</span> Explorer
              </button>
              <button className="quick-action" onClick={() => navigate('/ecosystem')}>
                <span>🌐</span> Ecosystem
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
