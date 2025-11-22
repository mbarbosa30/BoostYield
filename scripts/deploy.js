import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log("🚀 Deploying BoostAaveVault to Celo mainnet...\n");

  // Celo mainnet addresses (checksummed)
  const AAVE_POOL = "0x794a61358D6845594F94dc1DB02A252b5b4814aD";
  const CUSD_TOKEN = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

  console.log("Configuration:");
  console.log("- Aave V3 Pool:", AAVE_POOL);
  console.log("- cUSD Token:", CUSD_TOKEN);
  console.log("");

  // Check for private key
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ ERROR: DEPLOYER_PRIVATE_KEY environment variable not set");
    process.exit(1);
  }

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider("https://forno.celo.org");
  const deployer = new ethers.Wallet(privateKey, provider);
  
  console.log("Deploying with account:", deployer.address);

  // Check balance
  const balance = await provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "CELO");
  console.log("");

  if (balance < ethers.parseEther("0.01")) {
    console.warn("⚠️  WARNING: Low CELO balance. You may need more for gas.");
    console.log("Continuing anyway...\n");
  }

  // Load compiled contract
  const artifactPath = join(__dirname, "../artifacts/contracts/BoostAaveVault.sol/BoostAaveVault.json");
  const artifact = JSON.parse(readFileSync(artifactPath, "utf8"));

  // Deploy contract
  console.log("Deploying contract...");
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, deployer);
  const vault = await factory.deploy(AAVE_POOL, CUSD_TOKEN);
  
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
