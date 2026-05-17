import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';
import { ARC_TESTNET } from '../constants/arcChain';
import './ConnectWallet.css';

const wallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'The most popular Ethereum wallet',
    color: '#F6851B',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🔵',
    description: 'Simple and secure crypto wallet',
    color: '#0052FF',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Connect any mobile wallet via QR',
    color: '#3B99FC',
  },
  {
    id: 'sandbox',
    name: 'Local Sandbox Mode',
    icon: '🎮',
    description: 'Play instantly without installing wallets',
    color: '#00ff88',
  },
];

export default function ConnectWallet() {
  const navigate = useNavigate();
  const { connectMetaMask, connectCoinbase, connectWalletConnect, connectSandbox, isConnecting, switchToArcTestnet } = useWallet();
  const { updateLoginStreak, unlockAchievement, completeMission } = useGame();
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState('select'); // 'select' | 'connecting' | 'network' | 'done'

  const handleConnect = async (walletId) => {
    setSelected(walletId);
    setStep('connecting');

    let success = false;
    if (walletId === 'metamask') {
      success = await connectMetaMask();
    } else if (walletId === 'coinbase') {
      success = await connectCoinbase();
    } else if (walletId === 'walletconnect') {
      success = await connectWalletConnect();
    } else if (walletId === 'sandbox') {
      success = await connectSandbox();
    }

    if (success) {
      setStep('network');
      unlockAchievement('first_steps');
      completeMission('connect_wallet');
      updateLoginStreak();

      // Auto-prompt network switch
      if (walletId !== 'sandbox') {
        const switched = await switchToArcTestnet();
        if (switched) {
          completeMission('switch_network');
          unlockAchievement('arc_citizen');
        }
      } else {
        completeMission('switch_network');
        unlockAchievement('arc_citizen');
      }
      setStep('done');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else {
      setStep('select');
      setSelected(null);
    }
  };

  return (
    <div className="connect-page">
      <div className="connect-bg">
        <div className="connect-orb-1" />
        <div className="connect-orb-2" />
      </div>

      <motion.div
        className="connect-container glass-card"
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="connect-header">
          <div className="connect-logo">⬡</div>
          <h1>Connect to <span className="gradient-text">Arc Quest</span></h1>
          <p>Choose your wallet to begin your onchain adventure on Arc Testnet</p>
        </div>

        {/* Network info */}
        <div className="network-info-card">
          <div className="network-dot" />
          <div className="network-details">
            <span className="network-name">{ARC_TESTNET.chainName}</span>
            <span className="network-rpc">Chain ID: {ARC_TESTNET.chainIdDecimal} · {ARC_TESTNET.rpcUrls[0]}</span>
          </div>
          <span className="tag tag-green">Testnet</span>
        </div>

        {/* Wallet options */}
        <div className="wallet-options">
          {wallets.map((wallet, i) => (
            <motion.button
              key={wallet.id}
              className={`wallet-option ${selected === wallet.id ? 'selected' : ''} ${wallet.comingSoon ? 'coming-soon' : ''}`}
              onClick={() => !wallet.comingSoon && handleConnect(wallet.id)}
              disabled={isConnecting || wallet.comingSoon}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={!wallet.comingSoon ? { scale: 1.02 } : {}}
              whileTap={!wallet.comingSoon ? { scale: 0.98 } : {}}
            >
              <div className="wallet-option-icon" style={{ background: `${wallet.color}20` }}>
                <span>{wallet.icon}</span>
              </div>
              <div className="wallet-option-info">
                <span className="wallet-option-name">{wallet.name}</span>
                <span className="wallet-option-desc">{wallet.description}</span>
              </div>
              <div className="wallet-option-right">
                {wallet.comingSoon ? (
                  <span className="tag tag-purple">Soon</span>
                ) : selected === wallet.id && isConnecting ? (
                  <div className="spinner" />
                ) : (
                  <span className="wallet-arrow">→</span>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Status messages */}
        {step === 'connecting' && (
          <motion.div
            className="connect-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="spinner" /> Connecting wallet...
          </motion.div>
        )}
        {step === 'network' && (
          <motion.div
            className="connect-status success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✅ Connected! Switching to Arc Testnet...
          </motion.div>
        )}
        {step === 'done' && (
          <motion.div
            className="connect-status success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🚀 Ready! Entering Arc Quest...
          </motion.div>
        )}

        {/* Footer note */}
        <p className="connect-disclaimer">
          By connecting, you agree to interact with Arc Testnet. No real funds involved.
          Need test tokens? Visit the{' '}
          <a href={ARC_TESTNET.faucetUrl} target="_blank" rel="noopener noreferrer">
            Arc Faucet
          </a>.
        </p>
      </motion.div>
    </div>
  );
}
