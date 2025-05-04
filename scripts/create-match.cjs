// Script to create a match on the PingPongNFTGame contract
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Creating a match on the PingPongNFTGame contract...");

  const contractAddress = process.env.VITE_CONTRACT_ADDRESS;
  console.log(`Contract address: ${contractAddress}`);

  // Get the contract instance
  const PingPongNFTGame = await hre.ethers.getContractFactory("PingPongNFTGame");
  const pingPongGame = PingPongNFTGame.attach(contractAddress);

  // Get the signer
  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  console.log(`Creating match from address: ${deployerAddress}`);

  // Create a match with a small stake amount
  const stakeAmount = hre.ethers.parseEther("0.0001"); // 0.0001 ETH
  const opponentAddress = "0x0000000000000000000000000000000000000001"; // Dummy address for demo
  
  console.log(`Creating match with stake: ${hre.ethers.formatEther(stakeAmount)} ETH`);
  console.log(`Opponent address: ${opponentAddress}`);

  // Create the match
  const tx = await pingPongGame.createMatch(opponentAddress, { value: stakeAmount });
  console.log(`Transaction hash: ${tx.hash}`);
  
  // Wait for the transaction to be mined
  console.log("Waiting for transaction confirmation...");
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  
  // Get the game ID from the event
  const gameCreatedEvent = receipt.logs
    .filter(log => log.fragment && log.fragment.name === "GameCreated")
    .map(log => pingPongGame.interface.parseLog(log))[0];
  
  if (gameCreatedEvent) {
    const gameId = gameCreatedEvent.args[0];
    console.log(`Game created with ID: ${gameId}`);
    console.log(`View on Basescan: https://basescan.org/tx/${tx.hash}`);
  } else {
    console.log("Could not find GameCreated event in transaction logs");
  }
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
