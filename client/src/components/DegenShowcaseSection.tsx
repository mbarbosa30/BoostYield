import { DegenStrategyCard } from "./DegenStrategyCard";
import { Flame, AlertTriangle, Rocket } from "lucide-react";

export function DegenShowcaseSection() {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <DegenStrategyCard
              name="Leveraged ETH/USDC LP"
              apyRange="30-300%+"
              description="Auto-looped leverage on Uniswap v4. Borrows ETH on Aave, multiplies exposure. One-click entry."
              riskLevel={8}
              onExplore={() => console.log("Explore strategy")}
            />
          </div>

          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-degen-primary/10 rounded-full mb-6">
              <Flame className="h-5 w-5 text-degen-primary" />
              <span className="text-sm font-semibold text-degen-primary">Max Yield</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-accent">
              Rocket Fuel for Returns
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8">
              Auto-looped leverage for yield-hungry degens. Buffered against liquidation but not guaranteed. For experienced users only.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Can Lose Everything</h4>
                  <p className="text-sm text-muted-foreground">
                    Risk level 8/10. Requires DeFi experience. Only use funds you can afford to lose.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-degen-primary/10 flex items-center justify-center flex-shrink-0">
                  <Rocket className="h-5 w-5 text-degen-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">30-300%+ APY Potential</h4>
                  <p className="text-sm text-muted-foreground">
                    Outperforms Summer.fi manual strategies. Combined UniV4 + Aave magic with auto-routing.
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
