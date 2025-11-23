import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // Get token from command line args
  const tokenArg = process.argv[2];
  if (!tokenArg || !['USDT', 'CELO'].includes(tokenArg)) {
    console.error('Usage: node deploy-standalone.js [USDT|CELO]');
    process.exit(1);
  }

  console.log(`\n🚀 Deploying BoostAaveVault for ${tokenArg} to Celo mainnet...\n`);

  // Token configurations
  const TOKENS = {
    USDT: {
      address: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e',
      name: 'Tether USD'
    },
    CELO: {
      address: '0x471EcE3750Da237f93B8E339c536989b8978a438',
      name: 'Celo Native Asset'
    }
  };

  const AAVE_POOL = '0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402';
  const token = TOKENS[tokenArg];

  console.log('Parameters:');
  console.log(`- Token: ${token.name}`);
  console.log(`- Token Address: ${token.address}`);
  console.log(`- Aave Pool: ${AAVE_POOL}`);

  // Setup provider and wallet
  const rpcUrl = 'https://forno.celo.org';
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('DEPLOYER_PRIVATE_KEY not set in environment');
  }
  
  const wallet = new ethers.Wallet(privateKey, provider);
  const deployerAddress = await wallet.getAddress();
  console.log(`\n📍 Deployer address: ${deployerAddress}`);

  // Check balance
  const balance = await provider.getBalance(deployerAddress);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} CELO`);

  if (balance === 0n) {
    throw new Error('Deployer has no CELO for gas');
  }

  // Load contract artifact
  const artifactPath = path.join(__dirname, '../artifacts/contracts/BoostAaveVault.sol/BoostAaveVault.json');
  const artifact = JSON.parse(readFileSync(artifactPath, 'utf8'));

  // Create contract factory
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  // Estimate gas
  console.log('\n⛽ Estimating gas...');
  const deployTx = await factory.getDeployTransaction(AAVE_POOL, token.address);
  const gasEstimate = await provider.estimateGas(deployTx);
  console.log(`Gas estimate: ${gasEstimate.toString()}`);

  // Deploy contract
  console.log(`\n📝 Deploying contract...`);
  const contract = await factory.deploy(AAVE_POOL, token.address);
  
  console.log(`⏳ Transaction hash: ${contract.deploymentTransaction().hash}`);
  console.log('Waiting for confirmation...');
  
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log(`\n✅ BoostAaveVault (${tokenArg}) deployed successfully!`);
  console.log(`📍 Contract address: ${address}`);
  console.log(`\n🔍 View on CeloScan: https://celoscan.io/address/${address}`);

  // Verify configuration
  console.log('\n🔧 Verifying vault configuration...');
  const aTokenAddress = await contract.ATOKEN();
  console.log(`✓ aToken address: ${aTokenAddress}`);

  console.log(`\n📝 Environment variable to set:`);
  console.log(`VITE_BOOST_VAULT_${tokenArg}_ADDRESS=${address}`);
}

main()
  .then(() => {
    console.log('\n✨ Deployment complete!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Deployment failed:');
    console.error(error);
    process.exit(1);
  });
