import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';
import toast from 'react-hot-toast';
import './FaucetSimulator.css';

export default function FaucetSimulator() {
  const { address, updateBalance, provider, walletType } = useWallet();
  const { completeMission } = useGame();
  const [targetAddress, setTargetAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (address) {
      const timer = setTimeout(() => {
        setTargetAddress(address);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [address]);

  const handleRequestTokens = async (e) => {
    e.preventDefault();
    if (!targetAddress || targetAddress.length < 42) {
      toast.error('Please enter a valid Arc wallet address');
      return;
    }

    setLoading(true);
    toast.loading('Connecting to Arc Dispenser...', { id: 'faucet' });

    setTimeout(async () => {
      toast.loading('Dispensing 10.0 ARC tokens...', { id: 'faucet' });
      
      setTimeout(async () => {
        setLoading(false);
        setClaimed(true);
        toast.success('10.0 ARC successfully sent to your address!', { id: 'faucet', duration: 5000 });
        
        // Trigger mission completion if they requested for their own address
        if (targetAddress.toLowerCase() === address?.toLowerCase()) {
          completeMission('faucet_request');
          
          if (walletType === 'sandbox') {
            const currentBal = parseFloat(localStorage.getItem('arc_sandbox_balance') || '100.0');
            localStorage.setItem('arc_sandbox_balance', (currentBal + 10.0).toString());
          }

          if (provider && address) {
            // Wait a moment and then refresh balance
            setTimeout(() => updateBalance(provider, address), 1000);
          }
        }
      }, 1500);
    }, 1500);
  };

  return (
    <div className="faucet-page">
      <div className="container">
        <motion.div 
          className="faucet-card premium-glass"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="faucet-glow-effect" />
          <div className="faucet-header">
            <span className="tag tag-blue">Arc Network Dispenser</span>
            <h1>Arc Testnet <span className="gradient-text">Faucet</span></h1>
            <p>Request free test tokens to explore the Arc Quest ecosystem and execute smart contracts.</p>
          </div>

          <form onSubmit={handleRequestTokens} className="faucet-form">
            <div className="input-group">
              <label>Target Wallet Address</label>
              <input 
                type="text" 
                placeholder="0x..." 
                value={targetAddress}
                onChange={(e) => setTargetAddress(e.target.value)}
                disabled={loading || claimed}
                className="faucet-input"
              />
              <span className="input-indicator">ARC</span>
            </div>

            <div className="faucet-info-box">
              <div className="info-item">
                <span className="info-label">Network:</span>
                <span className="info-val neon-text-blue">Arc Testnet (1323)</span>
              </div>
              <div className="info-item">
                <span className="info-label">Allowance:</span>
                <span className="info-val">10.0 ARC per 24 hours</span>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary btn-lg faucet-btn"
              disabled={loading || claimed}
            >
              {loading ? 'DISPENSING TOKENS...' : claimed ? 'ALLOWANCE CLAIMED ✓' : 'REQUEST 10.0 ARC 💧'}
            </button>
          </form>

          {claimed && (
            <motion.div 
              className="faucet-success-message"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              🎉 Transferred successfully! Check your dashboard balance or transaction logs.
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
