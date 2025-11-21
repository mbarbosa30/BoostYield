import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { SafeShowcaseSection } from "@/components/SafeShowcaseSection";
import { DegenShowcaseSection } from "@/components/DegenShowcaseSection";
import { CauseBrowseSection } from "@/components/CauseBrowseSection";
import { FinalCTASection } from "@/components/FinalCTASection";
import { RiskDisclosureModal } from "@/components/RiskDisclosureModal";
import type { Currency } from "@/components/CurrencyToggle";

export default function LandingPage() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [showSafeModal, setShowSafeModal] = useState(false);
  const [showDegenModal, setShowDegenModal] = useState(false);

  const handleSafeClick = () => {
    setShowSafeModal(true);
  };

  const handleDegenClick = () => {
    setShowDegenModal(true);
  };

  const handleSafeAccept = () => {
    console.log("Safe vault access granted");
  };

  const handleDegenAccept = () => {
    console.log("Degen strategy access granted");
  };

  return (
    <div className="min-h-screen">
      <Navigation currency={currency} onCurrencyChange={setCurrency} />
      
      <main className="pt-16">
        <HeroSection 
          onSafeClick={handleSafeClick}
          onDegenClick={handleDegenClick}
        />
        <HowItWorksSection />
        <SafeShowcaseSection />
        <DegenShowcaseSection />
        <CauseBrowseSection />
        <FinalCTASection />
      </main>

      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Boost. Not a bank. DeFi carries risks. Built on Celo with Uniswap V4 + Aave.</p>
        </div>
      </footer>

      <RiskDisclosureModal
        open={showSafeModal}
        onOpenChange={setShowSafeModal}
        type="safe"
        onAccept={handleSafeAccept}
      />

      <RiskDisclosureModal
        open={showDegenModal}
        onOpenChange={setShowDegenModal}
        type="degen"
        onAccept={handleDegenAccept}
      />
    </div>
  );
}
