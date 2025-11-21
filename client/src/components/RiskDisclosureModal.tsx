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
      "This is not a bank. Funds are not FDIC insured.",
      "Smart contract risks exist despite security audits.",
      "APY is variable and not guaranteed.",
      "Protocol failures could result in loss of funds.",
      "Only deposit what you can afford to lose.",
    ],
  },
  degen: {
    title: "⚠️ High-Risk Strategy Warning",
    risks: [
      "You can lose your entire deposit.",
      "Liquidation risk from leveraged positions.",
      "Extreme market volatility can wipe out gains instantly.",
      "Impermanent loss in liquidity pools.",
      "Smart contract and protocol risks are significantly elevated.",
      "This is experimental and not suitable for savings.",
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
