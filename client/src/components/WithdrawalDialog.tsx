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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  depositedAmount: number;
  currentValue: number;
  donatedToDate: number;
  causeName?: string;
  onConfirm?: (amount: number) => void;
}

export function WithdrawalDialog({ 
  open, 
  onOpenChange,
  depositedAmount,
  currentValue,
  donatedToDate,
  causeName = "Community Cause",
  onConfirm
}: WithdrawalDialogProps) {
  const [amount, setAmount] = useState("");
  const profitLoss = currentValue - depositedAmount;
  const isProfit = profitLoss >= 0;

  const handleConfirm = () => {
    const withdrawAmount = parseFloat(amount);
    if (!isNaN(withdrawAmount) && withdrawAmount > 0) {
      onConfirm?.(withdrawAmount);
      onOpenChange(false);
      setAmount("");
    }
  };

  const setMax = () => {
    setAmount(currentValue.toFixed(2));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw from Vault</DialogTitle>
          <DialogDescription>
            Review your position and withdraw funds
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Deposited</p>
              <p className="font-semibold tabular-nums" data-testid="text-deposited">
                ${depositedAmount.toFixed(2)}
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Current Value</p>
              <p className="font-semibold tabular-nums" data-testid="text-current-value">
                ${currentValue.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <span className="text-sm">Profit/Loss</span>
            <Badge 
              variant={isProfit ? "default" : "destructive"}
              className="tabular-nums"
              data-testid="badge-pnl"
            >
              {isProfit ? '+' : ''}{profitLoss >= 0 ? '$' : '-$'}{Math.abs(profitLoss).toFixed(2)}
            </Badge>
          </div>

          <div className="p-4 bg-impact-primary/10 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm">Donated to {causeName}</span>
              <span className="font-semibold text-impact-primary tabular-nums" data-testid="text-donated">
                ${donatedToDate.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
                max={currentValue}
                data-testid="input-amount"
              />
              <Button 
                variant="outline" 
                onClick={setMax}
                data-testid="button-max"
              >
                Max
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Available: ${currentValue.toFixed(2)}
            </p>
          </div>
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
            onClick={handleConfirm}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentValue}
            data-testid="button-confirm-withdrawal"
          >
            Confirm Withdrawal <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
