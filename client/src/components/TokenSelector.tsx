import { TOKEN_CONFIGS, type TokenSymbol } from "@/lib/BoostVaultABI";
import { useToken } from "@/contexts/TokenContext";
import { Button } from "@/components/ui/button";

export function TokenSelector() {
  const { selectedToken, setSelectedToken } = useToken();
  const tokens: TokenSymbol[] = ['cUSD', 'USDC', 'USDT', 'CELO'];

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Token:</span>
      <div className="flex rounded-lg border p-0.5 sm:p-1 gap-0.5 sm:gap-1">
        {tokens.map((token) => {
          const config = TOKEN_CONFIGS[token];
          const isSelected = selectedToken === token;
          const isAvailable = config.vaultAddress !== undefined;

          return (
            <Button
              key={token}
              size="sm"
              variant={isSelected ? "default" : "ghost"}
              onClick={() => isAvailable && setSelectedToken(token)}
              disabled={!isAvailable}
              className="toggle-elevate text-xs sm:text-sm px-2 sm:px-3 min-h-[44px] sm:min-h-8"
              data-testid={`button-token-${token.toLowerCase()}`}
              title={config.name}
            >
              {token}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
