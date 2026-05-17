export const ARC_QUEST_ABI = [
  // --- Daily Reward ---
  "function claimDailyReward() external",
  
  // --- Quest Verification ---
  "function completeQuest(string calldata questId, uint256 xpReward) external",
  "function completedQuests(address player, string calldata questId) external view returns (bool)",
  
  // --- Badge NFT Minting ---
  "function mintBadge(string calldata rarity, string calldata tokenURI) external",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  
  // --- Leaderboard ---
  "function updateLeaderboard(uint256 newRank) external",
  
  // --- Player Stats ---
  "function getPlayerStats(address player) external view returns (tuple(uint256 xp, uint256 level, uint256 lastLoginTime, uint256 loginStreak, uint256 rank))",
  
  // --- Events ---
  "event XPGained(address indexed player, uint256 amount, uint256 newTotal)",
  "event LevelUp(address indexed player, uint256 newLevel)",
  "event QuestCompleted(address indexed player, string questId)",
  "event BadgeMinted(address indexed player, uint256 tokenId, string rarity)",
  "event DailyClaimed(address indexed player, uint256 currentStreak, uint256 xpGained)"
];
