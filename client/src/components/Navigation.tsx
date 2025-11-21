import { Link } from "wouter";
import { ThemeToggle } from "./ThemeToggle";
import { CurrencyToggle } from "./CurrencyToggle";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import type { Currency } from "./CurrencyToggle";

interface NavigationProps {
  currency?: Currency;
  onCurrencyChange?: (currency: Currency) => void;
}

export function Navigation({ currency, onCurrencyChange }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" data-testid="link-home">
          <div className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 px-3 py-2 rounded-md">
            <Shield className="h-6 w-6 text-safe-primary" />
            <span className="text-xl font-accent font-semibold">FlowShelter</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <CurrencyToggle value={currency} onValueChange={onCurrencyChange} />
          <ThemeToggle />
          <Button 
            variant="default" 
            data-testid="button-connect-wallet"
            className="hover-elevate active-elevate-2"
          >
            Connect Wallet
          </Button>
        </div>
      </div>
    </nav>
  );
}
