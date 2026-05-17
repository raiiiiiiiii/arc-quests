import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';
import { ACHIEVEMENTS } from '../constants/arcChain';
import { ARC_TESTNET } from '../constants/arcChain';
import './NFTGallery.css';

const rarityConfig = {
  common: { label: 'Common', color: '#888', gradient: 'linear-gradient(135deg, #555, #888)' },
  uncommon: { label: 'Uncommon', color: '#00cc66', gradient: 'linear-gradient(135deg, #006633, #00cc66)' },
  rare: { label: 'Rare', color: '#4488ff', gradient: 'linear-gradient(135deg, #002299, #4488ff)' },
  epic: { label: 'Epic', color: '#aa44ff', gradient: 'linear-gradient(135deg, #550099, #aa44ff)' },
  legendary: { label: 'Legendary', color: '#ffcc00', gradient: 'linear-gradient(135deg, #aa6600, #ffcc00)' },
};

function AchievementCard({ achievement, isUnlocked }) {
  const config = rarityConfig[achievement.rarity] || rarityConfig.common;
  return (
    <motion.div
      className={`achievement-card glass-card rarity-${achievement.rarity} ${!isUnlocked ? 'locked' : ''}`}
      whileHover={isUnlocked ? { scale: 1.03, y: -4 } : {}}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="achievement-glow"
        style={isUnlocked ? { background: `radial-gradient(circle at center, ${config.color}20, transparent)` } : {}}
      />
      <div
        className="achievement-icon-wrap"
        style={isUnlocked ? { background: `${config.color}18`, borderColor: `${config.color}40` } : {}}
      >
        <span className="achievement-emoji">{isUnlocked ? achievement.icon : '🔒'}</span>
        {isUnlocked && (
          <div className="achievement-sparkle" style={{ background: config.gradient }} />
        )}
      </div>
      <div className="achievement-info">
        <div
          className="achievement-rarity-tag"
          style={isUnlocked ? { color: config.color, borderColor: `${config.color}40` } : {}}
        >
          {config.label}
        </div>
        <h3 className="achievement-name">{isUnlocked ? achievement.name : '???'}</h3>
        <p className="achievement-desc">
          {isUnlocked ? achievement.description : 'Complete more missions to unlock'}
        </p>
      </div>
      {isUnlocked && (
        <div className="achievement-unlocked-badge">✓ Unlocked</div>
      )}
    </motion.div>
  );
}

function NFTBadgeCard({ badge }) {
  return (
    <motion.div
      className="nft-badge-card glass-card"
      whileHover={{ scale: 1.04, y: -4 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="nft-badge-glow" />
      <div className="nft-badge-icon-wrap">
        <span className="nft-badge-emoji">{badge.icon}</span>
      </div>
      <div className="nft-badge-info">
        <h3>{badge.name}</h3>
        <span className={`tag tag-${badge.rarity === 'rare' ? 'blue' : badge.rarity === 'epic' ? 'purple' : 'gold'}`}>
          {badge.rarity}
        </span>
        <p className="nft-badge-time">
          Minted {new Date(badge.mintedAt).toLocaleDateString()}
        </p>
        {badge.txHash && (
          <a
            href={`${ARC_TESTNET.blockExplorerUrls[0]}/tx/${badge.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="nft-explorer-link"
          >
            View on Explorer →
          </a>
        )}
      </div>
      <div className="nft-badge-shine" />
    </motion.div>
  );
}

export default function NFTGallery() {
  const navigate = useNavigate();
  const { address, isReconnecting } = useWallet();
  const { gameState } = useGame();

  useEffect(() => {
    if (!address && !isReconnecting) navigate('/connect');
  }, [address, isReconnecting, navigate]);

  const unlockedAchievements = gameState.achievements;
  const unlockedCount = unlockedAchievements.length;

  return (
    <div className="nft-gallery-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>NFT Achievement <span className="gradient-text">Gallery</span></h1>
            <p className="page-subtitle">
              {unlockedCount} of {ACHIEVEMENTS.length} achievements unlocked ·{' '}
              {gameState.nftBadges.length} NFT badges minted
            </p>
          </div>

          {/* Stats */}
          <div className="gallery-stats glass-card">
            <div className="gallery-stat">
              <span className="gs-value neon-text-blue">{unlockedCount}</span>
              <span className="gs-label">Achievements</span>
            </div>
            <div className="gs-divider" />
            <div className="gallery-stat">
              <span className="gs-value" style={{ color: 'var(--neon-purple)' }}>{gameState.nftBadges.length}</span>
              <span className="gs-label">NFT Badges</span>
            </div>
            <div className="gs-divider" />
            <div className="gallery-stat">
              <span className="gs-value" style={{ color: 'var(--neon-gold)' }}>
                {Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)}%
              </span>
              <span className="gs-label">Completion</span>
            </div>
          </div>
        </motion.div>

        {/* NFT Badges Section */}
        {gameState.nftBadges.length > 0 && (
          <section className="gallery-section">
            <div className="gallery-section-header">
              <h2>🏆 Minted NFT Badges</h2>
              <span className="tag tag-gold">{gameState.nftBadges.length} Minted</span>
            </div>
            <div className="nft-badges-grid">
              {gameState.nftBadges.map(badge => (
                <NFTBadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        <section className="gallery-section">
          <div className="gallery-section-header">
            <h2>🎖️ Achievement Collection</h2>
            <span className="tag tag-blue">{unlockedCount}/{ACHIEVEMENTS.length}</span>
          </div>

          <div className="achievements-grid">
            {ACHIEVEMENTS.map((achievement, i) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AchievementCard
                  achievement={achievement}
                  isUnlocked={unlockedAchievements.includes(achievement.id)}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Empty state */}
        {gameState.nftBadges.length === 0 && unlockedCount === 0 && (
          <motion.div
            className="gallery-empty glass-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="gallery-empty-icon">🎨</div>
            <h3>No Badges Yet</h3>
            <p>Complete missions to unlock achievements and mint NFT badges</p>
            <button className="btn-primary" onClick={() => navigate('/missions')}>
              ⚡ Start Missions
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
