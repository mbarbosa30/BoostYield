import { ArrowRight, Shield, Zap, Lock, TrendingUp, AlertTriangle, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import safeHeroImage from "@assets/generated_images/safe_mode_hero_background.png";
import degenHeroImage from "@assets/generated_images/degen_mode_hero_background.png";

interface HeroSectionProps {
  onSafeClick?: () => void;
  onDegenClick?: () => void;
}

export function HeroSection({ onSafeClick, onDegenClick }: HeroSectionProps) {
  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
        <div 
          className="relative overflow-hidden group transition-all hover:scale-[1.02]"
          data-testid="hero-safe-section"
        >
          <img 
            src={safeHeroImage} 
            alt="Safe yield vaults" 
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-safe-primary/95 via-safe-primary/85 to-safe-primary/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          <div className="relative h-full flex flex-col justify-end p-8 md:p-12 lg:p-16 text-white">
            <Badge className="w-fit mb-4 bg-white/20 backdrop-blur-sm border-white/30 text-white">
              <Lock className="h-3 w-3 mr-1" />
              Low Risk
            </Badge>
            
            <div className="mb-6">
              <Shield className="h-16 w-16 mb-4 opacity-90" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-accent">
                Protect My Savings
              </h2>
              <p className="text-lg md:text-xl opacity-95 max-w-md mb-6">
                Conservative 4-6% APY using proven lending protocols. Your shield against inflation.
              </p>
            </div>

            <div className="space-y-2 mb-8 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Stable yield on USDC & stablecoins</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>Aave lending + stable LP positions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                <span>No leverage, minimal volatility</span>
              </div>
            </div>

            <Button 
              size="lg"
              onClick={onSafeClick}
              className="w-full md:w-auto bg-white text-safe-primary hover:bg-white/90 border-0"
              data-testid="button-hero-safe"
            >
              Start Saving <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div 
          className="relative overflow-hidden group transition-all hover:scale-[1.02]"
          data-testid="hero-degen-section"
        >
          <img 
            src={degenHeroImage} 
            alt="High-risk strategies" 
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-degen-primary/95 via-degen-primary/85 to-degen-secondary/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          <div className="relative h-full flex flex-col justify-end p-8 md:p-12 lg:p-16 text-white">
            <Badge className="w-fit mb-4 bg-warning/30 backdrop-blur-sm border-warning/50 text-white">
              <AlertTriangle className="h-3 w-3 mr-1" />
              High Risk
            </Badge>
            
            <div className="mb-6">
              <Zap className="h-16 w-16 mb-4 opacity-90" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 font-accent">
                Explore High-Risk
              </h2>
              <p className="text-lg md:text-xl opacity-95 max-w-md mb-6">
                Advanced 20-50%+ APY with leveraged positions. For experienced DeFi users only.
              </p>
            </div>

            <div className="space-y-2 mb-8 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-warning" />
                <span>Leveraged LP on Uniswap v4</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-warning" />
                <span>Borrow on Aave, multiply exposure</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-warning" />
                <span>Risk Level 7-10, can lose everything</span>
              </div>
            </div>

            <Button 
              size="lg"
              variant="outline"
              onClick={onDegenClick}
              className="w-full md:w-auto backdrop-blur-md bg-white/15 border-white/40 text-white hover:bg-white/25"
              data-testid="button-hero-degen"
            >
              Explore Strategies <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 md:top-1/2 md:-translate-y-1/2 z-10 flex items-center justify-center pointer-events-none px-6">
        <div className="bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl text-center pointer-events-auto border">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-safe-primary via-primary to-degen-primary bg-clip-text text-transparent">
            Save in dollars. Choose safety or risk.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            Let your yield fund your community.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Transparent yield. Impactful donations. Your choice.</span>
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent hidden md:block pointer-events-none" />
    </div>
  );
}
