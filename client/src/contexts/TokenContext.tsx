import { createContext, useContext, useState, type ReactNode } from "react";
import type { TokenSymbol } from "@/lib/BoostVaultABI";

interface TokenContextType {
  selectedToken: TokenSymbol;
  setSelectedToken: (token: TokenSymbol) => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [selectedToken, setSelectedToken] = useState<TokenSymbol>('cUSD');

  return (
    <TokenContext.Provider value={{ selectedToken, setSelectedToken }}>
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
