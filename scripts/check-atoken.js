import { createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';

const POOL_ADDRESS = '0x3E59f0A50F574cda75a86Da9E8a648AaD1823402';
const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a';

const client = createPublicClient({
  chain: celo,
  transport: http('https://forno.celo.org'),
});

const poolABI = [
  {
    inputs: [{ name: 'asset', type: 'address' }],
    name: 'getReserveData',
    outputs: [
      {
        components: [
          { name: 'configuration', type: 'uint256' },
          { name: 'liquidityIndex', type: 'uint128' },
          { name: 'currentLiquidityRate', type: 'uint128' },
          { name: 'variableBorrowIndex', type: 'uint128' },
          { name: 'currentVariableBorrowRate', type: 'uint128' },
          { name: 'currentStableBorrowRate', type: 'uint128' },
          { name: 'lastUpdateTimestamp', type: 'uint40' },
          { name: 'id', type: 'uint16' },
          { name: 'aTokenAddress', type: 'address' },
          { name: 'stableDebtTokenAddress', type: 'address' },
          { name: 'variableDebtTokenAddress', type: 'address' },
          { name: 'interestRateStrategyAddress', type: 'address' },
          { name: 'accruedToTreasury', type: 'uint128' },
          { name: 'unbacked', type: 'uint128' },
          { name: 'isolationModeTotalDebt', type: 'uint128' },
        ],
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

async function main() {
  console.log('\n🔍 Checking cUSD Reserve Data on Aave V3 Celo\n');

  const reserveData = await client.readContract({
    address: POOL_ADDRESS,
    abi: poolABI,
    functionName: 'getReserveData',
    args: [CUSD_ADDRESS],
  });

  console.log(`aToken Address: ${reserveData.aTokenAddress}`);
  console.log(`Stable Debt Token: ${reserveData.stableDebtTokenAddress}`);
  console.log(`Variable Debt Token: ${reserveData.variableDebtTokenAddress}`);
}

main().catch(console.error);
