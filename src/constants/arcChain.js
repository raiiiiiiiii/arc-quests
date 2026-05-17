// Arc Testnet Configuration
export const ARC_TESTNET = {
  chainId: '0x4ceefa', // 5042002 decimal
  chainIdDecimal: 5042002,
  chainName: 'Arc Testnet',
  nativeCurrency: {
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.testnet.arc.network'],
  blockExplorerUrls: ['https://testnet.arcscan.app'],
  faucetUrl: 'https://faucet.arc.network',
};

// Smart Contract Address (Arc Testnet)
export const CONTRACTS = {
  ARC_QUEST: import.meta.env.VITE_ARC_QUEST_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000001', // Replace with deployed ArcQuest address
};

// Game Constants
export const XP_PER_LEVEL = 1000;
export const MAX_LEVEL = 50;

export const ZONES = [
  { id: 1, name: 'Genesis Hub', icon: '🌐', unlockLevel: 0, color: '#4f46e5' },
  { id: 2, name: 'Token Nexus', icon: '💎', unlockLevel: 3, color: '#7c3aed' },
  { id: 3, name: 'Contract Forge', icon: '⚡', unlockLevel: 7, color: '#0891b2' },
  { id: 4, name: 'DeFi Citadel', icon: '🏰', unlockLevel: 12, color: '#059669' },
  { id: 5, name: 'NFT Sanctum', icon: '🎨', unlockLevel: 18, color: '#d97706' },
  { id: 6, name: 'Arc Summit', icon: '🚀', unlockLevel: 25, color: '#dc2626' },
];

export const MISSIONS = [
  {
    id: 'connect_wallet',
    title: 'First Contact',
    description: 'Connect your wallet to the Arc network',
    xp: 100,
    zone: 1,
    type: 'onchain',
    repeatable: false,
    icon: '🔗',
  },
  {
    id: 'switch_network',
    title: 'Network Jumper',
    description: 'Switch to Arc Testnet network',
    xp: 150,
    zone: 1,
    type: 'onchain',
    repeatable: false,
    icon: '🌐',
  },
  {
    id: 'faucet_request',
    title: 'Token Harvest',
    description: 'Request test tokens from Arc faucet',
    xp: 200,
    zone: 1,
    type: 'onchain',
    repeatable: true,
    cooldown: 86400000, // 24 hours
    icon: '💧',
  },
  {
    id: 'first_tx',
    title: 'Chain Initiator',
    description: 'Send your first testnet transaction',
    xp: 300,
    zone: 1,
    type: 'onchain',
    repeatable: false,
    icon: '📡',
  },
  {
    id: 'verify_tx',
    title: 'Truth Seeker',
    description: 'Verify a transaction on Arc Explorer',
    xp: 150,
    zone: 1,
    type: 'onchain',
    repeatable: false,
    icon: '🔍',
  },
  {
    id: 'smart_contract',
    title: 'Code Weaver',
    description: 'Interact with a smart contract on Arc',
    xp: 500,
    zone: 2,
    type: 'onchain',
    repeatable: false,
    icon: '⚙️',
  },
  {
    id: 'store_xp',
    title: 'Progress Anchor',
    description: 'Store your XP progress on-chain',
    xp: 250,
    zone: 2,
    type: 'onchain',
    repeatable: false,
    icon: '💾',
  },
  {
    id: 'mint_badge',
    title: 'Badge Forger',
    description: 'Mint your achievement badge NFT',
    xp: 750,
    zone: 2,
    type: 'onchain',
    repeatable: false,
    icon: '🏆',
  },
  {
    id: 'daily_login',
    title: 'Daily Devotion',
    description: 'Complete daily login streak',
    xp: 50,
    zone: 1,
    type: 'onchain',
    repeatable: true,
    cooldown: 86400000,
    icon: '📅',
  },
  {
    id: 'explore_ecosystem',
    title: 'Arc Explorer',
    description: 'Explore the Arc ecosystem dApps',
    xp: 200,
    zone: 1,
    type: 'onchain',
    repeatable: false,
    icon: '🗺️',
  },
  {
    id: 'leaderboard_update',
    title: 'Rank Climber',
    description: 'Update your rank on the onchain leaderboard',
    xp: 100,
    zone: 3,
    type: 'onchain',
    repeatable: true,
    cooldown: 3600000,
    icon: '📊',
  },
];

export const ACHIEVEMENTS = [
  { id: 'first_steps', name: 'First Steps', description: 'Connected wallet for the first time', icon: '👣', rarity: 'common' },
  { id: 'arc_citizen', name: 'Arc Citizen', description: 'Joined the Arc Testnet', icon: '🌐', rarity: 'common' },
  { id: 'token_holder', name: 'Token Holder', description: 'Received testnet tokens', icon: '💰', rarity: 'uncommon' },
  { id: 'chain_starter', name: 'Chain Starter', description: 'Sent first transaction', icon: '⚡', rarity: 'uncommon' },
  { id: 'contract_caller', name: 'Contract Caller', description: 'Interacted with smart contract', icon: '📝', rarity: 'rare' },
  { id: 'nft_minter', name: 'NFT Minter', description: 'Minted first achievement badge', icon: '🎨', rarity: 'rare' },
  { id: 'xp_master', name: 'XP Master', description: 'Reached 5000 XP', icon: '✨', rarity: 'epic' },
  { id: 'zone_explorer', name: 'Zone Explorer', description: 'Unlocked all 6 zones', icon: '🗺️', rarity: 'legendary' },
];
