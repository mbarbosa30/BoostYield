import { ArrowRight, Shield, Zap, Lock, Heart, AlertTriangle, TrendingUp, ChevronDown, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import safeHeroImage from "@assets/generated_images/safe_mode_hero_background.png";
import degenHeroImage from "@assets/generated_images/degen_mode_hero_background.png";

interface HeroSectionProps {
  onSafeClick?: () => void;
  onDegenClick?: () => void;
}

export function HeroSection({ onSafeClick, onDegenClick }: HeroSectionProps) {
  const [showMaxYield, setShowMaxYield] = useState(true);

  return (
    <div className="relative min-h-[85vh] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-8" data-testid="hero-safe-section">
            <div className="space-y-4">
              <Badge className="w-fit bg-safe-primary/10 text-safe-primary border-safe-primary/20">
                <Shield className="h-3 w-3 mr-1" />
                Recommended for most users
              </Badge>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-accent leading-tight">
                Your money fights back.<br />
                <span className="text-safe-primary">Beat</span> inflation.
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                Join the revolution. Earn 8-18% APY on stablecoins while your yield builds communities.
              </p>
            </div>

            <Card className="relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <img 
                  src={safeHeroImage} 
                  alt="" 
                  className="w-full h-full object-cover blur-md"
                />
              </div>
              
              <CardContent className="relative p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-safe-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-safe-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 font-accent">Inflation Shield</h3>
                    <p className="text-muted-foreground">Beat inflation by 10x what banks offer. Auto-optimized Uniswap V4 + Aave lending.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Expected APY</p>
                    <p className="text-3xl font-bold tabular-nums">8-18%</p>
                  </div>
                  <div className="space-y-1">
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
                      <span className="text-sm font-semibold">3/10</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <p className="text-sm font-semibold">The Maria Story</p>
                  <p className="text-xs text-muted-foreground">
                    $500 USDC in Buenos Aires → 12% APY beats 100% inflation → 25% of yield to local school fund. One tap.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-4 bg-impact-primary/10 rounded-lg">
                  <Heart className="h-5 w-5 text-impact-primary flex-shrink-0" />
                  <p className="text-sm">
                    <span className="font-semibold">Optional:</span> Donate 0-100% of yield to vetted causes with global leaderboard
                  </p>
                </div>

                <Button 
                  size="lg"
                  onClick={onSafeClick}
                  className="w-full gap-2"
                  data-testid="button-hero-safe"
                >
                  <Shield className="h-5 w-5" />
                  Start Saving Safely
                  <ArrowRight className="h-5 w-5" />
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Celo-optimized • Gasless entry • Sub-cent fees • Not a bank
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6" data-testid="hero-degen-section">
            <button
              onClick={() => setShowMaxYield(!showMaxYield)}
              className="lg:hidden w-full flex items-center justify-between p-4 bg-muted/50 rounded-lg hover-elevate"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-degen-primary" />
                <span className="font-semibold">Max Yield: Advanced Users</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform ${showMaxYield ? 'rotate-180' : ''}`} />
            </button>

            <div className={`space-y-4 ${!showMaxYield ? 'hidden lg:block' : ''}`}>
              <Badge className="w-fit bg-warning/10 text-warning border-warning/20">
                <AlertTriangle className="h-3 w-3 mr-1" />
                For experienced DeFi users only
              </Badge>

              <Card className="relative overflow-hidden border-degen-primary/20">
                <div className="absolute inset-0 opacity-30">
                  <img 
                    src={degenHeroImage} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-degen-primary/80 to-degen-secondary/60" />
                </div>

                <CardContent className="relative p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-degen-primary/20 flex items-center justify-center flex-shrink-0">
                      <Flame className="h-5 w-5 text-degen-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1 font-accent">Max Yield</h3>
                      <p className="text-sm text-muted-foreground">Auto-looped leverage, one-click entry</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Potential APY</span>
                      <span className="text-2xl font-bold tabular-nums">30-300%+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk Level</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="h-2 w-2 rounded-full bg-warning" />
                          ))}
                          {[9,10].map(i => (
                            <div key={i} className="h-2 w-2 rounded-full bg-muted" />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">8/10</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs font-semibold mb-1">The Ahmed Story</p>
                    <p className="text-xs text-muted-foreground">
                      ETH leverage in Lagos → 150% APY while funding clean water. Rocket fuel for returns.
                    </p>
                  </div>

                  <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                    <p className="text-xs text-warning font-semibold mb-1">⚠️ High Risk Warning</p>
                    <p className="text-xs text-muted-foreground">
                      Can lose everything. Buffered against liquidation but not guaranteed.
                    </p>
                  </div>

                  <Button 
                    size="default"
                    variant="outline"
                    onClick={onDegenClick}
                    className="w-full gap-2"
                    data-testid="button-hero-degen"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Explore Max Yield
                  </Button>
                </CardContent>
              </Card>

              <p className="text-xs text-muted-foreground text-center">
                Outperforms Summer.fi manual strategies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
