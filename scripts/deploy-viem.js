import { createWalletClient, createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log("Deploying BoostAaveVault to Celo mainnet with viem...");

  // Correct Celo Aave V3 addresses
  const AAVE_POOL = "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402";
  const CUSD = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

  console.log("Parameters:");
  console.log("- Aave Pool:", AAVE_POOL);
  console.log("- cUSD Asset:", CUSD);

  // Load contract artifact
  const artifactPath = join(__dirname, '../artifacts/contracts/BoostAaveVault.sol/BoostAaveVault.json');
  const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));

  // Setup account from private key
  if (!process.env.DEPLOYER_PRIVATE_KEY) {
    throw new Error("DEPLOYER_PRIVATE_KEY not found in environment");
  }

  const account = privateKeyToAccount(`0x${process.env.DEPLOYER_PRIVATE_KEY.replace('0x', '')}`);
  console.log("\nDeploying from:", account.address);

  // Create clients
  const publicClient = createPublicClient({
    chain: celo,
    transport: http('https://forno.celo.org')
  });

  const walletClient = createWalletClient({
    account,
    chain: celo,
    transport: http('https://forno.celo.org')
  });

  // Deploy contract
  console.log("\nDeploying contract...");
  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args: [AAVE_POOL, CUSD],
  });

  console.log("Transaction hash:", hash);
  console.log("Waiting for confirmation...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  console.log("\n✅ BoostAaveVault deployed to:", receipt.contractAddress);
  console.log("\n📝 Update VITE_BOOST_VAULT_ADDRESS in your frontend to:", receipt.contractAddress);
  console.log("\n🔍 View on CeloScan:", `https://celoscan.io/address/${receipt.contractAddress}`);
  
  return receipt.contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
