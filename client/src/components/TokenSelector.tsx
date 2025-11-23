import { TOKEN_CONFIGS, type TokenSymbol } from "@/lib/BoostVaultABI";
import { useToken } from "@/contexts/TokenContext";
import { Check } from "lucide-react";

export function TokenSelector() {
  const { selectedToken, setSelectedToken } = useToken();
  const tokens: TokenSymbol[] = ['cUSD', 'USDC', 'USDT', 'CELO'];

  const handleClick = (token: TokenSymbol) => {
    console.log('🔘 Button clicked:', token);
    setSelectedToken(token);
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Token:</span>
      <div className="flex rounded-lg border-2 border-border bg-background p-1 gap-1">
        {tokens.map((token) => {
          const config = TOKEN_CONFIGS[token];
          const isSelected = selectedToken === token;

          return (
            <button
              key={token}
              onClick={() => handleClick(token)}
              className={`
                relative text-xs sm:text-sm px-2.5 sm:px-3 min-h-[38px] sm:min-h-[34px] 
                rounded-md font-bold transition-all flex items-center justify-center gap-1
                ${isSelected 
                  ? 'bg-emerald-600 text-white shadow-md scale-105 ring-2 ring-emerald-500/50' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
              data-testid={`button-token-${token.toLowerCase()}`}
              title={config.name}
            >
              {isSelected && <Check className="w-3 h-3" />}
              <span>{token}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
