import { Link, useRoute } from "wouter";
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
  // Check routes on initial render to avoid navbar flash
  const [isMiniRoute] = useRoute("/mini");
  const [isDegenRoute] = useRoute("/degen");
  const [isSimpleRoute] = useRoute("/simple");
  
  // Hide navigation in Farcaster miniapp or on focused routes
  if (isMiniRoute || isDegenRoute || isSimpleRoute || isFarcasterMiniapp()) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover-elevate active-elevate-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-base sm:text-xl font-accent font-semibold">Relay Boost</span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
        </div>
      </div>
    </nav>
  );
}
