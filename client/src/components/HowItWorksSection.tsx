import { Wallet, TrendingUp, Heart } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Wallet,
      title: "1. Deposit Stablecoins",
      description: "Connect your wallet and deposit USDC or other stablecoins to get started.",
    },
    {
      icon: TrendingUp,
      title: "2. Choose Your Strategy",
      description: "Select safe yield vaults for stability or explore high-risk strategies for higher returns.",
    },
    {
      icon: Heart,
      title: "3. Direct Your Impact",
      description: "Choose how much of your yield goes to support community causes you care about.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          How It Works
        </h2>
        <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
          Three simple steps to start earning yield and supporting your community
        </p>

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
      </div>
    </section>
  );
}
