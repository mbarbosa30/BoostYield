import { SafeVaultCard } from "./SafeVaultCard";
import { Shield, Globe, Zap, Heart, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SafeShowcaseSectionProps {
  onOpenVault?: () => void;
}

export function SafeShowcaseSection({ onOpenVault }: SafeShowcaseSectionProps) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-safe-primary/10 text-safe-primary border-safe-primary/20">
            <Shield className="h-3 w-3 mr-1" />
            Recommended for most users
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-accent">
            Inflation Shield
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Beat inflation by 10x what banks offer. Your money fights back while your yield builds communities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-accent">How It Works</h3>
              <p className="text-muted-foreground mb-6">
                Auto-optimized Uniswap V4 stablecoin pools combined with Aave lending hooks. Near-zero impermanent loss. Set it and forget it.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Expected APY</p>
                <p className="text-4xl font-bold tabular-nums text-safe-primary">8-18%</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-2 w-2 rounded-full bg-safe-primary" />
                    ))}
                    {[4,5,6,7,8,9,10].map(i => (
                      <div key={i} className="h-2 w-2 rounded-full bg-muted" />
                    ))}
                  </div>
                  <span className="text-xl font-semibold">3/10</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-safe-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-safe-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Auto-Optimized Yield</h4>
                  <p className="text-sm text-muted-foreground">
                    Smart routing across USDC, cUSD, and DAI pools. Rebalances automatically for maximum safety.
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
                    Gasless entry, sub-cent fees. $50 minimum deposit works. Native stablecoins (cUSD) built-in.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-safe-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-5 w-5 text-safe-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">No Lockups, Withdraw Anytime</h4>
                  <p className="text-sm text-muted-foreground">
                    Your funds stay liquid. Pull out in seconds, no penalties, no waiting periods.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-safe-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="p-5 bg-safe-primary/10 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-safe-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold">M</span>
                    </div>
                    <p className="font-semibold">The Maria Story</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Maria in Buenos Aires watches the peso collapse (100% annual inflation). She deposits $500 USDC into Inflation Shield, earns 12% APY in stable dollars. That's 112% ahead of inflation eating her neighbors' savings.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    She donates 25% of her yield to a local school fund. One tap. Transparent on-chain tracking. Tax receipts included.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-safe-primary font-semibold">
                    <span>$60/year yield</span>
                    <span>•</span>
                    <span>$15 to schools</span>
                    <span>•</span>
                    <span>Global leaderboard</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-impact-primary/10 rounded-lg">
                  <Heart className="h-5 w-5 text-impact-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold mb-1">Impact Layer (Optional)</p>
                    <p className="text-xs text-muted-foreground">
                      Donate 0-100% of your yield to vetted causes. Global leaderboard tracks community impact.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SafeVaultCard
              name="Inflation Shield"
              apyRange="8-18%"
              description="Beat 100% inflation with auto-optimized yield. USDC, cUSD, and stablecoin LP positions."
              onOpenVault={onOpenVault}
            />

            <p className="text-xs text-muted-foreground text-center">
              Celo-optimized • Gasless entry • Sub-cent fees • Not a bank • DeFi carries risks
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
