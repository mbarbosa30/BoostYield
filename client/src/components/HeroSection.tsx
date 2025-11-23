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
            Beat Inflation.<br />
            <span className="text-primary">Earn Real Yields.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Earn real yields on stablecoins (cUSD, USDC, USDT) or CELO.<br />
            Powered by Aave V3 on Celo. Donate part of your earnings to causes you care about.
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center items-center text-sm">
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
              🌍 Emerging Markets Focus
            </span>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
              📱 Mobile-First on Celo
            </span>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
              💚 Social Impact Built-In
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto pt-4">
          <Button 
            size="lg"
            onClick={onSafeClick}
            className="w-full sm:w-auto gap-2"
            data-testid="button-hero-simple"
          >
            <Shield className="h-5 w-5" />
            Simple & Clear
            <ArrowRight className="h-5 w-5" />
          </Button>

          <Button 
            size="lg"
            variant="outline"
            onClick={onDegenClick}
            className="w-full sm:w-auto gap-2"
            data-testid="button-hero-advanced"
          >
            <Flame className="h-5 w-5" />
            Advanced View
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
