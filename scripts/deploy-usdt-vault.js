import hre from "hardhat";

async function main() {
  console.log("Deploying BoostAaveVault for USDT to Celo mainnet...");

  // Celo Aave V3 Pool and USDT addresses
  const AAVE_POOL = "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402";  // Celo Aave V3 Pool
  const USDT = "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e";       // Native USDT on Celo

  console.log("Parameters:");
  console.log("- Aave Pool:", AAVE_POOL);
  console.log("- USDT Asset:", USDT);
  
  const BoostAaveVault = await hre.ethers.getContractFactory("BoostAaveVault");
  
  console.log("\nDeploying contract...");
  const vault = await BoostAaveVault.deploy(AAVE_POOL, USDT);

  await vault.waitForDeployment();
  
  const address = await vault.getAddress();
  console.log("\n✅ BoostAaveVault (USDT) deployed to:", address);
  console.log("\n📝 Update VITE_BOOST_VAULT_USDT_ADDRESS to:", address);
  console.log("\n🔍 View on CeloScan:", `https://celoscan.io/address/${address}`);
  
  // Verify aToken was set correctly
  const aToken = await vault.ATOKEN();
  console.log("\n✓ aToken address:", aToken);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
