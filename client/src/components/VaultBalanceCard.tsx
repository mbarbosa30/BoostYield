import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { Currency } from "./CurrencyToggle";

interface VaultBalanceCardProps {
  vaultType: "safe" | "degen";
  balanceUSD: number;
  currency: Currency;
  localCurrencyRate?: number;
  profitLoss: number;
  profitLossPercent: number;
}

//todo: remove mock functionality
const currencySymbols: Record<Currency, string> = {
  USD: "$",
  ARS: "$",
  NGN: "₦",
  BRL: "R$",
};

export function VaultBalanceCard({ 
  vaultType,
  balanceUSD, 
  currency,
  localCurrencyRate = 1,
  profitLoss,
  profitLossPercent
}: VaultBalanceCardProps) {
  const isProfit = profitLoss >= 0;
  const localBalance = balanceUSD * localCurrencyRate;
  const gradient = vaultType === "safe" 
    ? "from-safe-primary/20 to-safe-primary/5"
    : "from-degen-primary/20 to-degen-primary/5";

  return (
    <Card className={`p-8 bg-gradient-to-br ${gradient}`}>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Total Balance</p>
          <div className="flex items-baseline gap-3">
            <h2 className="text-5xl font-bold tabular-nums" data-testid="text-balance-usd">
              ${balanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <span className="text-xl text-muted-foreground">USD</span>
          </div>
        </div>

        {currency !== "USD" && (
          <div className="text-xl text-muted-foreground tabular-nums" data-testid="text-balance-local">
            ≈ {currencySymbols[currency]}{localBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
          </div>
        )}

        <div className="flex items-center gap-2 pt-4 border-t">
          {isProfit ? (
            <TrendingUp className="h-5 w-5 text-success" />
          ) : (
            <TrendingDown className="h-5 w-5 text-destructive" />
          )}
          <span className={`text-lg font-semibold tabular-nums ${isProfit ? 'text-success' : 'text-destructive'}`} data-testid="text-pnl">
            {isProfit ? '+' : ''}{profitLoss >= 0 ? '$' : '-$'}{Math.abs(profitLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`text-sm ${isProfit ? 'text-success' : 'text-destructive'}`}>
            ({isProfit ? '+' : ''}{profitLossPercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    </Card>
  );
}
