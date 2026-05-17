import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './context/WalletContext';
import { GameProvider } from './context/GameContext';
import { AchievementPopup, LevelUpModal, MissionCompletePopup, NFTUnlockModal } from './components/GameModals';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import ConnectWallet from './pages/ConnectWallet';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import NFTGallery from './pages/NFTGallery';
import Leaderboard from './pages/Leaderboard';
import Ecosystem from './pages/Ecosystem';
import FaucetSimulator from './pages/FaucetSimulator';
import ExplorerSimulator from './pages/ExplorerSimulator';
import ParticleBackground from './components/ParticleBackground';
import './styles/globals.css';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98, filter: 'blur(10px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(10px)' },
};

function InitialLoader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="initial-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <motion.div 
        className="loader-glitch"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        ARC QUEST
      </motion.div>
      <div className="loader-bar">
        <motion.div 
          className="loader-fill" 
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </div>
      <motion.p 
        className="loader-text neon-text-blue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, yoyo: Infinity, duration: 0.5 }}
      >
        INITIALIZING NEURAL LINK...
      </motion.p>
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Landing />} />
          <Route path="/connect" element={<ConnectWallet />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/nft-gallery" element={<NFTGallery />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/faucet" element={<FaucetSimulator />} />
          <Route path="/explorer" element={<ExplorerSimulator />} />
          <Route path="/explorer/tx/:txHash" element={<ExplorerSimulator />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <BrowserRouter>
      <WalletProvider>
        <GameProvider>
          <AnimatePresence>
            {isBooting && <InitialLoader onComplete={() => setIsBooting(false)} />}
          </AnimatePresence>

          {/* Background Animation */}
          {!isBooting && <ParticleBackground />}

          {/* Navigation */}
          {!isBooting && <Navbar />}

          {/* Page content */}
          {!isBooting && <AnimatedRoutes />}

          {/* Game modals */}
          <AchievementPopup />
          <LevelUpModal />
          <MissionCompletePopup />
          <NFTUnlockModal />

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(10,18,35,0.95)',
                color: '#e8f4ff',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: '0.95rem',
              },
              success: {
                iconTheme: { primary: '#00ff88', secondary: 'rgba(10,18,35,0.95)' },
              },
              error: {
                iconTheme: { primary: '#ff6060', secondary: 'rgba(10,18,35,0.95)' },
              },
            }}
          />
        </GameProvider>
      </WalletProvider>
    </BrowserRouter>
  );
}
