// Script to check the balance of the deployment wallet
const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Checking wallet balance on Base mainnet...");

  // Get the signer
  const [deployer] = await hre.ethers.getSigners();
  const address = await deployer.getAddress();

  console.log(`Wallet address: ${address}`);

  // Get the balance
  const balance = await hre.ethers.provider.getBalance(address);
  const balanceInEth = hre.ethers.formatEther(balance);

  console.log(`Balance: ${balance} wei (${balanceInEth} ETH)`);

  // Estimate gas for deployment
  const PingPongNFTGame = await hre.ethers.getContractFactory("PingPongNFTGame");
  const deploymentData = PingPongNFTGame.interface.encodeDeploy([]);

  // Estimate gas
  const estimatedGas = await hre.ethers.provider.estimateGas({
    from: address,
    data: deploymentData
  }).catch(error => {
    console.log("Error estimating gas:", error.message);
    return hre.ethers.getBigInt("5000000"); // Fallback to 5 million gas
  });

  const gasPrice = hre.ethers.parseUnits("1", "gwei"); // 1 gwei
  const deploymentCost = estimatedGas * gasPrice;
  const deploymentCostInEth = hre.ethers.formatEther(deploymentCost);

  console.log(`Estimated deployment cost: ${deploymentCost} wei (${deploymentCostInEth} ETH)`);

  if (balance < deploymentCost) {
    console.log(`\nINSUFFICIENT FUNDS: You need at least ${deploymentCostInEth} ETH to deploy the contract.`);
    console.log(`Please add more ETH to your wallet (${address}) on Base mainnet.`);
  } else {
    console.log(`\nSUFFICIENT FUNDS: You have enough ETH to deploy the contract.`);
  }
}

// Execute the check
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
