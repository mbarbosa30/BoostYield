import { TOKEN_CONFIGS, type TokenSymbol } from "@/lib/BoostVaultABI";
import { useToken } from "@/contexts/TokenContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TokenSelector() {
  const { selectedToken, setSelectedToken } = useToken();
  const tokens: TokenSymbol[] = ['cUSD', 'USDC', 'USDT', 'CELO'];

  // Debug: Log TOKEN_CONFIGS to see what's actually loaded
  console.log('TOKEN_CONFIGS:', TOKEN_CONFIGS);

  return (
    <>
      {/* Mobile: Dropdown Select */}
      <div className="sm:hidden">
        <Select 
          value={selectedToken} 
          onValueChange={(value) => {
            console.log('TokenSelector onValueChange:', value);
            setSelectedToken(value as TokenSymbol);
          }}
        >
          <SelectTrigger 
            className="w-[100px] min-h-[44px]"
            data-testid="select-token-mobile"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-[100]">
            {tokens.map((token) => {
              const config = TOKEN_CONFIGS[token];
              return (
                <SelectItem 
                  key={token} 
                  value={token}
                  data-testid={`option-token-${token.toLowerCase()}`}
                >
                  {token} - {config.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Button Toggle */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Token:</span>
        <div className="flex rounded-lg border p-1 gap-1">
          {tokens.map((token) => {
            const config = TOKEN_CONFIGS[token];
            const isSelected = selectedToken === token;

            return (
              <Button
                key={token}
                size="sm"
                variant={isSelected ? "default" : "ghost"}
                onClick={() => setSelectedToken(token)}
                className="text-sm px-3 relative cursor-pointer"
                data-testid={`button-token-${token.toLowerCase()}`}
                title={config.name}
              >
                {token}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
}
