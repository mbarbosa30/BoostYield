import { useState } from "react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { RiskDisclosureModal } from "@/components/RiskDisclosureModal";
import type { Currency } from "@/components/CurrencyToggle";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [currency, setCurrency] = useState<Currency>("USD");
  const [showSafeModal, setShowSafeModal] = useState(false);
  const [showDegenModal, setShowDegenModal] = useState(false);

  const handleSimpleClick = () => {
    setShowSafeModal(true);
  };

  const handleDegenClick = () => {
    setShowDegenModal(true);
  };

  const handleSimpleAccept = () => {
    setShowSafeModal(false);
    setLocation("/simple");
  };

  const handleDegenAccept = () => {
    setShowDegenModal(false);
    setLocation("/degen");
  };

  return (
    <div className="min-h-screen">
      <Navigation currency={currency} onCurrencyChange={setCurrency} />
      
      <main className="pt-16">
        <HeroSection 
          onSafeClick={handleSimpleClick}
          onDegenClick={handleDegenClick}
        />
        <HowItWorksSection />
      </main>

      <footer className="border-t py-8 px-6">
        <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Boost. Not a bank. DeFi carries risks.</p>
        </div>
      </footer>

      <RiskDisclosureModal
        open={showSafeModal}
        onOpenChange={setShowSafeModal}
        type="safe"
        onAccept={handleSimpleAccept}
      />

      <RiskDisclosureModal
        open={showDegenModal}
        onOpenChange={setShowDegenModal}
        type="safe"
        onAccept={handleDegenAccept}
      />
    </div>
  );
}
