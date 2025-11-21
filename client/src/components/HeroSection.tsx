import { ArrowRight, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import safeHeroImage from "@assets/generated_images/safe_mode_hero_background.png";
import degenHeroImage from "@assets/generated_images/degen_mode_hero_background.png";

interface HeroSectionProps {
  onSafeClick?: () => void;
  onDegenClick?: () => void;
}

export function HeroSection({ onSafeClick, onDegenClick }: HeroSectionProps) {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
        <div 
          className="relative overflow-hidden group cursor-pointer"
          onClick={onSafeClick}
          data-testid="hero-safe-section"
        >
          <img 
            src={safeHeroImage} 
            alt="Safe yield vaults" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-safe-primary/80 to-safe-primary/40" />
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
            <Shield className="h-20 w-20 mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Protect My Savings
            </h2>
            <p className="text-lg md:text-xl mb-8 text-center max-w-md opacity-95">
              Conservative yield on stablecoins. Low risk, not zero.
            </p>
            <Button 
              size="lg"
              variant="outline"
              className="backdrop-blur-md bg-white/20 border-white/40 text-white hover:bg-white/30"
              data-testid="button-hero-safe"
            >
              Start Saving <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div 
          className="relative overflow-hidden group cursor-pointer"
          onClick={onDegenClick}
          data-testid="hero-degen-section"
        >
          <img 
            src={degenHeroImage} 
            alt="High-risk strategies" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-bl from-degen-primary/80 via-degen-primary/60 to-degen-secondary/70" />
          <div className="relative h-full flex flex-col items-center justify-center p-12 text-white">
            <Zap className="h-20 w-20 mb-6 opacity-90" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
              Explore High-Risk
            </h2>
            <p className="text-lg md:text-xl mb-8 text-center max-w-md opacity-95">
              Leveraged strategies for experienced users. High rewards, high stakes.
            </p>
            <Button 
              size="lg"
              variant="outline"
              className="backdrop-blur-md bg-white/20 border-white/40 text-white hover:bg-white/30"
              data-testid="button-hero-degen"
            >
              Explore Strategies <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Save in dollars. Choose safety or risk.
        </h1>
        <p className="text-xl md:text-2xl text-white/95 drop-shadow-lg">
          Let your yield fund your community.
        </p>
      </div>
    </div>
  );
}
