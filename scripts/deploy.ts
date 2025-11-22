import hre from "hardhat";
const { ethers } = hre;

async function main() {
  console.log("🚀 Deploying BoostAaveVault to Celo mainnet...\n");

  // Celo mainnet addresses
  const AAVE_POOL = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
  const CUSD_TOKEN = "0x765DE816845861e75A25fCA122E05401653187cE";

  console.log("Configuration:");
  console.log("- Aave V3 Pool:", AAVE_POOL);
  console.log("- cUSD Token:", CUSD_TOKEN);
  console.log("");

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");
  console.log("");

  if (balance < ethers.parseEther("0.01")) {
    console.warn("⚠️  WARNING: Low CELO balance. You may need more for gas.");
    console.log("Continuing anyway...\n");
  }

  // Deploy contract
  console.log("Deploying contract...");
  const BoostAaveVault = await ethers.getContractFactory("BoostAaveVault");
  
  const vault = await BoostAaveVault.deploy(AAVE_POOL, CUSD_TOKEN);
  
  console.log("Waiting for deployment transaction...");
  await vault.waitForDeployment();

  const vaultAddress = await vault.getAddress();
  console.log("");
  console.log("✅ BoostAaveVault deployed successfully!");
  console.log("📍 Contract address:", vaultAddress);
  console.log("");

  // Verify deployment
  console.log("Verifying deployment...");
  const asset = await vault.ASSET();
  const pool = await vault.POOL();
  const aToken = await vault.ATOKEN();
  
  console.log("Verification checks:");
  console.log("- ASSET (cUSD):", asset);
  console.log("- POOL (Aave):", pool);
  console.log("- ATOKEN:", aToken);
  console.log("");

  if (asset.toLowerCase() !== CUSD_TOKEN.toLowerCase()) {
    console.error("❌ ERROR: Asset address mismatch!");
    process.exit(1);
  }

  if (pool.toLowerCase() !== AAVE_POOL.toLowerCase()) {
    console.error("❌ ERROR: Pool address mismatch!");
    process.exit(1);
  }

  console.log("✅ All verification checks passed!");
  console.log("");
  console.log("🎉 Deployment complete!");
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("NEXT STEPS:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("1. Set the vault address in Replit Secrets:");
  console.log(`   VITE_BOOST_VAULT_ADDRESS=${vaultAddress}`);
  console.log("");
  console.log("2. Restart the application to load the new address");
  console.log("");
  console.log("3. View on Celoscan:");
  console.log(`   https://celoscan.io/address/${vaultAddress}`);
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
