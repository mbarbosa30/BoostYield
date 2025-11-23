import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { IntegrationsSection } from "@/components/IntegrationsSection";
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
      
      <main className="pt-14 sm:pt-16">
        <HeroSection 
          onSafeClick={handleSimpleClick}
          onDegenClick={handleDegenClick}
        />
        <HowItWorksSection />
        <IntegrationsSection />
      </main>

      <footer className="border-t py-6 sm:py-8 px-3 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex gap-6">
              <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-how-it-works">
                How It Works
              </Link>
              <Link href="/roadmap" className="text-sm text-muted-foreground hover:text-foreground" data-testid="link-roadmap">
                Roadmap
              </Link>
            </div>
          </div>
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>© 2025 Relay Boost. Not a bank. DeFi carries risks.</p>
          </div>
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
