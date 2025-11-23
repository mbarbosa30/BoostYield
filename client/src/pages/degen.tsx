import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useAccount, useReadContract, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Wallet, Zap, Heart, BarChart3 } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DepositDialog } from "@/components/DepositDialog";
import { WithdrawDialog } from "@/components/WithdrawDialog";
import { DonationSettingsDialog } from "@/components/DonationSettingsDialog";
import { TOKEN_CONFIGS, BoostVaultABI } from "@/lib/BoostVaultABI";
import { useToken } from "@/contexts/TokenContext";
import { TokenSelector } from "@/components/TokenSelector";

const AAVE_POOL_ADDRESS = '0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402' as const;
const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;
const POLL_INTERVAL_MS = 5000;

const POOL_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'asset', type: 'address' }],
    name: 'getReserveData',
    outputs: [{
      components: [
        { internalType: 'uint256', name: 'configuration', type: 'uint256' },
        { internalType: 'uint128', name: 'liquidityIndex', type: 'uint128' },
        { internalType: 'uint128', name: 'currentLiquidityRate', type: 'uint128' },
        { internalType: 'uint128', name: 'variableBorrowIndex', type: 'uint128' },
        { internalType: 'uint128', name: 'currentVariableBorrowRate', type: 'uint128' },
        { internalType: 'uint128', name: 'currentStableBorrowRate', type: 'uint128' },
        { internalType: 'uint40', name: 'lastUpdateTimestamp', type: 'uint40' },
        { internalType: 'uint16', name: 'id', type: 'uint16' },
        { internalType: 'address', name: 'aTokenAddress', type: 'address' },
        { internalType: 'address', name: 'stableDebtTokenAddress', type: 'address' },
        { internalType: 'address', name: 'variableDebtTokenAddress', type: 'address' },
        { internalType: 'address', name: 'interestRateStrategyAddress', type: 'address' },
        { internalType: 'uint128', name: 'accruedToTreasury', type: 'uint128' },
        { internalType: 'uint128', name: 'unbacked', type: 'uint128' },
        { internalType: 'uint128', name: 'isolationModeTotalDebt', type: 'uint128' }
      ],
      internalType: 'struct DataTypes.ReserveData',
      name: '',
      type: 'tuple'
    }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

function useAaveAPY(tokenAddress: `0x${string}`) {
  const { data: reserveData } = useReadContract({
    address: AAVE_POOL_ADDRESS,
    abi: POOL_ABI,
    functionName: 'getReserveData',
    args: [tokenAddress],
    query: { refetchInterval: 60000 }
  });
  
  if (!reserveData) return 0;
  
  const liquidityRateRay = reserveData.currentLiquidityRate;
  const apyDecimal = parseFloat(formatUnits(liquidityRateRay, 27));
  return apyDecimal * 100; // Convert to percentage
}

function useInterpolatedEarnings(baseEarnedAmount: bigint, principalAmount: bigint, lastUpdateTime: number, tokenAddress: `0x${string}`, decimals = 18) {
  const [displayValue, setDisplayValue] = useState('0.00');
  const precisionRef = useRef<number>(2);
  const velocityRef = useRef<number>(0);
  
  const { data: reserveData } = useReadContract({
    address: AAVE_POOL_ADDRESS,
    abi: POOL_ABI,
    functionName: 'getReserveData',
    args: [tokenAddress],
    query: { refetchInterval: 60000 }
  });
  
  useEffect(() => {
    const principalNumber = parseFloat(formatUnits(principalAmount, decimals));
    
    if (!reserveData || principalNumber <= 0) {
      velocityRef.current = 0;
      precisionRef.current = 2;
      setDisplayValue('0.00');
      return;
    }
    
    const liquidityRateRay = reserveData.currentLiquidityRate;
    const apyDecimal = parseFloat(formatUnits(liquidityRateRay, 27));
    const velocityPerSecond = principalNumber * apyDecimal / SECONDS_PER_YEAR;
    velocityRef.current = velocityPerSecond;
    
    if (velocityPerSecond > 0) {
      const neededPrecision = Math.max(2, Math.min(Math.ceil(-Math.log10(velocityPerSecond)), decimals));
      precisionRef.current = neededPrecision;
    }
  }, [reserveData, principalAmount, decimals]);
  
  useEffect(() => {
    let animationFrameId: number;
    
    const updateDisplay = () => {
      const now = Date.now();
      const secondsElapsed = (now - lastUpdateTime) / 1000;
      const interpolatedEarnings = velocityRef.current * secondsElapsed;
      const totalEarned = parseFloat(formatUnits(baseEarnedAmount, decimals)) + interpolatedEarnings;
      
      const fullString = totalEarned.toFixed(decimals);
      const parts = fullString.split('.');
      if (!parts[1]) {
        setDisplayValue(fullString);
      } else {
        setDisplayValue(`${parts[0]}.${parts[1].slice(0, precisionRef.current)}`);
      }
      
      animationFrameId = requestAnimationFrame(updateDisplay);
    };
    
    animationFrameId = requestAnimationFrame(updateDisplay);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [baseEarnedAmount, lastUpdateTime, decimals]);
  
  return displayValue;
}

export default function DegenPage() {
  const { address, isConnected } = useAccount();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { selectedToken } = useToken();

  const tokenConfig = TOKEN_CONFIGS[selectedToken];
  const vaultAddress = tokenConfig.vaultAddress;
  const tokenAddress = tokenConfig.address;
  const tokenDecimals = tokenConfig.decimals;

  // Read user's vault balance
  const { data: userShares, isLoading: isLoadingShares } = useReadContract({
    address: vaultAddress,
    abi: BoostVaultABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address && !!vaultAddress,
      refetchInterval: 5000 // Refetch every 5 seconds
    }
  });

  const { data: assetsForShares, dataUpdatedAt } = useReadContract({
    address: vaultAddress,
    abi: BoostVaultABI,
    functionName: 'previewRedeem',
    args: userShares ? [userShares] : undefined,
    query: { 
      enabled: !!userShares && userShares > BigInt(0),
      refetchInterval: POLL_INTERVAL_MS
    }
  });

  // Update timestamp when data changes
  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdate(dataUpdatedAt);
    }
  }, [dataUpdatedAt]);

  const { data: userPrincipal } = useReadContract({
    address: vaultAddress,
    abi: BoostVaultABI,
    functionName: 'principalOf',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address && !!vaultAddress,
      refetchInterval: POLL_INTERVAL_MS
    }
  });

  const { data: userDonationPct } = useReadContract({
    address: vaultAddress,
    abi: BoostVaultABI,
    functionName: 'donationPctOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!vaultAddress }
  });

  const { data: totalAssets } = useReadContract({
    address: vaultAddress,
    abi: BoostVaultABI,
    functionName: 'totalAssets',
    query: { enabled: !!vaultAddress }
  });

  const { data: cusdBalance } = useBalance({
    address: address,
    token: tokenAddress,
    query: { enabled: !!address }
  });

  // Calculate stats
  const deposited = assetsForShares || BigInt(0);
  const principal = userPrincipal || BigInt(0);
  const profit = deposited > principal ? deposited - principal : BigInt(0);
  const donationPct = Number(userDonationPct || BigInt(0));
  const totalDonated = (profit * BigInt(donationPct)) / BigInt(100);
  const netProfit = profit - totalDonated;
  
  const formattedProfit = useInterpolatedEarnings(profit, principal, lastUpdate, tokenAddress, tokenDecimals);
  const currentAPY = useAaveAPY(tokenAddress);

  const tvl = totalAssets ? Number(formatUnits(BigInt(totalAssets.toString()), tokenDecimals)) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-lg border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 px-3 py-2 rounded-md">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-lg font-accent font-semibold">Relay Boost</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <TokenSelector />
            <ConnectButton />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-8 pb-12 space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-4xl font-accent font-bold mb-2">Yield Protocol</h1>
          <p className="text-muted-foreground">
            Aave V3 optimized vault · Celo mainnet · ERC4626 compliant
          </p>
        </div>

        {/* Protocol Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current APY</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {currentAPY > 0 ? `${currentAPY.toFixed(2)}%` : 'Loading...'}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Real-time Aave V3 rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Value Locked</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${tvl.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Protocol deposits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="mb-2">Stable Yield</Badge>
              <p className="text-xs text-muted-foreground">Single-asset cUSD lending</p>
            </CardContent>
          </Card>
        </div>

        {!isConnected ? (
          <Card className="border-dashed">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                <CardTitle>Connect Wallet</CardTitle>
              </div>
              <CardDescription>
                Deploy capital to start earning institutional-grade yields
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button onClick={openConnectModal} size="lg" data-testid="button-connect-wallet">
                    <Zap className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                )}
              </ConnectButton.Custom>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Position Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Position</CardTitle>
                    <CardDescription>Active deployment performance</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingShares ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Loading position...</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Deposited</p>
                      <p className="text-2xl font-bold">${Number(formatUnits(deposited, 18)).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">Principal + accrued yield</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Profit Realized
                      </p>
                      <p className="text-xl font-bold text-emerald-600 font-mono">
                        +${formattedProfit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Zero-Fee Giving</p>
                      <p className="text-2xl font-bold text-pink-600">
                        ${Number(formatUnits(totalDonated, 18)).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{donationPct}% of yield donated</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
                      <p className="text-2xl font-bold">
                        ${Number(formatUnits(netProfit, 18)).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">After donations</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Donation Feature - Prominently Displayed */}
            <Card className="border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <CardTitle>Automated Philanthropy</CardTitle>
                </div>
                <CardDescription>
                  Donate yield without touching principal. Zero fees, recurring impact, tax-efficient giving.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Current Donation Rate: {donationPct}%</p>
                    <p className="text-sm text-muted-foreground">
                      {donationPct === 0 
                        ? "Enable giving to automate your impact"
                        : `${donationPct}% of every yield payment goes to verified causes`}
                    </p>
                  </div>
                  <Button
                    onClick={() => setDonationOpen(true)}
                    variant={donationPct > 0 ? "outline" : "default"}
                    data-testid="button-configure-giving"
                  >
                    {donationPct > 0 ? "Adjust Giving" : "Start Giving"}
                  </Button>
                </div>
                {donationPct > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Your Impact</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total donated to date</span>
                      <span className="font-semibold text-pink-600">
                        ${Number(formatUnits(totalDonated, 18)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setDepositOpen(true)}
                size="lg"
                className="h-auto py-4"
                data-testid="button-open-deposit"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="font-semibold">Deploy Capital</div>
                  <div className="text-xs opacity-80">Add {selectedToken} to earn yield</div>
                </div>
              </Button>
              <Button
                onClick={() => setWithdrawOpen(true)}
                variant="outline"
                size="lg"
                className="h-auto py-4"
                data-testid="button-open-withdraw"
              >
                <div className="text-left">
                  <div className="font-semibold">Withdraw Position</div>
                  <div className="text-xs opacity-80">Redeem shares for {selectedToken}</div>
                </div>
              </Button>
            </div>

            {/* Contract Info */}
            <Card className="border-muted">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vault Contract</span>
                  <code className="text-xs">{vaultAddress}</code>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Not financial advice. DYOR. Past performance doesn't guarantee future returns.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Dialogs */}
      <DepositDialog
        open={depositOpen}
        onOpenChange={setDepositOpen}
        cusdBalance={cusdBalance?.value}
      />
      <WithdrawDialog
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        vaultShares={userShares}
        userPrincipal={userPrincipal}
        donationPct={donationPct}
      />
      <DonationSettingsDialog
        open={donationOpen}
        onOpenChange={setDonationOpen}
      />
    </div>
  );
}
