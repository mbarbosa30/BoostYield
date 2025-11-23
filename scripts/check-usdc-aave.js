import { ethers } from 'ethers';

async function main() {
  console.log("🔍 Checking USDC support on Aave V3 Celo...\n");

  const AAVE_POOL = "0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402";
  const USDC = "0xef4229c8c3250C675F21BCefa42f58EfbfF6002a";
  const CUSD = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

  const provider = new ethers.JsonRpcProvider("https://forno.celo.org");

  // Aave Pool ABI for getReserveData
  const poolAbi = [
    "function getReserveData(address asset) external view returns (tuple(uint256 configuration, uint128 liquidityIndex, uint128 currentLiquidityRate, uint128 variableBorrowIndex, uint128 currentVariableBorrowRate, uint128 currentStableBorrowRate, uint40 lastUpdateTimestamp, uint16 id, address aTokenAddress, address stableDebtTokenAddress, address variableDebtTokenAddress, address interestRateStrategyAddress, uint128 accruedToTreasury, uint128 unbacked, uint128 isolationModeTotalDebt))"
  ];

  const pool = new ethers.Contract(AAVE_POOL, poolAbi, provider);

  console.log("Checking cUSD (known working):");
  try {
    const cusdData = await pool.getReserveData(CUSD);
    console.log("✅ cUSD aToken:", cusdData.aTokenAddress);
    console.log("   Liquidity Rate:", cusdData.currentLiquidityRate.toString());
  } catch (error) {
    console.log("❌ cUSD not supported:", error.message);
  }

  console.log("\nChecking USDC:");
  try {
    const usdcData = await pool.getReserveData(USDC);
    console.log("✅ USDC aToken:", usdcData.aTokenAddress);
    console.log("   Liquidity Rate:", usdcData.currentLiquidityRate.toString());
    
    if (usdcData.aTokenAddress === ethers.ZeroAddress) {
      console.log("⚠️  USDC is not configured in Aave V3 pool (aToken is zero address)");
    }
  } catch (error) {
    console.log("❌ USDC check failed:", error.message);
  }

  // Also check if there's a different USDC address
  console.log("\n📝 Note: Celo has multiple USDC variants:");
  console.log("- Native USDC: 0xef4229c8c3250C675F21BCefa42f58EfbfF6002a");
  console.log("- Bridged USDC: 0xcebA9300f2b948710d2653dD7B07f33A8B32118C (legacy)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
