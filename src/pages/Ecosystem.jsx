import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { ARC_TESTNET } from '../constants/arcChain';
import './Ecosystem.css';

const ecosystemApps = [
  {
    category: 'Infrastructure',
    color: '#00d4ff',
    apps: [
      { name: 'Arc Explorer', desc: 'Block explorer for Arc Testnet', icon: '🔍', url: ARC_TESTNET.blockExplorerUrls[0], tag: 'Live' },
      { name: 'Arc Faucet', desc: 'Get free testnet ARC tokens', icon: '💧', url: ARC_TESTNET.faucetUrl, tag: 'Live' },
      { name: 'Arc RPC', desc: 'Public RPC endpoint for developers', icon: '🔌', url: 'https://docs.arc.io/', tag: 'Live' },
    ],
  },
  {
    category: 'DeFi',
    color: '#00ff88',
    apps: [
      { name: 'Arc Swap', desc: 'Decentralized token exchange', icon: '🔄', url: 'https://www.arc.io/ecosystem', tag: 'Soon' },
      { name: 'Arc Lend', desc: 'Lending & borrowing protocol', icon: '🏦', url: 'https://www.arc.io/ecosystem', tag: 'Soon' },
      { name: 'Arc Yield', desc: 'Yield farming aggregator', icon: '🌱', url: 'https://www.arc.io/ecosystem', tag: 'Soon' },
    ],
  },
  {
    category: 'NFT & Gaming',
    color: '#bf00ff',
    apps: [
      { name: 'Arc NFT Market', desc: 'Buy, sell & trade NFTs on Arc', icon: '🎨', url: 'https://www.arc.io/ecosystem', tag: 'Soon' },
      { name: 'Arc Quest', desc: 'This game — blockchain adventure', icon: '⚡', url: '/dashboard', tag: 'Live', current: true },
      { name: 'Arc Arena', desc: 'PvP blockchain gaming', icon: '⚔️', url: 'https://www.arc.io/ecosystem', tag: 'Soon' },
    ],
  },
  {
    category: 'Developer Tools',
    color: '#ffd700',
    apps: [
      { name: 'Arc SDK', desc: 'Developer SDK for Arc blockchain', icon: '🛠️', url: 'https://docs.arc.io/', tag: 'Beta' },
      { name: 'Arc Remix', desc: 'Smart contract IDE for Arc', icon: '💻', url: 'https://docs.arc.io/', tag: 'Soon' },
      { name: 'Arc Analytics', desc: 'On-chain analytics dashboard', icon: '📊', url: 'https://docs.arc.io/', tag: 'Soon' },
    ],
  },
];

const arcStats = [
  { label: 'TPS', value: '50,000+' },
  { label: 'Finality', value: '<1s' },
  { label: 'Gas Fees', value: '~$0.001' },
  { label: 'Validators', value: '100+' },
  { label: 'dApps', value: '200+' },
  { label: 'Uptime', value: '99.9%' },
];

export default function Ecosystem() {
  const navigate = useNavigate();
  const { address } = useWallet();

  useEffect(() => {
    if (!address) navigate('/connect');
  }, [address, navigate]);

  return (
    <div className="ecosystem-page">
      <div className="container">
        <motion.div
          className="eco-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="eco-title-section">
            <span className="tag tag-blue">Arc Ecosystem</span>
            <h1>Discover the <span className="gradient-text">Arc Universe</span></h1>
            <p>Explore every protocol, tool, and application built on the Arc blockchain</p>
          </div>
        </motion.div>

        {/* Network Stats Bar */}
        <motion.div
          className="network-stats-bar glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="network-live-badge">
            <div className="glow-dot" />
            <span>Arc Testnet · Live</span>
          </div>
          <div className="divider-v" />
          {arcStats.map(s => (
            <div key={s.label} className="net-stat">
              <span className="net-stat-value">{s.value}</span>
              <span className="net-stat-label">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Add Arc to Wallet */}
        <motion.div
          className="add-network-card glass-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="anc-icon">🔗</div>
          <div className="anc-info">
            <h3>Arc Testnet Network</h3>
            <div className="anc-details">
              <span>Chain ID: {ARC_TESTNET.chainIdDecimal}</span>
              <span>RPC: {ARC_TESTNET.rpcUrls[0]}</span>
              <span>Symbol: {ARC_TESTNET.nativeCurrency.symbol}</span>
            </div>
          </div>
          <button
            className="btn-primary"
            onClick={async () => {
              if (window.ethereum) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                      chainId: ARC_TESTNET.chainId,
                      chainName: ARC_TESTNET.chainName,
                      nativeCurrency: ARC_TESTNET.nativeCurrency,
                      rpcUrls: ARC_TESTNET.rpcUrls,
                      blockExplorerUrls: ARC_TESTNET.blockExplorerUrls,
                    }],
                  });
                } catch (err) {
                  console.error(err);
                }
              }
            }}
          >
            + Add to MetaMask
          </button>
        </motion.div>

        {/* Ecosystem Categories */}
        {ecosystemApps.map((category, catIdx) => (
          <motion.section
            key={category.category}
            className="eco-category"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIdx * 0.1 }}
          >
            <div className="eco-category-header">
              <div
                className="eco-category-dot"
                style={{ background: category.color, boxShadow: `0 0 10px ${category.color}` }}
              />
              <h2 style={{ color: category.color }}>{category.category}</h2>
            </div>
            <div className="eco-apps-grid">
              {category.apps.map((app, i) => (
                <motion.a
                  key={app.name}
                  href={app.url}
                  target={app.url.startsWith('/') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={`eco-app-card glass-card ${app.current ? 'eco-app-current' : ''}`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div
                    className="eco-app-icon"
                    style={{ background: `${category.color}15`, borderColor: `${category.color}25` }}
                  >
                    {app.icon}
                  </div>
                  <div className="eco-app-info">
                    <div className="eco-app-name-row">
                      <span className="eco-app-name">{app.name}</span>
                      <span
                        className={`tag ${app.tag === 'Live' ? 'tag-green' : app.tag === 'Beta' ? 'tag-blue' : 'tag-purple'}`}
                      >
                        {app.tag}
                      </span>
                    </div>
                    <p className="eco-app-desc">{app.desc}</p>
                  </div>
                  <span className="eco-arrow">↗</span>
                </motion.a>
              ))}
            </div>
          </motion.section>
        ))}

        {/* Arc Tech Stack */}
        <motion.div
          className="arc-tech-card glass-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2>Arc <span className="gradient-text">Technology Stack</span></h2>
          <div className="tech-grid">
            {[
              { name: 'Consensus', value: 'PoS + BFT', icon: '⚡' },
              { name: 'EVM Compatible', value: 'Full EVM', icon: '💻' },
              { name: 'Bridge', value: 'Cross-chain', icon: '🌉' },
              { name: 'Sharding', value: 'Dynamic', icon: '🔷' },
              { name: 'Privacy', value: 'ZK Proofs', icon: '🔒' },
              { name: 'Governance', value: 'On-chain DAO', icon: '🗳️' },
            ].map(t => (
              <div key={t.name} className="tech-item">
                <span className="tech-icon">{t.icon}</span>
                <span className="tech-value">{t.value}</span>
                <span className="tech-name">{t.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
