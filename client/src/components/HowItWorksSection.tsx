import { Wallet, Shield, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Wallet,
      title: "Connect & Choose Token",
      description: "Connect your wallet and choose cUSD, USDC, USDT, or CELO. Available on web or Farcaster miniapp.",
    },
    {
      icon: Shield,
      title: "Earn Real Yields",
      description: "Your deposits earn competitive yields from Aave V3. Withdraw anytime, no lockups or hidden fees.",
    },
    {
      icon: Heart,
      title: "Share Your Growth",
      description: "Donate a portion of your earnings to vetted causes. Create social impact while building wealth.",
    },
  ];

  return (
    <section className="py-12 sm:py-20 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 font-accent">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground px-2">
            Three simple steps to start growing your savings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm px-2">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
