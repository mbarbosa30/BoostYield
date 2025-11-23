import { Network, Zap, Coins, Shuffle, MessageSquare } from "lucide-react";
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
      description: "Leading DeFi lending protocol powering real yields of 8-18% APY",
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
    }
  ];

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 font-accent">
            Built on Trusted Infrastructure
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powered by the best protocols in DeFi to ensure security, reliability, and real yields
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => {
            const Icon = integration.icon;
            return (
              <Card key={index} className="border-2 hover-elevate transition-all">
                <CardContent className="pt-6">
                  <div className={`h-12 w-12 mb-4 rounded-xl ${integration.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${integration.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
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
