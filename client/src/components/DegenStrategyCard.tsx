import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, AlertTriangle } from "lucide-react";

interface DegenStrategyCardProps {
  name: string;
  apyRange: string;
  description: string;
  riskLevel: number;
  onExplore?: () => void;
}

export function DegenStrategyCard({ 
  name, 
  apyRange, 
  description, 
  riskLevel,
  onExplore 
}: DegenStrategyCardProps) {
  return (
    <Card className="p-6 hover-elevate active-elevate-2 transition-all rounded-lg border-warning/20">
      <div className="flex items-start justify-between mb-4">
        <div className="h-12 w-12 rounded-lg bg-degen-primary/10 flex items-center justify-center">
          <Zap className="h-6 w-6 text-degen-primary" />
        </div>
        <Badge variant="destructive" className="bg-warning/20 text-warning border-warning/40">
          <AlertTriangle className="h-3 w-3 mr-1" />
          High Risk
        </Badge>
      </div>

      <h3 className="text-xl font-accent font-semibold mb-2" data-testid="text-strategy-name">
        {name}
      </h3>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold tabular-nums text-degen-primary" data-testid="text-apy">
          {apyRange}
        </span>
        <span className="text-sm text-muted-foreground">Variable APY</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">Risk Level</span>
          <span className="font-semibold text-warning" data-testid="text-risk-level">
            {riskLevel}/10
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-warning to-destructive rounded-full transition-all"
            style={{ width: `${riskLevel * 10}%` }}
          />
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6" data-testid="text-description">
        {description}
      </p>

      <Button 
        variant="outline"
        className="w-full border-degen-primary/40 hover:bg-degen-primary/10" 
        onClick={onExplore}
        data-testid="button-explore-strategy"
      >
        <Zap className="mr-2 h-4 w-4" />
        Explore Strategy
      </Button>
    </Card>
  );
}
