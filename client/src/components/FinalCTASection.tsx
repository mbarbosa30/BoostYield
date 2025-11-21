import { Button } from "@/components/ui/button";
import { Shield, Flame, ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 font-accent">
          Join the Revolution
        </h2>
        
        <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto">
          Your money doesn't just sit idle—it can grow and give back. Choose your path.
        </p>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          <span className="font-semibold">Protect.</span> Aim to outpace inflation with stable yields.{" "}
          <span className="font-semibold">Optimize.</span> Amplify potential returns with leverage.{" "}
          <span className="font-semibold">Give.</span> Build communities with your yield.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="gap-2"
            data-testid="button-cta-safe"
          >
            <Shield className="h-5 w-5" />
            Start Saving Safely
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2"
            data-testid="button-cta-degen"
          >
            <Flame className="h-5 w-5" />
            Explore Max Yield
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          Not a bank. DeFi carries risks. Built on Celo with Uniswap V4 + Aave.
        </p>
      </div>
    </section>
  );
}
