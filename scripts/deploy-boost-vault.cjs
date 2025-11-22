const hre = require("hardhat");

async function main() {
  console.log("Deploying BoostAaveVault to Celo mainnet...");

  // Correct Celo Aave V3 addresses
  const AAVE_POOL = "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402";  // Celo Aave V3 Pool
  const CUSD = "0x765DE816845861e75A25fCA122bb6898B8B1282a";      // cUSD token

  console.log("Parameters:");
  console.log("- Aave Pool:", AAVE_POOL);
  console.log("- cUSD Asset:", CUSD);

  const BoostAaveVault = await hre.ethers.getContractFactory("BoostAaveVault");
  const vault = await BoostAaveVault.deploy(AAVE_POOL, CUSD);

  await vault.waitForDeployment();
  
  const address = await vault.getAddress();
  console.log("\n✅ BoostAaveVault deployed to:", address);
  console.log("\n📝 Update VITE_BOOST_VAULT_ADDRESS in your frontend to:", address);
  console.log("\n🔍 View on CeloScan:", `https://celoscan.io/address/${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
