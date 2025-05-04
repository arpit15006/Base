// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract PingPongNFTGame is ERC721URIStorage, Ownable {
    // Custom counter implementation since Counters.sol is deprecated
    struct Counter {
        uint256 _value;
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        counter._value += 1;
    }

    constructor() ERC721("PingPongNFT", "PPNFT") Ownable(msg.sender) {}

    enum MatchStatus { Pending, Ongoing, Completed, Cancelled }

    struct Game {
        address player1;
        address player2;
        uint256 stake;
        address winner;
        bool isFinished;
        bool isCancelled;
    }

    struct MatchResult {
        uint256 gameId;
        address player1;
        address player2;
        address winner;
        uint256 stake;
        uint256 timestamp;
    }

    struct NFTAttributes {
        uint256 strength;
        uint256 speed;
    }

    Counter private gameIdCounter;
    Counter private tokenIdCounter;

    mapping(uint256 => Game) public games;
    mapping(address => uint256) public balances;
    mapping(uint256 => MatchResult) public matchHistory;
    mapping(address => uint256) public playerWins;
    mapping(address => uint256) public playerGames;
    mapping(uint256 => NFTAttributes) public nftAttributes;
    mapping(uint256 => uint256) public nftPrices;

    event GameCreated(uint256 indexed gameId, address indexed player1, address indexed player2, uint256 stake);
    event GameJoined(uint256 indexed gameId, address indexed player2);
    event GameFinished(uint256 indexed gameId, address indexed winner);
    event GameCancelled(uint256 indexed gameId, address indexed player1);
    event NFTMinted(address indexed to, uint256 tokenId, uint256 strength, uint256 speed);
    event NFTListed(uint256 tokenId, uint256 price);
    event NFTPurchased(address buyer, uint256 tokenId, uint256 price);

    modifier onlyPlayer(uint256 gameId) {
        require(msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2, "Not a player");
        _;
    }

    receive() external payable {}

    function createMatch(address opponent) external payable returns (uint256) {
        require(msg.sender != opponent, "You cannot play against yourself");
        require(msg.value > 0, "Stake must be greater than 0");

        uint256 gameId = current(gameIdCounter);
        increment(gameIdCounter);

        games[gameId] = Game({
            player1: msg.sender,
            player2: opponent,
            stake: msg.value,
            winner: address(0),
            isFinished: false,
            isCancelled: false
        });

        emit GameCreated(gameId, msg.sender, opponent, msg.value);
        return gameId;
    }

    function joinMatch(uint256 gameId) external payable {
        Game storage game = games[gameId];
        require(game.player2 == msg.sender, "Not invited to this match");
        require(game.player1 != address(0), "Game does not exist");
        require(!game.isCancelled && !game.isFinished, "Game is not joinable");
        require(game.stake == msg.value, "Stake must match");

        game.stake += msg.value;

        emit GameJoined(gameId, msg.sender);
    }

    function cancelMatch(uint256 gameId) external {
        Game storage game = games[gameId];
        require(msg.sender == game.player1, "Only creator can cancel");
        require(game.player2 == address(0), "Cannot cancel after opponent joined");
        require(!game.isCancelled, "Already cancelled");

        game.isCancelled = true;
        payable(game.player1).transfer(game.stake);

        emit GameCancelled(gameId, game.player1);
    }

    function reportMatchResult(uint256 gameId, address winner) external onlyOwner {
        Game storage game = games[gameId];
        require(!game.isFinished && !game.isCancelled, "Already completed or cancelled");
        require(winner == game.player1 || winner == game.player2, "Invalid winner");

        game.winner = winner;
        game.isFinished = true;

        // Update player stats
        playerWins[winner]++;
        playerGames[game.player1]++;
        playerGames[game.player2]++;

        // Store match result
        matchHistory[gameId] = MatchResult({
            gameId: gameId,
            player1: game.player1,
            player2: game.player2,
            winner: winner,
            stake: game.stake,
            timestamp: block.timestamp
        });

        // Transfer reward
        payable(winner).transfer(game.stake);

        emit GameFinished(gameId, winner);
    }

    // ----- Match Info -----

    function getGame(uint256 gameId) public view returns (Game memory) {
        return games[gameId];
    }

    function getMatchResult(uint256 gameId) public view returns (MatchResult memory) {
        return matchHistory[gameId];
    }

    function getMatchHistoryLength() public view returns (uint256) {
        return current(gameIdCounter);
    }

    function getPlayerStats(address player) public view returns (uint256 played, uint256 won) {
        return (playerGames[player], playerWins[player]);
    }

    function getTopPlayers() public view returns (address[] memory) {
        // Not sorted, just sample leaderboard logic
        uint256 totalPlayers = current(gameIdCounter);
        address[] memory top = new address[](totalPlayers);
        uint256 index = 0;

        for (uint256 i = 0; i < totalPlayers; i++) {
            address winner = matchHistory[i].winner;
            if (winner != address(0)) {
                top[index++] = winner;
            }
        }

        return top;
    }

    // ----- NFT Logic -----

    function mintNFT(string memory tokenURI, uint256 strength, uint256 speed) external returns (uint256) {
        uint256 tokenId = current(tokenIdCounter);
        increment(tokenIdCounter);

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nftAttributes[tokenId] = NFTAttributes(strength, speed);

        emit NFTMinted(msg.sender, tokenId, strength, speed);
        return tokenId;
    }

    function getNFTStats(uint256 tokenId) external view returns (uint256 strength, uint256 speed) {
        NFTAttributes memory attr = nftAttributes[tokenId];
        return (attr.strength, attr.speed);
    }

    // ----- Marketplace -----

    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Invalid price");

        nftPrices[tokenId] = price;
        emit NFTListed(tokenId, price);
    }

    function buyNFT(uint256 tokenId) external payable {
        uint256 price = nftPrices[tokenId];
        require(price > 0, "NFT not for sale");
        require(msg.value >= price, "Insufficient payment");

        address seller = ownerOf(tokenId);

        _transfer(seller, msg.sender, tokenId);
        payable(seller).transfer(price);

        nftPrices[tokenId] = 0;
        emit NFTPurchased(msg.sender, tokenId, price);
    }

    function getNFTPrice(uint256 tokenId) external view returns (uint256) {
        return nftPrices[tokenId];
    }
}