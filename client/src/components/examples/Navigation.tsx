import { Navigation } from "../Navigation";

export default function NavigationExample() {
  return (
    <Navigation 
      onCurrencyChange={(currency) => console.log("Currency:", currency)} 
    />
  );
}
