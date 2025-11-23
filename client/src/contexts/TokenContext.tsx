import { createContext, useContext, useState, type ReactNode } from "react";
import type { TokenSymbol } from "@/lib/BoostVaultABI";
import { TOKEN_CONFIGS } from "@/lib/BoostVaultABI";

interface TokenContextType {
  selectedToken: TokenSymbol;
  setSelectedToken: (token: TokenSymbol) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [selectedToken, setSelectedToken] = useState<TokenSymbol>('cUSD');

  // Validate token selection - only allow tokens with configured vaults
  const handleTokenChange = (token: TokenSymbol) => {
    console.log('🔄 TokenContext handleTokenChange called with:', token);
    const config = TOKEN_CONFIGS[token];
    console.log('🔍 Token config:', config);
    if (config.vaultAddress) {
      console.log('✅ Valid vault address, changing token to:', token);
      setSelectedToken(token);
    } else {
      console.warn(`Token ${token} selected but vault address not configured. Keeping current token: ${selectedToken}`);
    }
  };

  return (
    <TokenContext.Provider value={{ selectedToken, setSelectedToken: handleTokenChange }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
}
