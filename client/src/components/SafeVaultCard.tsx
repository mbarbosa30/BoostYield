import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp } from "lucide-react";

interface SafeVaultCardProps {
  name: string;
  apyRange: string;
  description: string;
  onOpenVault?: () => void;
}

export function SafeVaultCard({ name, apyRange, description, onOpenVault }: SafeVaultCardProps) {
  return (
    <Card className="p-6 hover-elevate active-elevate-2 transition-all rounded-2xl">
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 rounded-lg bg-safe-primary/10 flex items-center justify-center">
          <Shield className="h-6 w-6 text-safe-primary" />
        </div>
        <Badge variant="secondary" className="bg-safe-secondary/30 text-safe-primary">
          Low Risk
        </Badge>
      </div>

      <h3 className="text-xl font-accent font-semibold mb-2" data-testid="text-vault-name">
        {name}
      </h3>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold tabular-nums text-safe-primary" data-testid="text-apy">
          {apyRange}
        </span>
        <span className="text-sm text-muted-foreground">Est. APY</span>
      </div>

      <p className="text-sm text-muted-foreground mb-6" data-testid="text-description">
        {description}
      </p>

      <Button 
        className="w-full" 
        onClick={onOpenVault}
        data-testid="button-open-vault"
      >
        <TrendingUp className="mr-2 h-4 w-4" />
        Open Vault
      </Button>
    </Card>
  );
}
