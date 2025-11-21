import { DegenStrategyCard } from "./DegenStrategyCard";
import { Flame, AlertTriangle, Rocket, TrendingUp, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface DegenShowcaseSectionProps {
  onExploreStrategy?: () => void;
}

export function DegenShowcaseSection({ onExploreStrategy }: DegenShowcaseSectionProps) {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-warning/10 text-warning border-warning/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            For experienced DeFi users only
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 font-accent">
            Max Yield
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Rocket fuel for returns. Auto-looped leverage for yield-hungry degens. High risk, high reward.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-6">
            <Card className="border-degen-primary/20">
              <CardContent className="p-6 space-y-4">
                <div className="p-5 bg-degen-primary/10 rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-degen-primary/20 flex items-center justify-center">
                      <span className="text-sm font-bold">A</span>
                    </div>
                    <p className="font-semibold">The Ahmed Story</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ahmed in Lagos wants to multiply his ETH returns. He deposits $1,000 ETH into Max Yield. The strategy auto-loops 3x leverage on Aave, earning 150% APY on his amplified position.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    He donates 10% of his yield to clean water projects. Risk is real—if ETH drops 25%, liquidation triggers. But buffered positions give him breathing room traditional leverage doesn't.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-degen-primary font-semibold">
                    <span>$1,500/year potential</span>
                    <span>•</span>
                    <span>$150 to impact</span>
                    <span>•</span>
                    <span>Risk level 8/10</span>
                  </div>
                </div>

                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-warning mb-1">High Risk Warning</p>
                      <p className="text-xs text-muted-foreground">
                        Can lose everything. Buffered against liquidation but not guaranteed. Only use funds you can afford to lose.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-impact-primary/10 rounded-lg">
                  <Heart className="h-5 w-5 text-impact-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold mb-1">Impact Layer Works Here Too</p>
                    <p className="text-xs text-muted-foreground">
                      Even degens give back. Donate your amplified yields to causes you care about.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DegenStrategyCard
              name="Leveraged ETH/USDC LP"
              apyRange="30-300%+"
              description="Auto-looped leverage on Uniswap v4. Borrows ETH on Aave, multiplies exposure. One-click entry."
              riskLevel={8}
              onExplore={onExploreStrategy}
            />

            <p className="text-xs text-muted-foreground text-center">
              Outperforms Summer.fi manual strategies • Requires DeFi experience • Not for beginners
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-accent">How Leverage Works</h3>
              <p className="text-muted-foreground mb-6">
                Auto-looped leverage combines Uniswap V4 liquidity positions with Aave borrowing. Strategy automatically multiplies your exposure without manual management.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Potential APY</p>
                <p className="text-4xl font-bold tabular-nums text-degen-primary">30-300%+</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6,7,8].map(i => (
                      <div key={i} className="h-2 w-2 rounded-full bg-warning" />
                    ))}
                    {[9,10].map(i => (
                      <div key={i} className="h-2 w-2 rounded-full bg-muted" />
                    ))}
                  </div>
                  <span className="text-xl font-semibold">8/10</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-degen-primary/10 flex items-center justify-center flex-shrink-0">
                  <Rocket className="h-5 w-5 text-degen-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Auto-Looped Amplification</h4>
                  <p className="text-sm text-muted-foreground">
                    Deposits ETH → Borrows USDC on Aave → Swaps for more ETH → Repeats 3-5x. All automatic, one-click entry.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-degen-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-degen-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Buffered Liquidation Protection</h4>
                  <p className="text-sm text-muted-foreground">
                    Smart health factor monitoring. Auto-deleverage before liquidation hits. Not guaranteed but gives breathing room.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Requirements</h4>
                  <p className="text-sm text-muted-foreground">
                    DeFi experience required. Understand impermanent loss, liquidation risk, and smart contract risk. $500 minimum.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold">Risk disclosure:</span> Leveraged strategies can amplify losses. Market volatility may trigger liquidation. Smart contracts carry technical risk. Past performance doesn't guarantee future results. Only invest what you can afford to lose completely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
