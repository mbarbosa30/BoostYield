import { TOKEN_CONFIGS, type TokenSymbol } from "@/lib/BoostVaultABI";
import { Button } from "@/components/ui/button";

interface TokenSelectorProps {
  selectedToken: TokenSymbol;
  onTokenChange: (token: TokenSymbol) => void;
}

export function TokenSelector({ selectedToken, onTokenChange }: TokenSelectorProps) {
  const tokens: TokenSymbol[] = ['cUSD', 'USDC'];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Token:</span>
      <div className="flex rounded-lg border p-1 gap-1">
        {tokens.map((token) => {
          const config = TOKEN_CONFIGS[token];
          const isSelected = selectedToken === token;
          const isAvailable = config.vaultAddress !== undefined;

          return (
            <Button
              key={token}
              size="sm"
              variant={isSelected ? "default" : "ghost"}
              onClick={() => isAvailable && onTokenChange(token)}
              disabled={!isAvailable}
              className="toggle-elevate"
              data-testid={`button-token-${token.toLowerCase()}`}
            >
              {token}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
