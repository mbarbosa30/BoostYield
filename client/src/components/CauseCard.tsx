import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp } from "lucide-react";

interface CauseCardProps {
  name: string;
  category: string;
  description: string;
  totalYieldReceived: string;
  imageUrl: string;
  onSupport?: () => void;
}

export function CauseCard({ 
  name, 
  category, 
  description, 
  totalYieldReceived,
  imageUrl,
  onSupport 
}: CauseCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="text-xs" data-testid="badge-category">
            {category}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold mb-2" data-testid="text-cause-name">
          {name}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2" data-testid="text-description">
          {description}
        </p>

        <div className="flex items-center gap-2 mb-4 p-3 bg-impact-primary/10 rounded-lg">
          <TrendingUp className="h-4 w-4 text-impact-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Total Yield Received</div>
            <div className="font-semibold text-impact-primary tabular-nums" data-testid="text-total-yield">
              {totalYieldReceived}
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full border-impact-primary/40 hover:bg-impact-primary/10"
          onClick={onSupport}
          data-testid="button-support-cause"
        >
          <Heart className="mr-2 h-4 w-4" />
          Support This Cause
        </Button>
      </div>
    </Card>
  );
}
