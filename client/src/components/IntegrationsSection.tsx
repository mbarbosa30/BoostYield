import { Network, Zap, Coins, Shuffle, MessageSquare, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function IntegrationsSection() {
  const integrations = [
    {
      icon: Network,
      name: "Celo Network",
      description: "Mobile-first blockchain with gasless transactions and native stablecoins",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/20"
    },
    {
      icon: Zap,
      name: "Aave V3",
      description: "Leading DeFi lending protocol powering competitive real yields",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      icon: Coins,
      name: "Circle USDC",
      description: "Bridged stablecoin via Wormhole for reliable dollar-pegged value",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      icon: Shuffle,
      name: "Uniswap V4",
      description: "Next-gen DEX for yield conversion swaps and token exchanges",
      color: "text-pink-600",
      bgColor: "bg-pink-50 dark:bg-pink-950/20"
    },
    {
      icon: MessageSquare,
      name: "Farcaster Miniapp",
      description: "Social DeFi integration with viral sharing and in-app transactions",
      color: "text-violet-600",
      bgColor: "bg-violet-50 dark:bg-violet-950/20"
    },
    {
      icon: Heart,
      name: "RelayFunder",
      description: "Key partner for yield donations powering refugee communities worldwide",
      color: "text-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-950/20"
    }
  ];

  return (
    <section className="py-12 sm:py-20 px-3 sm:px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 font-accent">
            Built on Trusted Infrastructure
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Powered by the best protocols in DeFi to ensure security, reliability, and real yields
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <Card key={index} className="border-2 hover-elevate transition-all">
                <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                  <div className={`h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 rounded-xl ${integration.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${integration.color}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    {integration.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {integration.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
