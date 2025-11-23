import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Sparkles, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { YieldPreference } from "@shared/schema";

interface YieldPreferenceSelectorProps {
  variant?: 'simple' | 'degen';
}

export function YieldPreferenceSelector({ variant = 'simple' }: YieldPreferenceSelectorProps) {
  const { address } = useAccount();
  const { toast } = useToast();
  const [selectedToken, setSelectedToken] = useState<string>('SAME');

  // Fetch current preference
  const { data: preference } = useQuery<YieldPreference>({
    queryKey: ['/api/yield-preference', address],
    queryFn: async () => {
      if (!address) return null;
      const response = await fetch(`/api/yield-preference/${address}`);
      if (!response.ok) {
        if (response.status === 404) return null; // No preference set yet
        throw new Error(`Failed to fetch preference: ${response.statusText}`);
      }
      return response.json();
    },
    enabled: !!address,
  });

  // Update local state when preference loads
  useEffect(() => {
    if (preference) {
      setSelectedToken(preference.preferredYieldToken);
    }
  }, [preference]);

  // Update preference mutation
  const updatePreference = useMutation({
    mutationFn: async (preferredToken: string) => {
      if (!address) throw new Error('Wallet not connected');
      
      const response = await apiRequest('POST', '/api/yield-preference', {
        walletAddress: address,
        preferredYieldToken: preferredToken,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/yield-preference', address] });
      toast({
        title: "Preference updated",
        description: variant === 'simple' 
          ? "Your yield will now be converted to your chosen token when you withdraw."
          : "Yield conversion preference updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Failed to update preference:', error);
      toast({
        title: "Update failed",
        description: "Could not save your preference. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTokenSelect = (token: string) => {
    setSelectedToken(token);
    updatePreference.mutate(token);
  };

  if (!address) {
    return null;
  }

  const options = [
    {
      value: 'SAME',
      label: variant === 'simple' ? 'Keep in Stablecoins' : 'Same as Deposit',
      description: variant === 'simple'
        ? 'Get all your earnings back in stable dollars'
        : 'Receive yields in the same token you deposited',
      icon: Coins,
    },
    {
      value: 'CELO',
      label: variant === 'simple' ? 'Convert to CELO' : 'Earn in CELO',
      description: variant === 'simple'
        ? 'Auto-swap your earnings to CELO for growth potential'
        : 'Automatically convert profits to CELO on withdrawal',
      icon: Sparkles,
      badge: 'Active',
    },
  ];

  return (
    <Card data-testid="card-yield-preference">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          {variant === 'simple' ? 'Choose How You Earn' : 'Yield Output Preference'}
        </CardTitle>
        <CardDescription>
          {variant === 'simple'
            ? 'Decide how you want to receive your earnings'
            : 'Select which token to receive your yield in upon withdrawal'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedToken === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => handleTokenSelect(option.value)}
              disabled={updatePreference.isPending}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all
                ${isSelected 
                  ? 'border-primary bg-accent/50' 
                  : 'border-border hover-elevate'
                }
                ${updatePreference.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              data-testid={`button-yield-${option.value.toLowerCase()}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{option.label}</div>
                      {option.badge && isSelected && (
                        <Badge variant="default" className="text-xs">
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                  </div>
                )}
              </div>
            </button>
          );
        })}

        {/* Future tokens teaser */}
        <div className="p-4 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20">
          <div className="flex items-start gap-3">
            <ExternalLink className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div>
              <div className="font-medium text-sm">More tokens coming soon</div>
              <div className="text-xs text-muted-foreground mt-1">
                {variant === 'simple'
                  ? 'Soon you\'ll be able to choose from more tokens, each with special bonuses from partner projects.'
                  : 'Token sponsors can offer bonus APY for users who convert yields to their tokens.'}
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // Trigger token suggestion dialog via custom event
                  window.dispatchEvent(new CustomEvent('openTokenSuggestion'));
                }}
                className="text-xs text-primary hover:underline mt-2 inline-block cursor-pointer bg-transparent border-none p-0"
                data-testid="link-suggest-token"
              >
                Suggest a token →
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
