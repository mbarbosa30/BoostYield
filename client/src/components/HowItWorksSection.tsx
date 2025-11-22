import { Wallet, Shield, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function HowItWorksSection() {
  const steps = [
    {
      icon: Wallet,
      title: "Connect Your Wallet",
      description: "Simple one-click connection. Low fees so you can start with any amount.",
    },
    {
      icon: Shield,
      title: "Start Earning",
      description: "Your money grows automatically. Withdraw anytime, no lockups.",
    },
    {
      icon: Heart,
      title: "Share Your Growth",
      description: "Optionally donate part of your earnings to causes you care about.",
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-accent">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to start growing your savings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
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
