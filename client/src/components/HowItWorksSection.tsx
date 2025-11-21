import { Wallet, Shield, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Wallet,
      title: "1. Connect & Deposit",
      description: "One wallet connect. Gasless entry via Celo. Even $50 deposits work with sub-cent fees.",
    },
    {
      icon: Shield,
      title: "2. Choose Your Path",
      description: "Inflation Shield (historically 8-18% APY, lower risk) or Max Yield (historically 30-300%+ APY, high risk). Switch anytime, no lockups.",
    },
    {
      icon: Heart,
      title: "3. Earn & Give Back",
      description: "Auto-optimized yield generation. Donate 0-100% to vetted causes. Track impact with global leaderboard.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4">Radical Simplicity</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-accent">
            As Easy as Venmo, As Powerful as Wall Street
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            3 screens max. Zero jargon. Mobile-first design that feels like a banking app, not a crypto maze.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="h-20 w-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-accent font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Built on Celo • Powered by Uniswap V4 + Aave • Optimized for emerging markets
          </p>
        </div>
      </div>
    </section>
  );
}
