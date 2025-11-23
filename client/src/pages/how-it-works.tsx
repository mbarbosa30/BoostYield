import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Lock, TrendingUp, Users, Coins } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">How It Works</h1>
            <p className="text-lg text-muted-foreground">
              Understanding the mechanics behind Relay Boost's yield generation
            </p>
          </div>

          <div className="space-y-8">
            {/* Vault Mechanics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Smart Vault System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Relay Boost uses ERC4626 standard vaults - battle-tested smart contracts that automatically deposit your funds into Aave V3, one of the largest and most secure DeFi lending protocols.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Your deposit flow:</p>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>You deposit stablecoins (cUSD, USDC, USDT) or CELO</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Vault deposits to Aave V3 lending pool on Celo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Borrowers pay interest on loans</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Interest accumulates in your vault share</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Withdraw anytime with earned yield</span>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Supported Tokens */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="w-5 h-5" />
                  Supported Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-1">cUSD</h3>
                    <p className="text-sm text-muted-foreground">Celo Dollar - Native stablecoin</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-1">USDC</h3>
                    <p className="text-sm text-muted-foreground">Bridged Circle stablecoin</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-1">USDT</h3>
                    <p className="text-sm text-muted-foreground">Tether stablecoin</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-1">CELO</h3>
                    <p className="text-sm text-muted-foreground">Native Celo asset</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  All tokens earn yield through Aave V3 lending. Each token has its own vault for security and transparency.
                </p>
              </CardContent>
            </Card>

            {/* Yield Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Yield Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Your deposits earn interest from Aave V3's lending pools. Rates fluctuate based on supply and demand for borrowing each asset.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Historical APY ranges:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Stablecoin vaults (cUSD, USDC, USDT):</span>
                      <span className="font-semibold">8-18% APY</span>
                    </li>
                    <li className="flex justify-between">
                      <span>CELO vault:</span>
                      <span className="font-semibold">Variable based on demand</span>
                    </li>
                  </ul>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Past performance does not guarantee future results. Rates update in real-time.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Impact Feature */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Share Your Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Optional donation feature lets you automatically share a percentage of your earnings with vetted community causes.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">
                    You choose the percentage (0-50%). Donations are deducted from your yield, not principal. Turn it on or off anytime.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Note */}
            <div className="border-l-4 border-primary pl-4 py-2">
              <p className="text-sm">
                <strong>Security:</strong> Your funds are deposited into Aave V3, a protocol with billions in TVL and extensive security audits. Smart contracts are on Celo mainnet and publicly verifiable.
              </p>
            </div>

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
