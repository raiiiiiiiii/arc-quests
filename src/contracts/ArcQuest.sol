// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArcQuest is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Player Data
    struct Player {
        uint256 xp;
        uint256 level;
        uint256 lastLoginTime;
        uint256 loginStreak;
        uint256 rank; 
    }

    mapping(address => Player) public players;
    mapping(address => mapping(string => bool)) public completedQuests;

    // Events
    event XPGained(address indexed player, uint256 amount, uint256 newTotal);
    event LevelUp(address indexed player, uint256 newLevel);
    event QuestCompleted(address indexed player, string questId);
    event BadgeMinted(address indexed player, uint256 tokenId, string rarity);
    event DailyClaimed(address indexed player, uint256 currentStreak, uint256 xpGained);

    constructor() ERC721("ArcQuestBadge", "AQB") Ownable(msg.sender) {}

    // --- Daily Reward ---
    function claimDailyReward() external {
        Player storage p = players[msg.sender];
        require(block.timestamp >= p.lastLoginTime + 1 days, "Daily reward not ready");
        
        if (p.lastLoginTime > 0 && block.timestamp <= p.lastLoginTime + 2 days) {
            p.loginStreak += 1;
        } else {
            p.loginStreak = 1;
        }
        
        p.lastLoginTime = block.timestamp;
        
        // Base XP 50, +10 for each day of streak (max +50)
        uint256 bonus = (p.loginStreak > 5 ? 5 : p.loginStreak) * 10;
        uint256 xpToGive = 50 + bonus;
        
        _addXP(msg.sender, xpToGive);
        
        emit DailyClaimed(msg.sender, p.loginStreak, xpToGive);
    }

    // --- Quest Verification ---
    function completeQuest(string calldata questId, uint256 xpReward) external {
        // NOTE: In production, this should require a signature from a trusted backend 
        // to prevent users from spamming completeQuest themselves.
        require(!completedQuests[msg.sender][questId], "Quest already completed");
        
        completedQuests[msg.sender][questId] = true;
        _addXP(msg.sender, xpReward);
        
        emit QuestCompleted(msg.sender, questId);
    }

    // --- Badge NFT Minting ---
    function mintBadge(string calldata rarity, string calldata tokenURI) external {
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        emit BadgeMinted(msg.sender, tokenId, rarity);
    }

    // --- XP Storage & Logic ---
    function _addXP(address player, uint256 amount) internal {
        if (players[player].level == 0) {
            players[player].level = 1; // Base level
        }
        
        players[player].xp += amount;
        emit XPGained(player, amount, players[player].xp);
        
        // Level calculation (1000 XP per level)
        uint256 calculatedLevel = (players[player].xp / 1000) + 1;
        if (calculatedLevel > players[player].level) {
            players[player].level = calculatedLevel;
            emit LevelUp(player, calculatedLevel);
        }
    }
    
    // --- Leaderboard ---
    function updateLeaderboard(uint256 newRank) external {
        players[msg.sender].rank = newRank;
    }

    function getPlayerStats(address player) external view returns (Player memory) {
        return players[player];
    }
}
