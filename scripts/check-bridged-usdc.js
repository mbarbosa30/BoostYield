import { ethers } from 'ethers';

async function main() {
  console.log("🔍 Checking bridged USDC on Aave V3 Celo...\n");

  const AAVE_POOL = "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402";
  const BRIDGED_USDC = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C"; // Legacy bridged USDC

  const provider = new ethers.JsonRpcProvider("https://forno.celo.org");

  const poolAbi = [
    "function getReserveData(address asset) external view returns (tuple(uint256 configuration, uint128 liquidityIndex, uint128 currentLiquidityRate, uint128 variableBorrowIndex, uint128 currentVariableBorrowRate, uint128 currentStableBorrowRate, uint40 lastUpdateTimestamp, uint16 id, address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress, address interestRateStrategyAddress, uint128 accruedToTreasury, uint128 unbacked, uint128 isolationModeTotalDebt))"
  ];

  const pool = new ethers.Contract(AAVE_POOL, poolAbi, provider);

  console.log("Checking Bridged USDC (Wormhole):");
  try {
    const data = await pool.getReserveData(BRIDGED_USDC);
    console.log("✅ Bridged USDC aToken:", data.aTokenAddress);
    console.log("   Liquidity Rate:", data.currentLiquidityRate.toString());
    console.log("   Liquidity Index:", data.liquidityIndex.toString());
    
    if (data.aTokenAddress === ethers.ZeroAddress) {
      console.log("❌ Bridged USDC is also not configured");
    } else {
      console.log("\n✅ Bridged USDC IS supported on Aave V3!");
      console.log("   We should use this address instead of native USDC");
    }
  } catch (error) {
    console.log("❌ Check failed:", error.message);
  }

  // Check the token symbol/decimals
  const erc20Abi = [
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function name() view returns (string)"
  ];

  const token = new ethers.Contract(BRIDGED_USDC, erc20Abi, provider);
  try {
    const symbol = await token.symbol();
    const decimals = await token.decimals();
    const name = await token.name();
    console.log("\n📋 Token Info:");
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Decimals:", decimals);
  } catch (error) {
    console.log("Could not fetch token info");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
