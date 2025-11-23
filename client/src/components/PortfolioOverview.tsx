import { useAccount, useReadContracts } from "wagmi";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Wallet, Coins } from "lucide-react";
import { BoostVaultABI, TOKEN_CONFIGS } from "@/lib/BoostVaultABI";
import { formatUnits } from "viem";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";

interface TokenPosition {
  symbol: string;
  deposited: bigint;
  principal: bigint;
  shares: bigint;
  decimals: number;
  vaultAddress: `0x${string}`;
  isStablecoin: boolean;
}

const STABLECOINS = ['cUSD', 'USDC', 'USDT'];

export function PortfolioOverview() {
  const { address } = useAccount();

  // Get all active vaults
  const activeVaults = useMemo(() => 
    Object.entries(TOKEN_CONFIGS).filter(
      ([, config]) => config.vaultAddress && config.vaultAddress !== '0x0000000000000000000000000000000000000000'
    ), []
  );

  // Build all contract calls at top level
  const allContracts = useMemo(() => {
    if (!address) return [];
    
    return activeVaults.flatMap(([, config]) => {
      const vaultAddr = config.vaultAddress as `0x${string}`;
      return [
        {
          address: vaultAddr,
          abi: BoostVaultABI,
          functionName: 'balanceOf',
          args: [address],
        },
        {
          address: vaultAddr,
          abi: BoostVaultABI,
          functionName: 'principalOf',
          args: [address],
        }
      ];
    });
  }, [address, activeVaults]);

  // Fetch shares and principal for all vaults with live updates
  const { data: baseResults, isLoading: isLoadingBase } = useReadContracts({
    contracts: allContracts as any,
    query: {
      enabled: allContracts.length > 0,
      refetchInterval: 5000,
    }
  });

  // Build previewRedeem contracts only for vaults with shares
  const redeemContracts = useMemo(() => {
    if (!baseResults) return [];
    
    const contracts: any[] = [];
    for (let i = 0; i < activeVaults.length; i++) {
      const sharesIdx = i * 2;
      const shares = baseResults[sharesIdx]?.result as bigint | undefined;
      
      if (shares && shares > BigInt(0)) {
        const [, config] = activeVaults[i];
        contracts.push({
          address: config.vaultAddress as `0x${string}`,
          abi: BoostVaultABI,
          functionName: 'previewRedeem',
          args: [shares],
        });
      }
    }
    return contracts;
  }, [baseResults, activeVaults]);

  // Fetch previewRedeem for positions with shares
  const { data: redeemResults, isLoading: isLoadingRedeem } = useReadContracts({
    contracts: redeemContracts as any,
    query: {
      enabled: redeemContracts.length > 0,
      refetchInterval: 5000,
    }
  });

  // Parse all results into token positions
  const portfolioData: TokenPosition[] = useMemo(() => {
    if (!baseResults) return [];
    
    const positions: TokenPosition[] = [];
    let redeemIdx = 0;
    
    for (let i = 0; i < activeVaults.length; i++) {
      const [symbol, config] = activeVaults[i];
      const sharesIdx = i * 2;
      const principalIdx = i * 2 + 1;
      
      const shares = (baseResults[sharesIdx]?.result as bigint | undefined) || BigInt(0);
      const principal = (baseResults[principalIdx]?.result as bigint | undefined) || BigInt(0);
      
      // Only use previewRedeem result if shares > 0, otherwise deposited = 0
      let deposited = BigInt(0);
      if (shares > BigInt(0) && redeemResults) {
        deposited = (redeemResults[redeemIdx]?.result as bigint | undefined) || BigInt(0);
        redeemIdx++;
      }
      
      positions.push({
        symbol,
        shares,
        principal,
        deposited,
        decimals: config.decimals,
        vaultAddress: config.vaultAddress as `0x${string}`,
        isStablecoin: STABLECOINS.includes(symbol)
      });
    }
    
    return positions;
  }, [baseResults, redeemResults, activeVaults]);

  // Calculate totals ONLY for stablecoins
  const { stablecoinTotals, stablecoinPositions, volatilePositions } = useMemo(() => {
    const normalize = (value: bigint, decimals: number) => {
      if (decimals === 18) return value;
      return value * BigInt(10 ** (18 - decimals));
    };

    const stablecoins = portfolioData.filter(pos => pos.isStablecoin && pos.shares > BigInt(0));
    const volatile = portfolioData.filter(pos => !pos.isStablecoin && pos.shares > BigInt(0));

    const deposited = stablecoins.reduce((sum, pos) => 
      sum + normalize(pos.deposited, pos.decimals), BigInt(0)
    );

    const principal = stablecoins.reduce((sum, pos) => 
      sum + normalize(pos.principal, pos.decimals), BigInt(0)
    );

    const yield_ = deposited - principal;

    return {
      stablecoinTotals: {
        deposited,
        principal,
        yield: yield_
      },
      stablecoinPositions: stablecoins,
      volatilePositions: volatile
    };
  }, [portfolioData]);

  if (!address) {
    return null;
  }

  const isLoading = isLoadingBase || (redeemContracts.length > 0 && isLoadingRedeem);
  const hasStablecoins = stablecoinPositions.length > 0;
  const hasVolatile = volatilePositions.length > 0;
  const hasAnyPositions = hasStablecoins || hasVolatile;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Portfolio Overview</CardTitle>
            <CardDescription>Your positions across all vaults</CardDescription>
          </div>
          <Badge variant="secondary">
            <Wallet className="w-3 h-3 mr-1" />
            {stablecoinPositions.length + volatilePositions.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Loading your portfolio...</p>
          </div>
        ) : !hasAnyPositions ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No deposits yet. Connect your wallet and deposit to start earning.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stablecoin Savings Section */}
            {hasStablecoins && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Stablecoin Savings</h3>
                
                {/* Aggregated Stats for Stablecoins Only */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">Total Deposited</p>
                    <p className="text-2xl font-bold" data-testid="portfolio-stable-deposited">
                      ${Number(formatUnits(stablecoinTotals.deposited, 18)).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                    <p className="text-sm text-muted-foreground mb-1">Total Yield Earned</p>
                    <p className="text-xl font-bold text-emerald-600 font-mono" data-testid="portfolio-stable-yield">
                      +${Number(formatUnits(stablecoinTotals.yield, 18)).toFixed(2)}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Coins className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">Stablecoins</p>
                    <p className="text-2xl font-bold">{stablecoinPositions.length}</p>
                  </div>
                </div>

                {/* Stablecoin Breakdown */}
                <div className="space-y-2">
                  {stablecoinPositions.map((position) => {
                    const deposited = Number(formatUnits(position.deposited, position.decimals));
                    const principal = Number(formatUnits(position.principal, position.decimals));
                    const yield_ = deposited - principal;
                    
                    return (
                      <div 
                        key={position.symbol} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover-elevate"
                        data-testid={`portfolio-token-${position.symbol.toLowerCase()}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{position.symbol}</span>
                          </div>
                          <div>
                            <p className="font-medium">{position.symbol}</p>
                            <p className="text-xs text-muted-foreground">
                              Principal: ${principal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${deposited.toFixed(2)}</p>
                          <p className="text-xs text-emerald-600 font-mono">
                            +${yield_.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Other Assets Section (Volatile Assets like CELO) */}
            {hasVolatile && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Other Assets</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Token amounts shown (not USD value). Prices fluctuate.
                </p>
                
                <div className="space-y-2">
                  {volatilePositions.map((position) => {
                    const deposited = Number(formatUnits(position.deposited, position.decimals));
                    const principal = Number(formatUnits(position.principal, position.decimals));
                    const yield_ = deposited - principal;
                    
                    return (
                      <div 
                        key={position.symbol} 
                        className="flex items-center justify-between p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/10 hover-elevate"
                        data-testid={`portfolio-token-${position.symbol.toLowerCase()}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-amber-600">{position.symbol}</span>
                          </div>
                          <div>
                            <p className="font-medium">{position.symbol}</p>
                            <p className="text-xs text-muted-foreground">
                              Volatile asset
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{deposited.toFixed(4)} {position.symbol}</p>
                          <p className="text-xs text-emerald-600 font-mono">
                            +{yield_.toFixed(4)} {position.symbol}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
