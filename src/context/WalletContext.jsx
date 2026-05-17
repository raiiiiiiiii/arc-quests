import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { ARC_TESTNET } from '../constants/arcChain';
import toast from 'react-hot-toast';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isOnArcTestnet, setIsOnArcTestnet] = useState(false);
  const [walletType, setWalletType] = useState(null);
  const [isReconnecting, setIsReconnecting] = useState(() => !!localStorage.getItem('arc_wallet_type'));

  const checkNetwork = useCallback((id) => {
    const arcChainId = ARC_TESTNET.chainIdDecimal;
    const isArc = parseInt(id, 16) === arcChainId || id === arcChainId || id === ARC_TESTNET.chainId;
    setIsOnArcTestnet(isArc);
    return isArc;
  }, []);

  const updateBalance = useCallback(async (prov, addr) => {
    const savedType = localStorage.getItem('arc_wallet_type') || walletType;
    if (savedType === 'sandbox') {
      const stored = localStorage.getItem('arc_sandbox_balance') || '100.0';
      setBalance(stored);
      return;
    }
    try {
      const bal = await prov.getBalance(addr);
      setBalance(ethers.formatEther(bal));
    } catch {
      setBalance('0');
    }
  }, [walletType]);

  const connectMetaMask = useCallback(async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not installed! Please install it first.');
      window.open('https://metamask.io/download/', '_blank');
      return false;
    }
    setIsConnecting(true);
    try {
      const prov = new ethers.BrowserProvider(window.ethereum);
      const accounts = await prov.send('eth_requestAccounts', []);
      const sign = await prov.getSigner();
      const network = await prov.getNetwork();
      const addr = accounts[0];

      setProvider(prov);
      setSigner(sign);
      setAddress(addr);
      setChainId(network.chainId.toString());
      setWalletType('metamask');
      localStorage.setItem('arc_wallet_type', 'metamask');
      checkNetwork(network.chainId.toString());
      await updateBalance(prov, addr);

      toast.success('MetaMask connected!');
      return true;
    } catch (err) {
      if (err.code === 4001) {
        toast.error('Connection rejected by user');
      } else {
        toast.error('Failed to connect MetaMask');
      }
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [checkNetwork, updateBalance]);

  const connectCoinbase = useCallback(async () => {
    const coinbaseProvider = window.coinbaseWalletExtension || window.ethereum;
    if (!coinbaseProvider) {
      toast.error('Coinbase Wallet not detected. Please install it.');
      window.open('https://www.coinbase.com/wallet/downloads', '_blank');
      return false;
    }
    setIsConnecting(true);
    try {
      const prov = new ethers.BrowserProvider(coinbaseProvider);
      const accounts = await prov.send('eth_requestAccounts', []);
      const sign = await prov.getSigner();
      const network = await prov.getNetwork();
      const addr = accounts[0];

      setProvider(prov);
      setSigner(sign);
      setAddress(addr);
      setChainId(network.chainId.toString());
      setWalletType('coinbase');
      localStorage.setItem('arc_wallet_type', 'coinbase');
      checkNetwork(network.chainId.toString());
      await updateBalance(prov, addr);

      toast.success('Coinbase Wallet connected!');
      return true;
    } catch {
      toast.error('Failed to connect Coinbase Wallet');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [checkNetwork, updateBalance]);

  const connectWalletConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const wcProvider = await EthereumProvider.init({
        projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c552e4b07a1b5fa8bc1ceb485aa5be82', // standard generic test ID
        chains: [ARC_TESTNET.chainIdDecimal],
        rpcMap: {
          [ARC_TESTNET.chainIdDecimal]: ARC_TESTNET.rpcUrls[0],
        },
        showQrModal: true,
      });

      await wcProvider.enable();

      const prov = new ethers.BrowserProvider(wcProvider);
      const accounts = await prov.send('eth_requestAccounts', []);
      const sign = await prov.getSigner();
      const network = await prov.getNetwork();
      const addr = accounts[0];

      setProvider(prov);
      setSigner(sign);
      setAddress(addr);
      setChainId(network.chainId.toString());
      setWalletType('walletconnect');
      localStorage.setItem('arc_wallet_type', 'walletconnect');
      checkNetwork(network.chainId.toString());
      await updateBalance(prov, addr);

      toast.success('WalletConnect connected!');
      return true;
    } catch {
      toast.error('Failed to connect WalletConnect');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [checkNetwork, updateBalance]);

  const connectSandbox = useCallback(async () => {
    setIsConnecting(true);
    try {
      const mockAddress = '0x8c8606a9a9424f2989829ab2cc813e721a37c0aa';
      const initialBal = localStorage.getItem('arc_sandbox_balance') || '100.0';
      localStorage.setItem('arc_sandbox_balance', initialBal);
      
      const mockProvider = {
        getBalance: async () => ethers.parseEther(localStorage.getItem('arc_sandbox_balance') || '100.0'),
      };
      
      const mockSigner = {
        sendTransaction: async (txParams) => {
          const mockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
          const valEther = txParams.value ? ethers.formatEther(txParams.value) : '0.001';
          const currentBal = parseFloat(localStorage.getItem('arc_sandbox_balance') || '100.0');
          const newBal = Math.max(0, currentBal - parseFloat(valEther) - 0.001).toFixed(4);
          localStorage.setItem('arc_sandbox_balance', newBal);
          setBalance(newBal);
          
          return {
            hash: mockHash,
            wait: async () => ({
              hash: mockHash,
              blockNumber: 149302,
            }),
          };
        },
      };

      setProvider(mockProvider);
      setSigner(mockSigner);
      setAddress(mockAddress);
      setChainId(ARC_TESTNET.chainId);
      setWalletType('sandbox');
      setIsOnArcTestnet(true);
      setBalance(initialBal);
      localStorage.setItem('arc_wallet_type', 'sandbox');
      
      toast.success('Sandbox Mode Activated!');
      return true;
    } catch {
      toast.error('Failed to initialize Sandbox Mode');
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const switchToArcTestnet = useCallback(async () => {
    if (!window.ethereum) return false;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARC_TESTNET.chainId }],
      });
      toast.success('Switched to Arc Testnet!');
      return true;
    } catch (switchError) {
      if (switchError.code === 4902) {
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
          toast.success('Arc Testnet added and switched!');
          return true;
        } catch {
          toast.error('Failed to add Arc Testnet network');
          return false;
        }
      }
      toast.error('Failed to switch network');
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setChainId(null);
    setBalance('0');
    setWalletType(null);
    setIsOnArcTestnet(false);
    localStorage.removeItem('arc_wallet_type');
    localStorage.removeItem('arc_sandbox_balance');
    toast.success('Wallet disconnected');
  }, []);

  const sendTransaction = useCallback(async (to, value = '0.001') => {
    if (!signer) {
      toast.error('Wallet not connected');
      return null;
    }
    try {
      const tx = await signer.sendTransaction({
        to: to || address,
        value: ethers.parseEther(value),
      });
      toast.loading('Transaction submitted...', { id: 'tx' });
      const receipt = await tx.wait();
      const explorerLink = walletType === 'sandbox' ? `/explorer/tx/${receipt.hash}` : `${ARC_TESTNET.blockExplorerUrls[0]}/tx/${receipt.hash}`;
      toast.success(
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span>Transaction confirmed!</span>
          <a
            href={explorerLink}
            target={walletType === 'sandbox' ? "_self" : "_blank"}
            rel="noopener noreferrer"
            style={{ color: '#00d4ff', fontSize: '0.8rem', textDecoration: 'underline' }}
          >
            View on Explorer ↗
          </a>
        </div>,
        { id: 'tx', duration: 8000 }
      );
      await updateBalance(provider, address);
      return receipt;
    } catch (err) {
      if (err.code === 4001) {
        toast.error('Transaction rejected by user', { id: 'tx' });
      } else {
        toast.error(`Transaction failed: ${err.message?.slice(0, 60)}`, { id: 'tx' });
      }
      return null;
    }
  }, [signer, address, provider, updateBalance, walletType]);

  // Listen for account/chain changes
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0]);
        if (provider) await updateBalance(provider, accounts[0]);
      }
    };
    const handleChainChanged = (chainIdHex) => {
      setChainId(chainIdHex);
      checkNetwork(chainIdHex);
      window.location.reload();
    };
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [provider, disconnect, checkNetwork, updateBalance]);

  // Auto-reconnect
  useEffect(() => {
    const savedWallet = localStorage.getItem('arc_wallet_type');
    if (!savedWallet) return;

    const reconnect = async () => {
      try {
        if (savedWallet === 'sandbox') {
          await connectSandbox();
        } else if (savedWallet === 'walletconnect') {
          try {
            const wcProvider = await EthereumProvider.init({
              projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'c552e4b07a1b5fa8bc1ceb485aa5be82',
              chains: [ARC_TESTNET.chainIdDecimal],
              rpcMap: { [ARC_TESTNET.chainIdDecimal]: ARC_TESTNET.rpcUrls[0] },
            });
            if (wcProvider.session) {
              const prov = new ethers.BrowserProvider(wcProvider);
              const sign = await prov.getSigner();
              const network = await prov.getNetwork();
              const accounts = await prov.send('eth_accounts', []);
              if (accounts.length > 0) {
                setProvider(prov);
                setSigner(sign);
                setAddress(accounts[0]);
                setChainId(network.chainId.toString());
                setWalletType('walletconnect');
                checkNetwork(network.chainId.toString());
                await updateBalance(prov, accounts[0]);
              }
            } else {
              localStorage.removeItem('arc_wallet_type');
            }
          } catch {
            localStorage.removeItem('arc_wallet_type');
          }
        } else {
          const extProvider = savedWallet === 'coinbase' ? (window.coinbaseWalletExtension || window.ethereum) : window.ethereum;
          if (extProvider) {
            try {
              const accounts = await extProvider.request({ method: 'eth_accounts' });
              if (accounts.length > 0) {
                const prov = new ethers.BrowserProvider(extProvider);
                const sign = await prov.getSigner();
                const network = await prov.getNetwork();
                setProvider(prov);
                setSigner(sign);
                setAddress(accounts[0]);
                setChainId(network.chainId.toString());
                setWalletType(savedWallet);
                checkNetwork(network.chainId.toString());
                await updateBalance(prov, accounts[0]);
              } else {
                localStorage.removeItem('arc_wallet_type');
              }
            } catch {
              localStorage.removeItem('arc_wallet_type');
            }
          }
        }
      } finally {
        setIsReconnecting(false);
      }
    };
    reconnect();
  }, [checkNetwork, updateBalance, connectSandbox]);

  return (
    <WalletContext.Provider value={{
      provider, signer, address, chainId, balance,
      isConnecting, isReconnecting, isOnArcTestnet, walletType,
      connectMetaMask, connectCoinbase, connectWalletConnect, connectSandbox, disconnect,
      switchToArcTestnet, sendTransaction, updateBalance,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
};
