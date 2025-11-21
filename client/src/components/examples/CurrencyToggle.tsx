import { CurrencyToggle } from "../CurrencyToggle";

export default function CurrencyToggleExample() {
  return (
    <CurrencyToggle 
      onValueChange={(currency) => console.log("Currency changed:", currency)} 
    />
  );
}
