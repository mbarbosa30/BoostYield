import { createPublicClient, http, parseUnits, formatUnits } from 'viem';
import { celo } from 'viem/chains';

const VAULT_ADDRESS = '0x7e2cb7e54ef8cf48e2f1f6326151cbcc9e4e5edb';
const USER_ADDRESS = '0x216844eF94D95279c6d1631875F2dd93FbBdfB61';
const ATOKEN_ADDRESS = '0x4e65fE4DbA92790696d040ac24Aa414708F5c0AB';

const client = createPublicClient({
  chain: celo,
  transport: http('https://forno.celo.org'),
});

const vaultABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalAssets',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'shares', type: 'uint256' }],
    name: 'previewRedeem',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'principalOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const aTokenABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

async function main() {
  console.log('\n📊 Vault Debug Info\n');

  // User shares
  const userShares = await client.readContract({
    address: VAULT_ADDRESS,
    abi: vaultABI,
    functionName: 'balanceOf',
    args: [USER_ADDRESS],
  });
  console.log(`User shares: ${formatUnits(userShares, 18)}`);

  // Total supply
  const totalSupply = await client.readContract({
    address: VAULT_ADDRESS,
    abi: vaultABI,
    functionName: 'totalSupply',
  });
  console.log(`Total supply: ${formatUnits(totalSupply, 18)}`);

  // Total assets
  const totalAssets = await client.readContract({
    address: VAULT_ADDRESS,
    abi: vaultABI,
    functionName: 'totalAssets',
  });
  console.log(`Total assets: ${formatUnits(totalAssets, 18)}`);

  // aToken balance
  const aTokenBalance = await client.readContract({
    address: ATOKEN_ADDRESS,
    abi: aTokenABI,
    functionName: 'balanceOf',
    args: [VAULT_ADDRESS],
  });
  console.log(`aToken balance: ${formatUnits(aTokenBalance, 18)}`);

  // User principal
  const userPrincipal = await client.readContract({
    address: VAULT_ADDRESS,
    abi: vaultABI,
    functionName: 'principalOf',
    args: [USER_ADDRESS],
  });
  console.log(`User principal: ${formatUnits(userPrincipal, 18)}`);

  // Preview redeem
  if (userShares > 0n) {
    const previewAssets = await client.readContract({
      address: VAULT_ADDRESS,
      abi: vaultABI,
      functionName: 'previewRedeem',
      args: [userShares],
    });
    console.log(`Preview redeem all shares: ${formatUnits(previewAssets, 18)}`);
    
    // Try smaller amount
    const smallShares = parseUnits('0.01', 18);
    const smallPreview = await client.readContract({
      address: VAULT_ADDRESS,
      abi: vaultABI,
      functionName: 'previewRedeem',
      args: [smallShares],
    });
    console.log(`Preview redeem 0.01 shares: ${formatUnits(smallPreview, 18)}`);
  }
}

main().catch(console.error);
