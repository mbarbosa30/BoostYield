import hre from "hardhat";
import "@nomicfoundation/hardhat-ethers";

async function main() {
  console.log("Deploying BoostAaveVault for USDC to Celo mainnet...");

  // Celo Aave V3 addresses
  const AAVE_POOL = "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402";  // Celo Aave V3 Pool
  const USDC = "0xef4229c8c3250C675F21BCefa42f58EfbfF6002a";      // Native USDC token on Celo

  console.log("Parameters:");
  console.log("- Aave Pool:", AAVE_POOL);
  console.log("- USDC Asset:", USDC);

  console.log("hre.ethers:", hre.ethers);
  console.log("hre keys:", Object.keys(hre));
  
  if (!hre.ethers) {
    throw new Error("hre.ethers is undefined - hardhat-ethers plugin not loaded");
  }
  
  const ethers = hre.ethers;
  const BoostAaveVault = await ethers.getContractFactory("BoostAaveVault");
  const vault = await BoostAaveVault.deploy(AAVE_POOL, USDC);

  await vault.waitForDeployment();
  
  const address = await vault.getAddress();
  console.log("\n✅ BoostAaveVault (USDC) deployed to:", address);
  console.log("\n📝 Set this as VITE_BOOST_VAULT_USDC_ADDRESS in your environment");
  console.log("\n🔍 View on CeloScan:", `https://celoscan.io/address/${address}`);
  
  // Verify the vault is correctly configured
  const assetAddress = await vault.ASSET();
  const aTokenAddress = await vault.ATOKEN();
  console.log("\n🔧 Vault Configuration:");
  console.log("- Underlying Asset:", assetAddress);
  console.log("- aToken Address:", aTokenAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
