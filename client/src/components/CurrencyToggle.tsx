import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type Currency = "USD" | "ARS" | "NGN" | "BRL";

interface CurrencyToggleProps {
  value?: Currency;
  onValueChange?: (currency: Currency) => void;
}

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "ARS", symbol: "$", name: "Argentine Peso" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
];

export function CurrencyToggle({ value, onValueChange }: CurrencyToggleProps) {
  const [currency, setCurrency] = useState<Currency>(value || "USD");

  const handleChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    onValueChange?.(newCurrency);
  };

  return (
    <Select value={currency} onValueChange={handleChange}>
      <SelectTrigger 
        className="w-[140px]" 
        data-testid="select-currency"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((curr) => (
          <SelectItem 
            key={curr.code} 
            value={curr.code}
            data-testid={`option-currency-${curr.code.toLowerCase()}`}
          >
            {curr.code} ({curr.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
