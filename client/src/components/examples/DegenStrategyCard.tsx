import { DegenStrategyCard } from "../DegenStrategyCard";

export default function DegenStrategyCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <DegenStrategyCard
        name="Leveraged ETH/USDC LP x2"
        apyRange="20-50%"
        description="Deposits USDC, borrows ETH on Aave, provides LP on Uniswap v4."
        riskLevel={8}
        onExplore={() => console.log("Explore strategy clicked")}
      />
    </div>
  );
}
