import { HeroSection } from "../HeroSection";

export default function HeroSectionExample() {
  return (
    <HeroSection 
      onSafeClick={() => console.log("Safe clicked")}
      onDegenClick={() => console.log("Degen clicked")}
    />
  );
}
