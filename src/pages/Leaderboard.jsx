import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';
import './Leaderboard.css';

// Simulated leaderboard data (in production, fetched from on-chain contract)
const generateLeaderboard = (userAddress, userXP, userLevel) => {
  const bots = [
    { address: '0x1a2b3c4d5e6f7890abcd', username: 'ArcPioneer_X', xp: 15420, level: 16, badges: 8 },
    { address: '0x2b3c4d5e6f7890abcd12', username: 'NeonQuester', xp: 12800, level: 13, badges: 6 },
    { address: '0x3c4d5e6f7890abcd1234', username: 'CryptoSage_Arc', xp: 10500, level: 11, badges: 5 },
    { address: '0x4d5e6f7890abcd123456', username: 'BlockchainBard', xp: 9200, level: 10, badges: 4 },
    { address: '0x5e6f7890abcd12345678', username: 'ArcDevl3r', xp: 7800, level: 8, badges: 4 },
    { address: '0x6f7890abcd1234567890', username: 'TestnetHero', xp: 6300, level: 7, badges: 3 },
    { address: '0x7890abcd123456789012', username: 'ZeroToHero_Arc', xp: 5100, level: 6, badges: 3 },
    { address: '0x890abcd12345678901ab', username: 'Web3Wanderer', xp: 3800, level: 4, badges: 2 },
    { address: '0x90abcd12345678901abc', username: 'ChainExplorer99', xp: 2500, level: 3, badges: 1 },
    { address: '0xa0abcd12345678901abd', username: 'ArcNewbie', xp: 1200, level: 2, badges: 1 },
  ];

  if (userAddress) {
    const userEntry = {
      address: userAddress,
      username: 'You',
      xp: userXP,
      level: userLevel,
      badges: 0,
      isUser: true,
    };
    const all = [...bots, userEntry].sort((a, b) => b.xp - a.xp);
    return all.map((p, i) => ({ ...p, rank: i + 1 }));
  }
  return bots.map((p, i) => ({ ...p, rank: i + 1 }));
};

function RankBadge({ rank }) {
  if (rank === 1) return <span className="rank-badge rank-1">🥇</span>;
  if (rank === 2) return <span className="rank-badge rank-2">🥈</span>;
  if (rank === 3) return <span className="rank-badge rank-3">🥉</span>;
  return <span className="rank-number">#{rank}</span>;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const { address } = useWallet();
  const { gameState } = useGame();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) navigate('/connect');
  }, [address, navigate]);

  useEffect(() => {
    // Simulate blockchain fetch
    const timer = setTimeout(() => {
      const data = generateLeaderboard(address, gameState.xp, gameState.level);
      setLeaderboard(data);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [address, gameState.xp, gameState.level]);

  const userRank = leaderboard.find(p => p.isUser)?.rank;

  return (
    <div className="leaderboard-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Onchain <span className="gradient-text">Leaderboard</span></h1>
            <p className="page-subtitle">Rankings updated from Arc Testnet blockchain</p>
          </div>
          {userRank && (
            <div className="your-rank-card glass-card">
              <span className="your-rank-label">Your Rank</span>
              <span className="your-rank-value neon-text-blue">#{userRank}</span>
              <span className="your-rank-xp">{gameState.xp.toLocaleString()} XP</span>
            </div>
          )}
        </motion.div>

        {/* Top 3 Podium */}
        {!loading && (
          <motion.div
            className="podium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* 2nd place */}
            {leaderboard[1] && (
              <div className="podium-item podium-2">
                <div className="podium-avatar">🥈</div>
                <div className="podium-name">{leaderboard[1].username}</div>
                <div className="podium-xp">{leaderboard[1].xp.toLocaleString()} XP</div>
                <div className="podium-block podium-block-2">2</div>
              </div>
            )}
            {/* 1st place */}
            {leaderboard[0] && (
              <div className="podium-item podium-1">
                <div className="podium-crown">👑</div>
                <div className="podium-avatar">🥇</div>
                <div className="podium-name">{leaderboard[0].username}</div>
                <div className="podium-xp">{leaderboard[0].xp.toLocaleString()} XP</div>
                <div className="podium-block podium-block-1">1</div>
              </div>
            )}
            {/* 3rd place */}
            {leaderboard[2] && (
              <div className="podium-item podium-3">
                <div className="podium-avatar">🥉</div>
                <div className="podium-name">{leaderboard[2].username}</div>
                <div className="podium-xp">{leaderboard[2].xp.toLocaleString()} XP</div>
                <div className="podium-block podium-block-3">3</div>
              </div>
            )}
          </motion.div>
        )}

        {/* Table */}
        <motion.div
          className="leaderboard-table glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="lb-table-header">
            <span className="lb-col-rank">Rank</span>
            <span className="lb-col-player">Player</span>
            <span className="lb-col-level">Level</span>
            <span className="lb-col-xp">XP</span>
            <span className="lb-col-badges">Badges</span>
          </div>

          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="lb-row-skeleton">
                <div className="skeleton" style={{ height: 52, borderRadius: 8 }} />
              </div>
            ))
          ) : (
            leaderboard.map((player, i) => (
              <motion.div
                key={player.address}
                className={`lb-row ${player.isUser ? 'lb-row-user' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="lb-col-rank">
                  <RankBadge rank={player.rank} />
                </div>
                <div className="lb-col-player">
                  <div className="lb-player-avatar">
                    {player.isUser ? '🦊' : player.username.charAt(0)}
                  </div>
                  <div className="lb-player-info">
                    <span className="lb-player-name">
                      {player.username}
                      {player.isUser && <span className="you-tag">YOU</span>}
                    </span>
                    <span className="lb-player-addr">
                      {player.address.slice(0, 8)}...{player.address.slice(-6)}
                    </span>
                  </div>
                </div>
                <div className="lb-col-level">
                  <span className="lb-level-badge">Lv {player.level}</span>
                </div>
                <div className="lb-col-xp">
                  <span className="lb-xp">{player.xp.toLocaleString()}</span>
                </div>
                <div className="lb-col-badges">
                  <span className="lb-badges">{'🏆'.repeat(Math.min(player.badges, 5))}</span>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <p className="lb-disclaimer">
          🔗 Rankings are determined by XP stored on Arc Testnet. Data refreshes every block.
        </p>
      </div>
    </div>
  );
}
