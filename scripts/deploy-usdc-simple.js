import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("🚀 Deploying BoostAaveVault for USDC to Celo mainnet...\n");

  // Check for private key
  if (!process.env.DEPLOYER_PRIVATE_KEY) {
    throw new Error("DEPLOYER_PRIVATE_KEY environment variable not set");
  }

  // Celo Aave V3 addresses
  const AAVE_POOL = "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402";
  // Using bridged USDC (Wormhole) - native USDC is not supported on Aave V3 Celo
  const USDC = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";

  console.log("📋 Configuration:");
  console.log("- Network: Celo Mainnet");
  console.log("- Aave Pool:", AAVE_POOL);
  console.log("- USDC Asset:", USDC);
  console.log();

  // Connect to Celo with timeout settings
  const provider = new ethers.JsonRpcProvider("https://forno.celo.org", {
    chainId: 42220,
    name: 'celo'
  });
  provider.pollingInterval = 2000; // Check every 2 seconds
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  
  console.log("💼 Deployer address:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "CELO");
  console.log();

  // Load contract ABI and bytecode
  const artifactPath = path.join(__dirname, '../artifacts/contracts/BoostAaveVault.sol/BoostAaveVault.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

  // Create contract factory
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  console.log("⏳ Deploying contract...");
  const contract = await factory.deploy(AAVE_POOL, USDC, {
    gasLimit: 3000000 // Set explicit gas limit
  });
  
  console.log("📤 Transaction hash:", contract.deploymentTransaction().hash);
  console.log("⏳ Waiting for deployment transaction to be mined (this may take 30-60 seconds)...");
  
  const receipt = await contract.deploymentTransaction().wait(1); // Wait for 1 confirmation
  console.log("✅ Transaction mined in block:", receipt.blockNumber);
  
  const address = await contract.getAddress();
  console.log("\n✅ BoostAaveVault (USDC) deployed to:", address);
  console.log("🔍 View on CeloScan:", `https://celoscan.io/address/${address}`);
  
  // Verify configuration
  console.log("\n🔧 Verifying vault configuration...");
  const assetAddress = await contract.ASSET();
  const aTokenAddress = await contract.ATOKEN();
  const poolAddress = await contract.POOL();
  
  console.log("- Underlying Asset:", assetAddress);
  console.log("- aToken Address:", aTokenAddress);
  console.log("- Pool Address:", poolAddress);
  
  console.log("\n📝 Next step: Set VITE_BOOST_VAULT_USDC_ADDRESS=" + address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  });
