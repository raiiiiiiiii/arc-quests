import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';
import './Navbar.css';

const navLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { path: '/missions', label: 'Missions', icon: '⚡' },
  { path: '/nft-gallery', label: 'NFTs', icon: '🎨' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '📊' },
  { path: '/ecosystem', label: 'Ecosystem', icon: '🌐' },
];

export default function Navbar() {
  const location = useLocation();
  const { address, balance, isOnArcTestnet, disconnect, switchToArcTestnet, walletType } = useWallet();
  const { gameState, getXPProgress } = useGame();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [location]);

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const walletIcons = { metamask: '🦊', coinbase: '🔵', walletconnect: '🔗' };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link to={address ? '/dashboard' : '/'} className="navbar-logo">
          <div className="navbar-logo-icon">
            <span>⬡</span>
          </div>
          <span className="navbar-logo-text">
            Arc<span className="neon-text-blue">Quest</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        {address && (
          <div className="navbar-links">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                <span className="nav-link-icon">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div className="navbar-right">
          {address ? (
            <>
              {/* Network Status */}
              {!isOnArcTestnet && (
                <button className="btn-switch-network" onClick={switchToArcTestnet}>
                  ⚠️ Switch to Arc
                </button>
              )}

              {/* XP Chip */}
              <div className="navbar-xp-chip">
                <div className="xp-chip-bar">
                  <div
                    className="xp-chip-fill"
                    style={{ width: `${getXPProgress(gameState.xp)}%` }}
                  />
                </div>
                <span>Lv {gameState.level}</span>
              </div>

              {/* Wallet dropdown */}
              <div className="wallet-badge">
                <span className="wallet-icon">{walletIcons[walletType] || '👛'}</span>
                <div className="wallet-info">
                  <span className="wallet-addr">{shortAddr}</span>
                  <span className="wallet-bal">{parseFloat(balance).toFixed(4)} ARC</span>
                </div>
                <button className="wallet-disconnect" onClick={disconnect} title="Disconnect">✕</button>
              </div>
            </>
          ) : (
            <Link to="/connect" className="btn-primary btn-sm">
              Connect Wallet
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="navbar-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && address && (
          <motion.div
            className="navbar-mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                <span>{link.icon}</span> {link.label}
              </Link>
            ))}
            <div className="divider" />
            <button
              className="mobile-nav-link disconnect-btn"
              onClick={disconnect}
            >
              🔌 Disconnect Wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
