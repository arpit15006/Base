// Script to verify the PingPongGame contract deployment on Base mainnet
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Verifying PingPongNFTGame contract on Base mainnet...");

  const contractAddress = process.env.VITE_CONTRACT_ADDRESS;
  console.log(`Contract address: ${contractAddress}`);

  try {
    // Get the contract instance
    const PingPongNFTGame = await hre.ethers.getContractFactory("PingPongNFTGame");
    const pingPongGame = PingPongNFTGame.attach(contractAddress);

    // Check if the contract is deployed
    console.log("Checking if contract is deployed...");
    const name = await pingPongGame.name();
    const symbol = await pingPongGame.symbol();
    
    console.log(`Contract name: ${name}`);
    console.log(`Contract symbol: ${symbol}`);
    
    // Get the total number of games
    const totalGames = await pingPongGame.getMatchHistoryLength();
    console.log(`Total games played: ${totalGames}`);

    console.log("Contract verification successful!");
    console.log("The contract is deployed and working correctly on Base mainnet.");
    
    // Provide instructions for verifying on Basescan
    console.log("\nTo verify the contract on Basescan, run:");
    console.log(`npx hardhat verify --network base ${contractAddress}`);
    
  } catch (error) {
    console.error("Error verifying contract:", error);
    console.log("The contract may not be deployed correctly or there might be an issue with the RPC connection.");
  }
}

// Execute the verification
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
