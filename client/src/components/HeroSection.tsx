import { ArrowRight, Shield, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackgroundImage from "@assets/generated_images/safe_mode_hero_background.png";

interface HeroSectionProps {
  onSafeClick?: () => void;
  onDegenClick?: () => void;
}

export function HeroSection({ onSafeClick, onDegenClick }: HeroSectionProps) {
  return (
    <div className="relative min-h-[70vh] py-20 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroBackgroundImage} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-accent leading-tight">
            The People's<br />
            <span className="text-primary">Yield Revolution</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Your money doesn't just sit idle—it can grow and give back.<br />
            Choose your path: designed for resilience or maximum potential.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto pt-4">
          <div className="w-full sm:w-auto">
            <Button 
              size="lg"
              onClick={onSafeClick}
              className="w-full gap-2 min-w-[240px]"
              data-testid="button-hero-safe"
            >
              <Shield className="h-5 w-5" />
              Protect My Savings
              <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Historically 8-18% APY • Risk 3/10 • Recommended</p>
          </div>

          <div className="w-full sm:w-auto">
            <Button 
              size="lg"
              variant="outline"
              onClick={onDegenClick}
              className="w-full gap-2 min-w-[240px]"
              data-testid="button-hero-degen"
            >
              <Flame className="h-5 w-5" />
              Maximize Returns
              <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-xs text-warning mt-2">Historically 30-300%+ APY • Risk 8/10 • High Risk</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground pt-4">
          Built on Celo • Powered by Uniswap V4 + Aave • Optimized for emerging markets
        </p>
      </div>
    </div>
  );
}
