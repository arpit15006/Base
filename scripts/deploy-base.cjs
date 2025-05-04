// Script to deploy PingPongGame contract to Base chain
const hre = require("hardhat");

async function main() {
  console.log("Deploying PingPongNFTGame contract to Base chain...");

  // Get the contract factory
  const PingPongNFTGame = await hre.ethers.getContractFactory("PingPongNFTGame");

  // Deploy the contract
  const pingPongGame = await PingPongNFTGame.deploy();

  // Wait for deployment to finish
  await pingPongGame.waitForDeployment();

  const deployedAddress = await pingPongGame.getAddress();
  console.log("PingPongNFTGame deployed to:", deployedAddress);

  // Verify the contract on Basescan (optional)
  console.log("To verify the contract on Basescan, run:");
  console.log(`npx hardhat verify --network base ${deployedAddress}`);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await pingPongGame.deploymentTransaction().wait(5);
  console.log("Contract deployment confirmed!");
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
