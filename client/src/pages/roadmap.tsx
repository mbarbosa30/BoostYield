import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Roadmap</h1>
            <p className="text-lg text-muted-foreground">
              The future of democratized DeFi yield
            </p>
          </div>

          <div className="space-y-6">
            {/* Phase 1 - Current */}
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Phase 1: Safe Vaults
                  </CardTitle>
                  <Badge variant="default">Live</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Battle-tested yield generation through Aave V3 lending pools.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>ERC4626 vaults for cUSD, USDC, USDT, and CELO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>8-18% historical APY on stablecoins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Optional donation feature for community impact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Farcaster miniapp for social DeFi</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Phase 2 - Risk Customization */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Circle className="w-5 h-5 text-muted-foreground" />
                    Phase 2: Risk Appetite
                  </CardTitle>
                  <Badge variant="outline">Upcoming</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Customizable risk levels to match your goals and risk tolerance.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span><strong>Conservative:</strong> Pure lending (current strategy)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span><strong>Moderate:</strong> 2-3x leverage on stable assets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span><strong>Aggressive:</strong> Rehypothecation strategies (borrow against deposits for leveraged yield)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>Target: 30-300%+ APY for advanced strategies</span>
                  </li>
                </ul>
                <div className="bg-muted/50 p-3 rounded-lg text-xs">
                  <strong>Note:</strong> Higher yields come with liquidation risks. Advanced strategies include automated risk management and health monitoring.
                </div>
              </CardContent>
            </Card>

            {/* Phase 3 - Uniswap V4 */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Circle className="w-5 h-5 text-muted-foreground" />
                    Phase 3: Uniswap V4 Integration
                  </CardTitle>
                  <Badge variant="outline">Planned</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Advanced yield conversion and compounding through Uniswap V4 hooks.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>Automated yield token swaps (e.g., convert earnings to CELO)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>Auto-compounding strategies with minimal gas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>Custom yield routing based on market conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Circle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>Support for community-suggested token pairs</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Phase 4 - Governance Token */}
            <Card className="border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Phase 4: $BOOST Governance Token
                  </CardTitle>
                  <Badge variant="outline" className="border-primary text-primary">Future</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground">
                  Community-driven governance and incentive alignment through native token.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Governance:</strong> Vote on vault strategies, supported tokens, and protocol parameters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Staking Rewards:</strong> Earn $BOOST by providing liquidity and using vaults</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Fee Sharing:</strong> Token holders receive portion of protocol revenue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span><strong>Community Grants:</strong> Fund vetted donation recipients through DAO treasury</span>
                  </li>
                </ul>
                <div className="bg-primary/10 p-3 rounded-lg text-xs">
                  <strong>Vision:</strong> Fully decentralized yield platform governed by users who believe in democratizing financial access for emerging markets.
                </div>
              </CardContent>
            </Card>

            <div className="text-center pt-8">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-back-home">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
