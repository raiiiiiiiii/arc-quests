import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';
import { MISSIONS, ZONES, ARC_TESTNET, CONTRACTS } from '../constants/arcChain';
import { ARC_QUEST_ABI } from '../contracts/abis';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import './Missions.css';

function MissionCard({ mission, isCompleted, isAvailable, isOnCooldown, cooldownText, onStart, loading }) {
  const rarityMap = { onchain: 'blue', offchain: 'purple' };
  return (
    <motion.div
      className={`mission-card glass-card ${isCompleted && !mission.repeatable ? 'completed' : ''} ${!isAvailable ? 'unavailable' : ''}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="mission-card-header">
        <div className="mission-big-icon">{mission.icon}</div>
        <div className="mission-tags">
          <span className={`tag tag-${rarityMap[mission.type]}`}>
            {mission.type === 'onchain' ? '⛓️ Onchain' : '🎮 Offchain'}
          </span>
          {mission.repeatable && <span className="tag tag-green">Daily</span>}
          {isCompleted && !mission.repeatable && <span className="tag tag-gold">✅ Done</span>}
        </div>
      </div>

      <div className="mission-card-body">
        <h3>{mission.title}</h3>
        <p>{mission.description}</p>
      </div>

      <div className="mission-card-footer">
        <div className="mission-reward">
          <span className="reward-xp">+{mission.xp} XP</span>
          <span className="reward-zone">Zone {mission.zone}</span>
        </div>

        {isCompleted && !mission.repeatable ? (
          <div className="mission-done-badge">✅ Completed</div>
        ) : isOnCooldown ? (
          <div className="mission-cooldown">⏳ {cooldownText}</div>
        ) : (
          <button
            className="btn-primary btn-sm mission-start-btn"
            onClick={() => onStart(mission)}
            disabled={loading === mission.id}
          >
            {loading === mission.id ? (
              <><div className="spinner-sm" /> Processing...</>
            ) : (
              <><span>⚡</span> Start Mission</>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function Missions() {
  const navigate = useNavigate();
  const { address, signer, provider, sendTransaction, updateBalance, isOnArcTestnet, switchToArcTestnet, walletType } = useWallet();
  const { gameState, completeMission, unlockAchievement, addNFTBadge, addTxToHistory, isMissionAvailable } = useGame();
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(null);
  const [txPopup, setTxPopup] = useState(null);

  useEffect(() => {
    if (!address) navigate('/connect');
  }, [address, navigate]);

  const getCooldownText = (mission) => {
    const last = gameState.missionLastCompleted[mission.id];
    if (!last) return '';
    // eslint-disable-next-line react-hooks/purity
    const remaining = mission.cooldown - (Date.now() - last);
    if (remaining <= 0) return '';
    const hours = Math.floor(remaining / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleMission = async (mission) => {
    if (!isOnArcTestnet) {
      const switched = await switchToArcTestnet();
      if (!switched) return;
    }

    setLoading(mission.id);

    try {
      if (mission.type === 'onchain') {
        await handleOnchainMission(mission);
      } else {
        await handleOffchainMission(mission);
      }
    } finally {
      setLoading(null);
    }
  };

  const getContract = () => {
    if (!signer) return null;
    return new ethers.Contract(CONTRACTS.ARC_QUEST, ARC_QUEST_ABI, signer);
  };

  const handleOnchainMission = async (mission) => {
    const contract = getContract();
    const isSandbox = walletType === 'sandbox';

    if (mission.id === 'first_tx' || mission.id === 'verify_tx') {
      const receipt = await sendTransaction(address, '0.001');
      if (receipt) {
        completeMission(mission.id);
        if (mission.id === 'first_tx') unlockAchievement('chain_starter');
        addTxToHistory({ hash: receipt.hash, type: mission.title });
        setTxPopup({ hash: receipt.hash });
        setTimeout(() => setTxPopup(null), 6000);
      }
    } else if (mission.id === 'store_xp' || mission.id === 'smart_contract') {
      if (isSandbox) {
        const mockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
        toast.loading('Calling ArcQuest Contract...', { id: 'tx' });
        setTimeout(async () => {
          toast.success(
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>Contract Call Confirmed! (Sandbox)</span>
              <a href={`${ARC_TESTNET.blockExplorerUrls[0]}/tx/${mockHash}`} style={{ color: '#00d4ff', fontSize: '0.8rem', textDecoration: 'underline' }}>View on Explorer ↗</a>
            </div>, { id: 'tx', duration: 8000 }
          );
          completeMission(mission.id);
          if (mission.id === 'smart_contract') unlockAchievement('contract_caller');
          addTxToHistory({ hash: mockHash, type: mission.title });
          setTxPopup({ hash: mockHash });
          setTimeout(() => setTxPopup(null), 6000);
          
          const currentBal = parseFloat(localStorage.getItem('arc_sandbox_balance') || '100.0');
          localStorage.setItem('arc_sandbox_balance', Math.max(0, currentBal - 0.002).toFixed(4));
          await updateBalance(provider, address);
        }, 1200);
        return;
      }

      if (!contract) return;
      try {
        const tx = await contract.completeQuest(mission.id, mission.xp);
        toast.loading('Calling ArcQuest Contract...', { id: 'tx' });
        const receipt = await tx.wait();
        toast.success(
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>Contract Call Confirmed!</span>
            <a href={`${ARC_TESTNET.blockExplorerUrls[0]}/tx/${receipt.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff', fontSize: '0.8rem', textDecoration: 'underline' }}>View on Explorer ↗</a>
          </div>, { id: 'tx', duration: 8000 }
        );
        completeMission(mission.id);
        if (mission.id === 'smart_contract') unlockAchievement('contract_caller');
        addTxToHistory({ hash: receipt.hash, type: mission.title });
        setTxPopup({ hash: receipt.hash });
        setTimeout(() => setTxPopup(null), 6000);
        await updateBalance(provider, address);
      } catch (err) {
        if (err.code === 4001 || err.info?.error?.code === 4001) toast.error('Transaction rejected', { id: 'tx' });
        else toast.error('Transaction Failed', { id: 'tx' });
      }
    } else if (mission.id === 'mint_badge') {
      if (isSandbox) {
        const mockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
        toast.loading('Minting NFT Badge...', { id: 'tx' });
        setTimeout(async () => {
          toast.success(
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>NFT Minted! (Sandbox)</span>
              <a href={`${ARC_TESTNET.blockExplorerUrls[0]}/tx/${mockHash}`} style={{ color: '#00d4ff', fontSize: '0.8rem', textDecoration: 'underline' }}>View on Explorer ↗</a>
            </div>, { id: 'tx', duration: 8000 }
          );
          completeMission(mission.id);
          unlockAchievement('nft_minter');
          addNFTBadge({
            id: `badge_${Date.now()}`,
            name: 'Arc Pioneer',
            icon: '🏆',
            rarity: 'rare',
            txHash: mockHash,
            mintedAt: Date.now(),
          });
          addTxToHistory({ hash: mockHash, type: 'NFT Badge Minted' });
          setTxPopup({ hash: mockHash });
          setTimeout(() => setTxPopup(null), 6000);
          
          const currentBal = parseFloat(localStorage.getItem('arc_sandbox_balance') || '100.0');
          localStorage.setItem('arc_sandbox_balance', Math.max(0, currentBal - 0.005).toFixed(4));
          await updateBalance(provider, address);
        }, 1200);
        return;
      }

      if (!contract) return;
      try {
        const tx = await contract.mintBadge('rare', 'ipfs://QmDummyTokenURI');
        toast.loading('Minting NFT Badge...', { id: 'tx' });
        const receipt = await tx.wait();
        toast.success(
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>NFT Minted!</span>
            <a href={`${ARC_TESTNET.blockExplorerUrls[0]}/tx/${receipt.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff', fontSize: '0.8rem', textDecoration: 'underline' }}>View on Explorer ↗</a>
          </div>, { id: 'tx', duration: 8000 }
        );
        completeMission(mission.id);
        unlockAchievement('nft_minter');
        addNFTBadge({
          id: `badge_${Date.now()}`,
          name: 'Arc Pioneer',
          icon: '🏆',
          rarity: 'rare',
          txHash: receipt.hash,
          mintedAt: Date.now(),
        });
        addTxToHistory({ hash: receipt.hash, type: 'NFT Badge Minted' });
        setTxPopup({ hash: receipt.hash });
        setTimeout(() => setTxPopup(null), 6000);
        await updateBalance(provider, address);
      } catch (err) {
        if (err.code === 4001) toast.error('Transaction rejected', { id: 'tx' });
        else toast.error('Minting Failed', { id: 'tx' });
      }
    } else if (mission.id === 'leaderboard_update') {
      if (isSandbox) {
        const mockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
        toast.loading('Updating Leaderboard...', { id: 'tx' });
        setTimeout(async () => {
          toast.success(
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>Leaderboard Updated! (Sandbox)</span>
              <a href={`${ARC_TESTNET.blockExplorerUrls[0]}/tx/${mockHash}`} style={{ color: '#00d4ff', fontSize: '0.8rem', textDecoration: 'underline' }}>View on Explorer ↗</a>
            </div>, { id: 'tx', duration: 8000 }
          );
          completeMission(mission.id);
          addTxToHistory({ hash: mockHash, type: 'Leaderboard Updated' });
          setTxPopup({ hash: mockHash });
          setTimeout(() => setTxPopup(null), 6000);
          
          const currentBal = parseFloat(localStorage.getItem('arc_sandbox_balance') || '100.0');
          localStorage.setItem('arc_sandbox_balance', Math.max(0, currentBal - 0.001).toFixed(4));
          await updateBalance(provider, address);
        }, 1200);
        return;
      }

      if (!contract) return;
      try {
        const newRank = Math.floor(Math.random() * 100) + 1;
        const tx = await contract.updateLeaderboard(newRank);
        toast.loading('Updating Leaderboard...', { id: 'tx' });
        const receipt = await tx.wait();
        toast.success(
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>Leaderboard Updated!</span>
            <a href={`${ARC_TESTNET.blockExplorerUrls[0]}/tx/${receipt.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff', fontSize: '0.8rem', textDecoration: 'underline' }}>View on Explorer ↗</a>
          </div>, { id: 'tx', duration: 8000 }
        );
        completeMission(mission.id);
        addTxToHistory({ hash: receipt.hash, type: 'Leaderboard Updated' });
        setTxPopup({ hash: receipt.hash });
        setTimeout(() => setTxPopup(null), 6000);
        await updateBalance(provider, address);
      } catch (err) {
        if (err.code === 4001) toast.error('Transaction rejected', { id: 'tx' });
        else toast.error('Update Failed', { id: 'tx' });
      }
    } else if (mission.id === 'daily_login') {
      if (isSandbox) {
        const mockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
        toast.loading('Claiming Daily Reward...', { id: 'tx' });
        setTimeout(async () => {
          toast.success(
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>Reward Claimed! (Sandbox)</span>
              <a href={`${ARC_TESTNET.blockExplorerUrls[0]}/tx/${mockHash}`} style={{ color: '#00d4ff', fontSize: '0.8rem', textDecoration: 'underline' }}>View on Explorer ↗</a>
            </div>, { id: 'tx', duration: 8000 }
          );
          completeMission(mission.id);
          addTxToHistory({ hash: mockHash, type: 'Daily Reward Claimed' });
          setTxPopup({ hash: mockHash });
          setTimeout(() => setTxPopup(null), 6000);
          
          const currentBal = parseFloat(localStorage.getItem('arc_sandbox_balance') || '100.0');
          localStorage.setItem('arc_sandbox_balance', (currentBal + 5.0).toString());
          await updateBalance(provider, address);
        }, 1200);
        return;
      }

      if (!contract) return;
      try {
        const tx = await contract.claimDailyReward();
        toast.loading('Claiming Daily Reward...', { id: 'tx' });
        const receipt = await tx.wait();
        toast.success(
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>Reward Claimed!</span>
            <a href={`${ARC_TESTNET.blockExplorerUrls[0]}/tx/${receipt.hash}`} target="_blank" rel="noopener noreferrer" style={{ color: '#00d4ff', fontSize: '0.8rem', textDecoration: 'underline' }}>View on Explorer ↗</a>
          </div>, { id: 'tx', duration: 8000 }
        );
        completeMission(mission.id);
        addTxToHistory({ hash: receipt.hash, type: 'Daily Reward Claimed' });
        setTxPopup({ hash: receipt.hash });
        setTimeout(() => setTxPopup(null), 6000);
        await updateBalance(provider, address);
      } catch (err) {
        if (err.code === 4001) toast.error('Transaction rejected', { id: 'tx' });
        else toast.error('Claim Failed (Already claimed?)', { id: 'tx' });
      }
    } else {
      completeMission(mission.id);
    }
  };

  const handleOffchainMission = async (mission) => {
    if (mission.id === 'faucet_request') {
      window.open(ARC_TESTNET.faucetUrl, '_blank');
      setTimeout(() => {
        completeMission(mission.id);
        unlockAchievement('token_holder');
      }, 2000);
    } else if (mission.id === 'explore_ecosystem') {
      navigate('/ecosystem');
      setTimeout(() => completeMission(mission.id), 1000);
    } else {
      completeMission(mission.id);
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All Missions' },
    { id: 'available', label: 'Available' },
    { id: 'onchain', label: 'Onchain' },
    { id: 'daily', label: 'Daily' },
    { id: 'completed', label: 'Completed' },
  ];

  const filteredMissions = MISSIONS.filter(m => {
    if (filter === 'available') return isMissionAvailable(m.id);
    if (filter === 'onchain') return m.type === 'onchain';
    if (filter === 'daily') return m.repeatable;
    if (filter === 'completed') return gameState.completedMissions.includes(m.id) && !m.repeatable;
    return true;
  });

  return (
    <div className="missions-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1>Mission <span className="gradient-text">Center</span></h1>
            <p className="page-subtitle">
              {gameState.completedMissions.length} of {MISSIONS.filter(m => !m.repeatable).length} missions complete ·{' '}
              Total XP: {gameState.xp.toLocaleString()}
            </p>
          </div>

          {/* Overall progress */}
          <div className="missions-progress-card glass-card">
            <div className="missions-progress-label">
              <span>Quest Progress</span>
              <span>{Math.round((gameState.completedMissions.length / MISSIONS.filter(m => !m.repeatable).length) * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(gameState.completedMissions.length / MISSIONS.filter(m => !m.repeatable).length) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Zone Tabs */}
        <div className="zone-tabs">
          {ZONES.map(zone => {
            const isUnlocked = gameState.unlockedZones.includes(zone.id);
            return (
              <div
                key={zone.id}
                className={`zone-tab ${isUnlocked ? 'unlocked' : 'locked'}`}
                style={isUnlocked ? { borderColor: `${zone.color}50` } : {}}
              >
                <span>{isUnlocked ? zone.icon : '🔒'}</span>
                <span>{zone.name}</span>
                {!isUnlocked && <span className="zone-tab-req">Lv {zone.unlockLevel}</span>}
              </div>
            );
          })}
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {filterOptions.map(f => (
            <button
              key={f.id}
              className={`filter-tab ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Mission Grid */}
        <motion.div className="missions-grid" layout>
          <AnimatePresence>
            {filteredMissions.map(mission => {
              const isCompleted = gameState.completedMissions.includes(mission.id);
              const isAvailable = isMissionAvailable(mission.id);
              const isOnCooldown = !isAvailable && mission.repeatable;
              return (
                <MissionCard
                  key={mission.id}
                  mission={mission}
                  isCompleted={isCompleted}
                  isAvailable={isAvailable}
                  isOnCooldown={isOnCooldown}
                  cooldownText={getCooldownText(mission)}
                  onStart={handleMission}
                  loading={loading}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* TX Popup */}
        <AnimatePresence>
          {txPopup && (
            <motion.div
              className="tx-popup"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="tx-popup-icon">✅</div>
              <div>
                <p className="tx-popup-title">Transaction Confirmed!</p>
                <p className="tx-popup-hash">{txPopup.hash?.slice(0, 16)}...{txPopup.hash?.slice(-8)}</p>
                <a
                  href={`${ARC_TESTNET.blockExplorerUrls[0]}/tx/${txPopup.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-popup-link"
                >
                  View on Explorer →
                </a>
              </div>
              <button onClick={() => setTxPopup(null)} className="tx-popup-close">✕</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
