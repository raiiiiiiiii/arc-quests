import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { useGame } from '../context/GameContext';
import './ExplorerSimulator.css';

export default function ExplorerSimulator() {
  const { txHash } = useParams();
  const { address } = useWallet();
  const { gameState } = useGame();
  const [searchVal, setSearchVal] = useState('');
  
  // Find transaction in local history if it matches
  const localTx = gameState.txHistory.find(t => t.hash === txHash);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal) {
      window.location.href = `/explorer/tx/${searchVal}`;
    }
  };

  const mockTxDetails = {
    hash: txHash,
    status: 'Success',
    block: 149302,
    timestamp: localTx ? new Date(localTx.timestamp).toLocaleString() : new Date().toLocaleString(),
    from: address || '0x5b38da6a701c568545dcfcb03fcb875f56beddc4',
    to: '0x0000000000000000000000000000000000000001',
    value: '0.0 ARC',
    gasLimit: '150,000',
    gasUsed: '84,321',
    gasPrice: '1.5 Gwei',
    type: localTx ? localTx.type : 'Contract Execution',
  };

  return (
    <div className="explorer-page">
      <div className="container">
        {/* Header Search Bar */}
        <div className="explorer-header-section">
          <h1>Arc <span className="gradient-text">Explorer</span></h1>
          <form onSubmit={handleSearch} className="explorer-search-form">
            <input 
              type="text" 
              placeholder="Search by Transaction Hash (0x...)" 
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="explorer-search-input"
            />
            <button type="submit" className="btn-primary">Search</button>
          </form>
        </div>

        {txHash ? (
          <motion.div 
            className="explorer-details glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="details-header">
              <h2>Transaction Details</h2>
              <span className="tag tag-green">Success</span>
            </div>
            
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-lbl">Transaction Hash</span>
                <span className="detail-val monospace neon-text-blue">{mockTxDetails.hash}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Status</span>
                <span className="detail-val text-success">✓ {mockTxDetails.status}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Block Number</span>
                <span className="detail-val">{mockTxDetails.block}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Timestamp</span>
                <span className="detail-val">{mockTxDetails.timestamp}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Transaction Type</span>
                <span className="detail-val tag tag-purple">{mockTxDetails.type}</span>
              </div>
              <div className="divider" />
              <div className="detail-row">
                <span className="detail-lbl">From</span>
                <span className="detail-val monospace">{mockTxDetails.from}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">To</span>
                <span className="detail-val monospace">{mockTxDetails.to}</span>
              </div>
              <div className="divider" />
              <div className="detail-row">
                <span className="detail-lbl">Value</span>
                <span className="detail-val neon-text-green">{mockTxDetails.value}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Gas Limit</span>
                <span className="detail-val">{mockTxDetails.gasLimit}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Gas Used</span>
                <span className="detail-val">{mockTxDetails.gasUsed}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Gas Price</span>
                <span className="detail-val">{mockTxDetails.gasPrice}</span>
              </div>
            </div>
            
            <div className="explorer-actions">
              <Link to="/explorer" className="btn-secondary">Back to General Explorer</Link>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="explorer-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* General Explorer Home */}
            <div className="explorer-stats-grid">
              <div className="stat-card">
                <span className="stat-card-icon">📦</span>
                <div className="stat-card-info">
                  <span className="stat-card-value">149,302</span>
                  <span className="stat-card-label">Latest Block</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-card-icon">⚡</span>
                <div className="stat-card-info">
                  <span className="stat-card-value">12.5s</span>
                  <span className="stat-card-label">Avg Block Time</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-card-icon">💰</span>
                <div className="stat-card-info">
                  <span className="stat-card-value">0.001 ARC</span>
                  <span className="stat-card-label">Avg Transaction Fee</span>
                </div>
              </div>
            </div>

            <div className="explorer-recent-card glass-card">
              <h3>Recent Local Operations</h3>
              {gameState.txHistory.length > 0 ? (
                <div className="explorer-tx-list">
                  {gameState.txHistory.map(tx => (
                    <div key={tx.hash} className="explorer-tx-item">
                      <div className="tx-item-left">
                        <span className="tx-icon">⚡</span>
                        <div className="tx-meta">
                          <Link to={`/explorer/tx/${tx.hash}`} className="tx-hash-link neon-text-blue">{tx.hash.slice(0, 14)}...</Link>
                          <span className="tx-type">{tx.type}</span>
                        </div>
                      </div>
                      <span className="tx-time">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-tx-msg">No transactions executed yet in your local game session.</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
