import { Card } from "@/components/ui/card";
import { User, Heart } from "lucide-react";

interface YieldBreakdownCardProps {
  earnedYield: number;
  donatedYield: number;
  causeName?: string;
}

export function YieldBreakdownCard({ 
  earnedYield, 
  donatedYield,
  causeName = "Community Causes"
}: YieldBreakdownCardProps) {
  const totalYield = earnedYield + donatedYield;
  const earnedPercent = totalYield > 0 ? (earnedYield / totalYield) * 100 : 50;
  const donatedPercent = totalYield > 0 ? (donatedYield / totalYield) * 100 : 50;

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Yield Breakdown</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm">Your Yield</span>
          </div>
          <span className="font-semibold tabular-nums" data-testid="text-earned-yield">
            ${earnedYield.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-impact-primary" />
            <span className="text-sm">Donated to {causeName}</span>
          </div>
          <span className="font-semibold tabular-nums text-impact-primary" data-testid="text-donated-yield">
            ${donatedYield.toFixed(2)}
          </span>
        </div>

        <div className="h-3 bg-muted rounded-full overflow-hidden flex">
          <div 
            className="bg-primary h-full transition-all"
            style={{ width: `${earnedPercent}%` }}
          />
          <div 
            className="bg-impact-primary h-full transition-all"
            style={{ width: `${donatedPercent}%` }}
          />
        </div>

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Yield</span>
            <span className="font-bold text-lg tabular-nums" data-testid="text-total-yield">
              ${totalYield.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
