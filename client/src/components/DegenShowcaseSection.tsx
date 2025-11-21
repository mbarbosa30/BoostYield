import { DegenStrategyCard } from "./DegenStrategyCard";
import { Zap, AlertTriangle, TrendingUp } from "lucide-react";

export function DegenShowcaseSection() {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <DegenStrategyCard
              name="Leveraged ETH/USDC LP x2"
              apyRange="20-50%"
              description="Deposits USDC, borrows ETH on Aave, provides LP on Uniswap v4."
              riskLevel={8}
              onExplore={() => console.log("Explore strategy")}
            />
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-degen-primary/10 rounded-full mb-6">
              <Zap className="h-5 w-5 text-degen-primary" />
              <span className="text-sm font-semibold text-degen-primary">Degen Mode</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              High-Risk, High-Reward
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8">
              Advanced strategies for experienced DeFi users. Leverage, liquidity pools, and structured positions for maximum yield potential.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Clear Risk Warnings</h4>
                  <p className="text-sm text-muted-foreground">
                    Every strategy shows risk levels 1-10 and requires acknowledgment.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-degen-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-degen-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Maximum Yield Potential</h4>
                  <p className="text-sm text-muted-foreground">
                    Earn 20-50%+ APY through leveraged positions and advanced DeFi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
