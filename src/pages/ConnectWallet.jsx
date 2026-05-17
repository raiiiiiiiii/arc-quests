import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';
import { ARC_TESTNET } from '../constants/arcChain';
import './ConnectWallet.css';

const WALLETS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    desc: 'Browser extension · Most popular',
    color: '#F6851B',
    gradient: 'rgba(246,133,27,0.15)',
    border: 'rgba(246,133,27,0.3)',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🔵',
    desc: 'Coinbase · Secure & simple',
    color: '#0052FF',
    gradient: 'rgba(0,82,255,0.12)',
    border: 'rgba(0,82,255,0.3)',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '📱',
    desc: 'Scan QR · Any mobile wallet',
    color: '#3B99FC',
    gradient: 'rgba(59,153,252,0.12)',
    border: 'rgba(59,153,252,0.3)',
  },
  {
    id: 'sandbox',
    name: 'Sandbox Mode',
    icon: '🎮',
    desc: 'No wallet needed · Instant play',
    color: '#00ff88',
    gradient: 'rgba(0,255,136,0.08)',
    border: 'rgba(0,255,136,0.3)',
  },
];

const LEFT_FEATURES = [
  { icon: '⚡', title: 'Real Onchain Missions', desc: 'Every quest is a live Arc transaction' },
  { icon: '🏆', title: 'NFT Achievement Badges', desc: 'Soulbound proof of your journey' },
  { icon: '📊', title: 'Onchain Leaderboard', desc: 'Permanently stored on Arc blockchain' },
  { icon: '💎', title: 'XP & Level System', desc: 'Progress through 6 unique Arc zones' },
];

export default function ConnectWallet() {
  const navigate = useNavigate();
  const {
    connectMetaMask, connectCoinbase, connectWalletConnect, connectSandbox,
    isConnecting, switchToArcTestnet, address, balance, isOnArcTestnet, walletType,
  } = useWallet();
  const { updateLoginStreak, unlockAchievement, completeMission, gameState } = useGame();

  const [selected, setSelected]     = useState(null);
  const [phase, setPhase]           = useState('select'); // select | connecting | verifying | success | entering
  const [statusMsg, setStatusMsg]   = useState('');
  const [blockNum, setBlockNum]     = useState(null);
  const [latency, setLatency]       = useState(null);
  const [cinematic, setCinematic]   = useState(false);
  const [fillPct, setFillPct]       = useState(0);
  const intervalRef = useRef(null);

  // Auto redirect if already connected
  useEffect(() => {
    if (address && phase === 'select') navigate('/dashboard');
  }, [address, phase, navigate]);

  // Fetch live block number & latency
  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const t0 = Date.now();
        const res = await fetch(ARC_TESTNET.rpcUrls[0], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
        });
        const data = await res.json();
        setLatency(Date.now() - t0);
        if (data?.result) setBlockNum(parseInt(data.result, 16));
      } catch { /* network unavailable */ }
    };
    fetchBlock();
    intervalRef.current = setInterval(fetchBlock, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleConnect = async (walletId) => {
    setSelected(walletId);
    setPhase('connecting');
    setStatusMsg('Requesting wallet access...');

    let success = false;
    try {
      if (walletId === 'metamask')      success = await connectMetaMask();
      else if (walletId === 'coinbase') success = await connectCoinbase();
      else if (walletId === 'walletconnect') success = await connectWalletConnect();
      else if (walletId === 'sandbox')  success = await connectSandbox();
    } catch (err) {
      setStatusMsg(`Error: ${err.message?.slice(0, 60)}`);
      setPhase('error');
      setTimeout(() => { setPhase('select'); setSelected(null); }, 3000);
      return;
    }

    if (!success) {
      setPhase('select');
      setSelected(null);
      setStatusMsg('');
      return;
    }

    setPhase('verifying');
    setStatusMsg('Switching to Arc Testnet...');
    unlockAchievement('first_steps');
    completeMission('connect_wallet');
    updateLoginStreak();

    if (walletId !== 'sandbox') {
      await switchToArcTestnet();
    }
    completeMission('switch_network');
    unlockAchievement('arc_citizen');

    setPhase('success');
    setStatusMsg('');
  };

  const handleEnterNexus = () => {
    setCinematic(true);
    setFillPct(0);
    // Animate fill bar
    let pct = 0;
    const fill = setInterval(() => {
      pct += 2;
      setFillPct(pct);
      if (pct >= 100) {
        clearInterval(fill);
        navigate('/dashboard');
      }
    }, 20);
  };

  const shortAddr = address
    ? `${address.slice(0, 8)}...${address.slice(-6)}`
    : null;

  const chainOk = isOnArcTestnet || walletType === 'sandbox';

  return (
    <>
      {/* ── Cinematic Enter Overlay ── */}
      <AnimatePresence>
        {cinematic && (
          <motion.div
            className="cinematic-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="cinematic-title gradient-text"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              Entering Arc Nexus
            </motion.div>
            <div className="cinematic-bar">
              <motion.div
                className="cinematic-fill"
                initial={{ width: '0%' }}
                animate={{ width: `${fillPct}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
            <motion.div
              className="cinematic-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Initializing Onchain Profile
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="connect-page">
        {/* ── Background ── */}
        <div className="connect-bg-effects">
          <div className="connect-orb connect-orb-1" />
          <div className="connect-orb connect-orb-2" />
          <div className="connect-orb connect-orb-3" />
        </div>
        <div className="connect-bg-grid" />

        {/* ══════════ LEFT PANEL ══════════ */}
        <motion.div
          className="connect-left-panel"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="left-panel-badge">
            <span className="left-badge-dot" />
            Arc Testnet · Live
          </div>

          <h1 className="left-panel-title">
            Begin Your<br />
            <span className="highlight">Blockchain</span>
            <span className="highlight">Adventure</span>
          </h1>

          <p className="left-panel-desc">
            Arc Quest is a fully onchain Web3 game built on Arc Testnet.
            Complete real blockchain missions, earn XP, and mint achievement NFTs.
          </p>

          <div className="left-panel-features">
            {LEFT_FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className="lp-feature"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              >
                <div className="lp-feature-icon">{f.icon}</div>
                <div className="lp-feature-text">
                  <strong>{f.title}</strong>
                  <span>{f.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Live Network Stats */}
          <div className="live-network-stats">
            <div className="net-stat-card">
              <span className="net-stat-value">
                <span className="net-stat-pulse" />
                {blockNum ? `#${blockNum.toLocaleString()}` : '---'}
              </span>
              <span className="net-stat-label">Latest Block</span>
            </div>
            <div className="net-stat-card">
              <span className="net-stat-value">
                {latency ? `${latency}ms` : '---'}
              </span>
              <span className="net-stat-label">RPC Latency</span>
            </div>
            <div className="net-stat-card">
              <span className="net-stat-value">5042002</span>
              <span className="net-stat-label">Chain ID</span>
            </div>
          </div>
        </motion.div>

        {/* ══════════ RIGHT PANEL ══════════ */}
        <motion.div
          className="connect-right-panel"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="connect-form-box">

            {/* Header */}
            <div className="connect-form-header">
              <img src="/arc-logo.svg" alt="Arc Logo" className="arc-logo arc-logo-lg" style={{ marginBottom: '16px', display: 'block', margin: '0 auto 16px auto' }} />
              <h1>Connect to <span className="gradient-text">Arc Quest</span></h1>
              <p>Choose your wallet to enter the Arc blockchain universe</p>
            </div>

            {/* Network Card */}
            <div className="arc-network-card">
              <div className="arc-net-dot" />
              <div className="arc-net-info">
                <span className="arc-net-name">Arc Testnet · Chain ID 5042002</span>
                <span className="arc-net-meta">
                  {ARC_TESTNET.rpcUrls[0]} · USDC
                </span>
              </div>
              <span className="tag tag-green">Live</span>
            </div>

            {/* ── SUCCESS STATE ── */}
            <AnimatePresence mode="wait">
              {phase === 'success' && address ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* XP Unlock */}
                  <motion.div
                    className="xp-unlock-banner"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    ✨ +250 XP Unlocked · First Contact Mission Complete!
                  </motion.div>

                  {/* Verification Panel */}
                  <div className="connect-success-panel">
                    <div className="success-panel-title">
                      <span className="glow-dot" /> Arc Verification Panel
                    </div>
                    <div className="success-info-row">
                      <span className="success-info-label">Wallet Address</span>
                      <span className="success-info-value blue">{shortAddr}</span>
                    </div>
                    <div className="success-info-row">
                      <span className="success-info-label">Chain ID</span>
                      <span className="success-info-value">{ARC_TESTNET.chainIdDecimal}</span>
                    </div>
                    <div className="success-info-row">
                      <span className="success-info-label">Arc Testnet Status</span>
                      <span className={`success-info-value ${chainOk ? 'green' : ''}`}>
                        {chainOk ? '✓ Connected' : '⚠ Wrong Network'}
                      </span>
                    </div>
                    <div className="success-info-row">
                      <span className="success-info-label">USDC Balance</span>
                      <span className="success-info-value blue">
                        {parseFloat(balance || 0).toFixed(4)} USDC
                      </span>
                    </div>
                    <div className="success-info-row">
                      <span className="success-info-label">Explorer</span>
                      <a
                        href={`${ARC_TESTNET.blockExplorerUrls[0]}/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="explorer-link"
                      >
                        View on ArcScan ↗
                      </a>
                    </div>
                    <div className="success-info-row">
                      <span className="success-info-label">Wallet Mode</span>
                      <span className="success-info-value">
                        {walletType === 'sandbox' ? '🎮 Sandbox' : `🔗 ${walletType}`}
                      </span>
                    </div>
                  </div>

                  {/* Enter Button */}
                  <motion.button
                    className="enter-nexus-btn"
                    onClick={handleEnterNexus}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ⚡ ENTER ARC NEXUS
                  </motion.button>
                </motion.div>

              ) : (
                <motion.div key="wallets">
                  {/* Status Messages */}
                  <AnimatePresence>
                    {(phase === 'connecting' || phase === 'verifying') && (
                      <motion.div
                        className="connect-status-box pending"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="arc-spinner" />
                        {statusMsg}
                      </motion.div>
                    )}
                    {phase === 'error' && (
                      <motion.div
                        className="connect-status-box error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        ❌ {statusMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Wallet Cards */}
                  <div className="wallet-cards">
                    {WALLETS.map((w, i) => (
                      <motion.button
                        key={w.id}
                        className={`wallet-card ${w.id === 'sandbox' ? 'sandbox-card' : ''} ${selected === w.id ? 'selected' : ''}`}
                        onClick={() => handleConnect(w.id)}
                        disabled={isConnecting}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        whileHover={!isConnecting ? { scale: 1.01 } : {}}
                        whileTap={!isConnecting ? { scale: 0.99 } : {}}
                        style={{
                          '--wallet-color': w.color,
                        }}
                      >
                        <div
                          className="wallet-card-icon"
                          style={{ background: w.gradient, border: `1px solid ${w.border}` }}
                        >
                          {w.icon}
                        </div>
                        <div className="wallet-card-body">
                          <span className="wallet-card-name">{w.name}</span>
                          <span className="wallet-card-desc">{w.desc}</span>
                        </div>
                        <div className="wallet-card-right">
                          {selected === w.id && isConnecting ? (
                            <div className="arc-spinner" />
                          ) : (
                            <span className="wallet-card-arrow">→</span>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Disclaimer */}
            <p className="connect-disclaimer">
              By connecting you agree to interact with Arc Testnet.
              No real funds involved. Need test tokens?{' '}
              <a href={ARC_TESTNET.faucetUrl} target="_blank" rel="noopener noreferrer">
                Arc Faucet ↗
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
