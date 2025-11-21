import { SafeVaultCard } from "./SafeVaultCard";
import { Shield, Lock, TrendingUp } from "lucide-react";

export function SafeShowcaseSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-safe-primary/10 rounded-full mb-6">
              <Shield className="h-5 w-5 text-safe-primary" />
              <span className="text-sm font-semibold text-safe-primary">Safe Mode</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Protect Your Savings
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8">
              Conservative yield strategies designed for stability. Your funds work for you while staying protected from inflation.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-safe-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-5 w-5 text-safe-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Low Risk Strategies</h4>
                  <p className="text-sm text-muted-foreground">
                    Conservative lending and stable LP positions with minimal volatility.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-safe-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-safe-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Steady Returns</h4>
                  <p className="text-sm text-muted-foreground">
                    Earn 4-6% APY through proven DeFi protocols like Aave.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <SafeVaultCard
              name="Inflation Shield Vault"
              apyRange="4-6%"
              description="Conservative yield using lending + trading fees on stablecoins."
              onOpenVault={() => console.log("Open vault")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
