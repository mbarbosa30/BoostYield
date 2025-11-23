import hre from "hardhat";

async function main() {
  console.log("Deploying BoostAaveVault for CELO to Celo mainnet...");

  // Celo Aave V3 Pool and CELO addresses
  const AAVE_POOL = "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402";  // Celo Aave V3 Pool
  const CELO = "0x471EcE3750Da237f93B8E339c536989b8978a438";       // Native CELO token

  console.log("Parameters:");
  console.log("- Aave Pool:", AAVE_POOL);
  console.log("- CELO Asset:", CELO);
  
  const BoostAaveVault = await hre.ethers.getContractFactory("BoostAaveVault");
  
  console.log("\nDeploying contract...");
  const vault = await BoostAaveVault.deploy(AAVE_POOL, CELO);

  await vault.waitForDeployment();
  
  const address = await vault.getAddress();
  console.log("\n✅ BoostAaveVault (CELO) deployed to:", address);
  console.log("\n📝 Update VITE_BOOST_VAULT_CELO_ADDRESS to:", address);
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
