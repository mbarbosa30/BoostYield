import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencyToggle } from "./CurrencyToggle";
import { TrendingUp } from "lucide-react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { isFarcasterMiniapp } from "@/lib/farcasterClient";
import type { Currency } from "./CurrencyToggle";

interface NavigationProps {
  currency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
}

export function Navigation({ currency, onCurrencyChange }: NavigationProps) {
  const [isMiniapp, setIsMiniapp] = useState(false);

  useEffect(() => {
    setIsMiniapp(isFarcasterMiniapp());
  }, []);

  // Hide navigation in Farcaster miniapp (mobile-optimized UI)
  if (isMiniapp) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 px-3 py-2 rounded-md">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="text-xl font-accent font-semibold">Boost</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <CurrencyToggle value={currency} onValueChange={onCurrencyChange} />
          <ThemeToggle />
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
