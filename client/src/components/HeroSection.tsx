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
            Save Money.<br />
            <span className="text-primary">Earn While Giving Back.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Earn up to 11% yearly on your savings while helping others.<br />
            Choose the experience that fits you best.
          </p>
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
