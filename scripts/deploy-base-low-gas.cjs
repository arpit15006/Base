// Script to deploy PingPongGame contract to Base chain with lower gas price
const hre = require("hardhat");

async function main() {
  console.log("Deploying PingPongNFTGame contract to Base chain with lower gas price...");

  // Get the contract factory
  const PingPongNFTGame = await hre.ethers.getContractFactory("PingPongNFTGame");

  // Deploy the contract with lower gas price
  const deploymentOptions = {
    gasPrice: hre.ethers.parseUnits("0.1", "gwei"), // Very low gas price
    gasLimit: 3000000 // Lower gas limit
  };

  console.log("Deployment options:", deploymentOptions);
  console.log("Starting deployment...");

  // Deploy the contract
  const pingPongGame = await PingPongNFTGame.deploy(deploymentOptions);

  // Wait for deployment to finish
  console.log("Waiting for deployment transaction...");
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

  // Update the .env file with the new contract address
  console.log("\nIMPORTANT: Update your .env file with the new contract address:");
  console.log(`VITE_CONTRACT_ADDRESS=${deployedAddress}`);
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
