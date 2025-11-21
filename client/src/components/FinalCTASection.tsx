import { Button } from "@/components/ui/button";
import { Shield, Zap, ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Start Saving Today
        </h2>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join thousands protecting their wealth and supporting their communities through transparent, impactful yield.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="gap-2"
            data-testid="button-cta-safe"
          >
            <Shield className="h-5 w-5" />
            Protect My Savings
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2"
            data-testid="button-cta-degen"
          >
            <Zap className="h-5 w-5" />
            Explore Strategies
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Not a bank. Funds can be lost. Use only what you can afford to lose.
        </p>
      </div>
    </section>
  );
}
