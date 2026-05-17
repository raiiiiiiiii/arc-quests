import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import './Landing.css';

const features = [
  { icon: '⚡', title: 'Onchain Operations', desc: 'Execute native Arc smart contracts to clear encrypted network sectors.' },
  { icon: '🏆', title: 'Soulbound Artifacts', desc: 'Mint cryptographic proofs of your tactical milestones directly to your wallet.' },
  { icon: '📊', title: 'Immutable Hierarchy', desc: 'Your operative rank is permanently hardcoded onto the Arc ledger.' },
  { icon: '🌐', title: 'Network Recon', desc: 'Scan and interface with live protocols operating within the Arc ecosystem.' },
  { icon: '💎', title: 'Privilege Escalation', desc: 'Accumulate tactical XP to breach new zones and bypass security thresholds.' },
  { icon: '🔄', title: 'Recurring Protocols', desc: 'Execute daily operational directives to sustain your network streak.' },
];

const stats = [
  { label: 'Active Operatives', value: '12,847' },
  { label: 'Directives Executed', value: '284,193' },
  { label: 'Artifacts Forged', value: '47,602' },
  { label: 'Network Sync', value: 'Live' },
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
            Arc Testnet · Synchronized
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Breach the
            <span className="gradient-text"> Arc Nexus.</span>
            <br />
            Master the Network.
          </motion.h1>

          <motion.p
            className="hero-desc"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Initiate your operative sequence. Deploy live transactions, forge cryptographic artifacts, and secure your dominance on the immutable ledger.
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
              <span>⚡</span> Initialize Uplink
            </button>
            <button
              className="btn-secondary btn-lg"
              onClick={() => navigate('/ecosystem')}
            >
              <span>🌐</span> Scan Network
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
            <span className="tag tag-blue">Tactical Capabilities</span>
            <h2>Arsenal for<br /><span className="gradient-text">Network Domination</span></h2>
            <p>Precision-engineered protocols for the elite onchain operative.</p>
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
            <span className="tag tag-purple">Operative Sequence</span>
            <h2>From Initiate to <span className="gradient-text">Apex</span></h2>
          </motion.div>

          <div className="journey-steps">
            {[
              { step: '01', title: 'Establish Connection', desc: 'Interface your cryptographic terminal with the Arc Testnet nodes.', icon: '🔗' },
              { step: '02', title: 'Execute Directives', desc: 'Deploy live transactions to bypass simulated network security.', icon: '⚡' },
              { step: '03', title: 'Escalate Privileges', desc: 'Accumulate tactical data to breach heavily restricted zones.', icon: '📈' },
              { step: '04', title: 'Forge Artifacts', desc: 'Mint soulbound assets as immutable proof of your operational ascent.', icon: '🏆' },
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
            <h2>Ready to Breach the<br /><span className="gradient-text">Arc Network?</span></h2>
            <p>Join elite operatives securing the future of the decentralized ecosystem.</p>
            <button
              className="btn-primary btn-lg"
              onClick={() => navigate('/connect')}
            >
              ⚡ Establish Uplink
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
              <p>Powered by Arc Testnet · Tactical Onchain Experience</p>
            </div>
            <div className="footer-links">
              <a href="https://www.arc.io/" target="_blank" rel="noopener noreferrer">Arc Protocol</a>
              <a href="/explorer">Network Scan</a>
              <a href="/faucet">Asset Uplink</a>
              <a href="https://docs.arc.io/" target="_blank" rel="noopener noreferrer">Intel Docs</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Arc Quest · Decentralized Infrastructure · Open Source</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
