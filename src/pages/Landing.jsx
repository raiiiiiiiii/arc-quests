import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import './Landing.css';

const features = [
  { icon: '⚡', title: 'Real Onchain Quests', desc: 'Complete missions that trigger actual Arc Testnet transactions' },
  { icon: '🏆', title: 'NFT Achievements', desc: 'Mint soulbound badge NFTs for every milestone you conquer' },
  { icon: '📊', title: 'Onchain Leaderboard', desc: 'Your rank is stored permanently on Arc blockchain' },
  { icon: '🌐', title: 'Ecosystem Explorer', desc: 'Discover every protocol, tool, and dApp in the Arc universe' },
  { icon: '💎', title: 'XP Progression', desc: 'Level up through zones and unlock exclusive content' },
  { icon: '🔄', title: 'Daily Quests', desc: 'Return daily for streak rewards and repeatable missions' },
];

const stats = [
  { label: 'Active Questers', value: '12,847' },
  { label: 'Missions Completed', value: '284,193' },
  { label: 'NFTs Minted', value: '47,602' },
  { label: 'Arc Blocks', value: '∞' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { address } = useWallet();

  useEffect(() => {
    if (address) navigate('/dashboard');
  }, [address, navigate]);

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        <div className="container hero-content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="hero-badge"
          >
            <span className="glow-dot" />
            Arc Testnet · Live
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Explore the
            <span className="gradient-text"> Arc Chain</span>
            <br />
            Through Epic Quests
          </motion.h1>

          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            The ultimate Web3 adventure game on Arc Testnet. Complete onchain missions,
            earn XP, mint achievement NFTs, and climb the blockchain-powered leaderboard.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <button
              className="btn-primary btn-lg hero-cta"
              onClick={() => navigate('/connect')}
            >
              <span>⚡</span> Start Your Quest
            </button>
            <button
              className="btn-secondary btn-lg"
              onClick={() => navigate('/ecosystem')}
            >
              <span>🌐</span> Explore Arc
            </button>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {stats.map(s => (
              <div key={s.label} className="hero-stat">
                <span className="hero-stat-value">{s.value}</span>
                <span className="hero-stat-label">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="scroll-dot" />
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="tag tag-blue">Game Features</span>
            <h2>Everything You Need to<br /><span className="gradient-text">Conquer Arc</span></h2>
            <p>A fully onchain game experience built for the Arc blockchain ecosystem</p>
          </motion.div>

          <div className="features-grid">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="feature-card glass-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey section */}
      <section className="section journey-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="tag tag-purple">Your Journey</span>
            <h2>From Zero to <span className="gradient-text">Arc Legend</span></h2>
          </motion.div>

          <div className="journey-steps">
            {[
              { step: '01', title: 'Connect Wallet', desc: 'Link MetaMask or Coinbase Wallet to Arc Testnet', icon: '🔗' },
              { step: '02', title: 'Complete Missions', desc: 'Execute real onchain transactions and interactions', icon: '⚡' },
              { step: '03', title: 'Earn XP & Level Up', desc: 'Progress through 6 unique zones in the Arc universe', icon: '📈' },
              { step: '04', title: 'Mint Achievement NFTs', desc: 'Forge permanent proof of your blockchain journey', icon: '🏆' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="journey-step glass-card"
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <div className="step-content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                {i < 3 && <div className="step-connector" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            className="cta-card glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-glow" />
            <h2>Ready to Begin Your<br /><span className="gradient-text">Arc Quest?</span></h2>
            <p>Join thousands of questers exploring the Arc blockchain ecosystem</p>
            <button
              className="btn-primary btn-lg"
              onClick={() => navigate('/connect')}
            >
              ⚡ Connect Wallet & Play
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <span className="navbar-logo-text">Arc<span className="neon-text-blue">Quest</span></span>
              <p>Built on Arc Testnet · Web3 Adventure Game</p>
            </div>
            <div className="footer-links">
              <a href="https://www.arc.io/" target="_blank" rel="noopener noreferrer">Arc Official</a>
              <a href="/explorer">Explorer</a>
              <a href="/faucet">Faucet</a>
              <a href="https://docs.arc.io/" target="_blank" rel="noopener noreferrer">Docs</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Arc Quest · Open source · Built for the Arc ecosystem</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
