import { VaultBalanceCard } from "../VaultBalanceCard";

export default function VaultBalanceCardExample() {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <VaultBalanceCard
        vaultType="safe"
        balanceUSD={5420.50}
        currency="ARS"
        localCurrencyRate={1050}
        profitLoss={420.50}
        profitLossPercent={8.41}
      />
      
      <VaultBalanceCard
        vaultType="degen"
        balanceUSD={2850.25}
        currency="USD"
        profitLoss={-149.75}
        profitLossPercent={-5.00}
      />
    </div>
  );
}
