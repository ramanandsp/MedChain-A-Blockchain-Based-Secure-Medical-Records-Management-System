// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const MedChainV2 = await hre.ethers.getContractFactory("MedChainV2");
  const medchain = await MedChainV2.deploy();

  await medchain.deployed(); // ✅ correct for Ethers v5

  console.log("✅ MedChainV2 deployed to:", medchain.address);

  const [deployer] = await hre.ethers.getSigners();
  console.log("👑 Admin wallet:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
