import { ArrowRight, Shield, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackgroundImage from "@assets/generated_images/safe_mode_hero_background.png";

interface HeroSectionProps {
  onSafeClick?: () => void;
  onDegenClick?: () => void;
}

export function HeroSection({ onSafeClick, onDegenClick }: HeroSectionProps) {
  return (
    <div className="relative min-h-[60vh] sm:min-h-[70vh] py-12 sm:py-20 px-3 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroBackgroundImage} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
        <div className="space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-accent leading-tight">
            Beat Inflation.<br />
            <span className="text-primary">Earn Real Yields.</span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-2">
            Earn real yields on stablecoins (cUSD, USDC, USDT) or CELO.<br className="hidden sm:inline" />
            <span className="hidden sm:inline"> </span>
            Powered by Aave V3 on Celo.
          </p>
          
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center text-xs sm:text-sm px-4">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary font-medium">
              🌍 Emerging Markets
            </span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary font-medium">
              📱 Mobile-First
            </span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 text-primary font-medium">
              💚 Social Impact
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto pt-2 sm:pt-4">
          <Button 
            size="lg"
            onClick={onSafeClick}
            className="w-full sm:w-auto gap-2 min-h-[44px] sm:h-auto"
            data-testid="button-hero-simple"
          >
            <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            Simple & Clear
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button 
            size="lg"
            variant="outline"
            onClick={onDegenClick}
            className="w-full sm:w-auto gap-2 min-h-[44px] sm:h-auto"
            data-testid="button-hero-advanced"
          >
            <Flame className="h-4 w-4 sm:h-5 sm:w-5" />
            Advanced View
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
