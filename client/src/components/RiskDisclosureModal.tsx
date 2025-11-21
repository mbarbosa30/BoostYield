import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

interface RiskDisclosureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "safe" | "degen";
  onAccept?: () => void;
}

const riskContent = {
  safe: {
    title: "Safe Vault Risk Disclosure",
    risks: [
      "This is not a bank. Funds are not FDIC insured or government protected.",
      "Smart contract risks exist despite audits. Code vulnerabilities could lead to loss.",
      "Yields are variable and not guaranteed. Past performance doesn't predict future returns.",
      "Protocol failures, exploits, or oracle issues could result in partial or total loss of funds.",
      "DeFi carries inherent risks. Only deposit what you can afford to lose.",
      "Regulatory changes could impact protocol operations or fund access.",
    ],
  },
  degen: {
    title: "⚠️ High-Risk Strategy Warning",
    risks: [
      "You can lose your entire deposit. Leverage amplifies losses as well as gains.",
      "Liquidation risk is significant. Market drops of 20-30% could trigger total loss.",
      "Extreme volatility can wipe out positions in minutes, even with monitoring.",
      "Impermanent loss in liquidity pools can be severe during volatile markets.",
      "Smart contract risks are elevated. Composing multiple protocols multiplies attack surface.",
      "This is experimental technology, not suitable for savings or funds you need.",
      "No guarantees on liquidation protection—automated systems can fail.",
    ],
  },
};

export function RiskDisclosureModal({ 
  open, 
  onOpenChange, 
  type,
  onAccept 
}: RiskDisclosureModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const content = riskContent[type];

  const handleAccept = () => {
    if (acknowledged) {
      onAccept?.();
      onOpenChange(false);
      setAcknowledged(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${type === 'degen' ? 'bg-warning/20' : 'bg-safe-primary/20'}`}>
              <AlertTriangle className={`h-6 w-6 ${type === 'degen' ? 'text-warning' : 'text-safe-primary'}`} />
            </div>
          </div>
          <DialogTitle className="text-xl">{content.title}</DialogTitle>
          <DialogDescription>
            Please read and acknowledge the following risks:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {content.risks.map((risk, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-warning mt-2 flex-shrink-0" />
              <p className="text-sm text-foreground">{risk}</p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Checkbox 
            id="acknowledge"
            checked={acknowledged}
            onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
            data-testid="checkbox-acknowledge"
          />
          <label 
            htmlFor="acknowledge" 
            className="text-sm font-medium leading-none cursor-pointer"
          >
            I understand these risks and agree to proceed
          </label>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={!acknowledged}
            data-testid="button-accept-risk"
          >
            I Understand, Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
