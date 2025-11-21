import { SafeVaultCard } from "./SafeVaultCard";
import { Shield, Globe, Zap } from "lucide-react";

export function SafeShowcaseSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-safe-primary/10 rounded-full mb-6">
              <Shield className="h-5 w-5 text-safe-primary" />
              <span className="text-sm font-semibold text-safe-primary">Inflation Shield</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-accent">
              Your Shield Against Economic Chaos
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8">
              Beat inflation by 10x what banks offer. Built for everyday survivors in Argentina, Nigeria, Venezuela and beyond.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-safe-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-safe-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">8-18% APY on Stablecoins</h4>
                  <p className="text-sm text-muted-foreground">
                    Auto-optimized Uniswap V4 pools + Aave lending hooks. Near-zero impermanent loss.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-safe-primary/10 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-5 w-5 text-safe-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Celo-Optimized for Emerging Markets</h4>
                  <p className="text-sm text-muted-foreground">
                    Gasless entry, sub-cent fees. $50 minimum deposit. Native stables (cUSD).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SafeVaultCard
              name="Inflation Shield"
              apyRange="8-18%"
              description="Beat 100% inflation with auto-optimized yield. USDC, cUSD, and stablecoin LP positions."
              onOpenVault={() => console.log("Open vault")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
