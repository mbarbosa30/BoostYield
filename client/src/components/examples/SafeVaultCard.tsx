import { SafeVaultCard } from "../SafeVaultCard";

export default function SafeVaultCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <SafeVaultCard
        name="Inflation Shield Vault"
        apyRange="4-6%"
        description="Conservative yield using lending + trading fees on stablecoins."
        onOpenVault={() => console.log("Open vault clicked")}
      />
    </div>
  );
}
