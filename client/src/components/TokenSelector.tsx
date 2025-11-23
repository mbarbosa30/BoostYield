import { TOKEN_CONFIGS, type TokenSymbol } from "@/lib/BoostVaultABI";
import { useToken } from "@/contexts/TokenContext";

export function TokenSelector() {
  const { selectedToken, setSelectedToken } = useToken();
  const tokens: TokenSymbol[] = ['cUSD', 'USDC', 'USDT', 'CELO'];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const token = e.target.value as TokenSymbol;
    console.log('🔘 Token selected:', token);
    setSelectedToken(token);
  };

  const handleButtonClick = (token: TokenSymbol) => {
    console.log('🔘 Button clicked:', token);
    setSelectedToken(token);
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Token:</span>
      
      {/* Mobile: Native Select Dropdown */}
      <select
        value={selectedToken}
        onChange={handleChange}
        className="sm:hidden min-h-[44px] px-3 py-2 rounded-md border-2 border-border bg-background text-sm font-medium appearance-none cursor-pointer"
        data-testid="select-token-mobile"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem'
        }}
      >
        {tokens.map((token) => (
          <option key={token} value={token}>
            {token}
          </option>
        ))}
      </select>

      {/* Desktop: Pill Buttons */}
      <div className="hidden sm:flex rounded-lg border border-border bg-muted/30 p-1 gap-1">
        {tokens.map((token) => {
          const config = TOKEN_CONFIGS[token];
          const isSelected = selectedToken === token;

          return (
            <button
              key={token}
              onClick={() => handleButtonClick(token)}
              className={`
                text-sm px-3 min-h-[32px] 
                rounded-md font-medium transition-all
                ${isSelected 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
              data-testid={`button-token-${token.toLowerCase()}`}
              title={config.name}
            >
              {token}
            </button>
          );
        })}
      </div>
    </div>
  );
}
