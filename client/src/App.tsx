import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './lib/wagmi';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TokenProvider } from "@/contexts/TokenContext";
import LandingPage from "@/pages/landing";
import VaultPage from "@/pages/vault";
import DegenPage from "@/pages/degen";
import SimplePage from "@/pages/simple";
import HowItWorksPage from "@/pages/how-it-works";
import RoadmapPage from "@/pages/roadmap";
import NotFound from "@/pages/not-found";
import '@rainbow-me/rainbowkit/styles.css';

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/vault" component={VaultPage} />
      <Route path="/mini" component={SimplePage} />
      <Route path="/degen" component={DegenPage} />
      <Route path="/simple" component={SimplePage} />
      <Route path="/how-it-works" component={HowItWorksPage} />
      <Route path="/roadmap" component={RoadmapPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          <TokenProvider>
            <TooltipProvider>
              <Router />
              <Toaster />
            </TooltipProvider>
          </TokenProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
