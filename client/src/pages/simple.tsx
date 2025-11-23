import { useState, useEffect, useRef } from "react";
import { Link, useRoute } from "wouter";
import { useAccount, useReadContract, useBalance, useConnect } from "wagmi";
import { formatUnits } from "viem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, DollarSign, Heart, TrendingUp, CheckCircle } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DepositDialog } from "@/components/DepositDialog";
import { WithdrawDialog } from "@/components/WithdrawDialog";
import { DonationSettingsDialog } from "@/components/DonationSettingsDialog";
import { TokenSelector } from "@/components/TokenSelector";
import { YieldPreferenceSelector } from "@/components/YieldPreferenceSelector";
import { TokenSuggestionForm } from "@/components/TokenSuggestionForm";
import { PortfolioOverview } from "@/components/PortfolioOverview";
import { ShareCastButton } from "@/components/ShareCastButton";
import { BoostVaultABI, TOKEN_CONFIGS } from "@/lib/BoostVaultABI";
import { useToken } from "@/contexts/TokenContext";
import { initializeFarcaster, getFarcasterContext, isFarcasterMiniapp, type FarcasterContext } from "@/lib/farcasterClient";

const AAVE_POOL_ADDRESS = '0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402' as const;
const SECONDS_PER_YEAR = 365.25 * 24 * 60 * 60;
const POLL_INTERVAL_MS = 5000;
const STABLECOINS = ['cUSD', 'USDC', 'USDT'];

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

export default function SimplePage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { selectedToken, setSelectedToken } = useToken();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [tokenSuggestOpen, setTokenSuggestOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [farcasterContext, setFarcasterContext] = useState<FarcasterContext>(null);
  
  // Check if we're on the /mini route
  const [isMiniRoute] = useRoute("/mini");
  const isFarcaster = isMiniRoute || isFarcasterMiniapp();

  // Initialize Farcaster SDK and auto-connect wallet (only in Farcaster context)
  useEffect(() => {
    if (!isFarcaster) return;
    
    const init = async () => {
      await initializeFarcaster();
      const context = await getFarcasterContext();
      setFarcasterContext(context);
      
      if (context) {
        console.log('✅ Farcaster miniapp context available:', {
          user: context.user?.username,
          fid: context.user?.fid,
          location: context.location,
          note: 'Auto-connecting Farcaster wallet...'
        });

        // Auto-connect the Farcaster wallet if not already connected
        if (!isConnected && connectors.length > 0) {
          const farcasterConnector = connectors.find(c => c.id === 'farcaster-miniapp');
          if (farcasterConnector) {
            try {
              console.log('🔌 Attempting auto-connect with Farcaster connector...');
              await connect({ connector: farcasterConnector });
            } catch (error) {
              console.error('❌ Auto-connect failed:', error);
            }
          } else {
            console.warn('⚠️ Farcaster connector not found. Available connectors:', connectors.map(c => c.id));
          }
        }
      }
    };
    init();
  }, [isFarcaster, isConnected, connect, connectors]);

  // Listen for token suggestion events
  useEffect(() => {
    const handleOpenSuggestion = () => setTokenSuggestOpen(true);
    window.addEventListener('openTokenSuggestion', handleOpenSuggestion);
    return () => window.removeEventListener('openTokenSuggestion', handleOpenSuggestion);
  }, []);

  const tokenConfig = TOKEN_CONFIGS[selectedToken];
  const vaultAddress = tokenConfig.vaultAddress;
  const tokenAddress = tokenConfig.address;
  const tokenDecimals = tokenConfig.decimals;
  const isTokenSupported = !!vaultAddress;
  const isStablecoin = STABLECOINS.includes(selectedToken);

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

  // Debug: Log values when they change
  useEffect(() => {
    if (assetsForShares) {
      console.log('📊 Assets for shares:', assetsForShares.toString());
      console.log('📊 Formatted:', formatUnits(assetsForShares, tokenDecimals));
      console.log('📊 Updated at:', new Date(dataUpdatedAt).toISOString());
    }
  }, [assetsForShares, dataUpdatedAt, tokenDecimals]);

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

  const { data: tokenBalance } = useBalance({
    address: address,
    token: tokenAddress,
    query: { enabled: !!address }
  });

  // Calculate stats
  const savedAmount = userPrincipal || BigInt(0);
  const totalAmount = assetsForShares || BigInt(0);
  const earned = totalAmount > savedAmount ? totalAmount - savedAmount : BigInt(0);
  const donationPct = Number(userDonationPct || BigInt(0));
  const donated = (earned * BigInt(donationPct)) / BigInt(100);
  const yourMoney = totalAmount - donated;
  
  const formattedEarned = useInterpolatedEarnings(earned, savedAmount, lastUpdate, tokenAddress, tokenDecimals);
  const currentAPY = useAaveAPY(tokenAddress);

  // Convert to local display (simplified - in production would use exchange rates)
  const earningRate = currentAPY > 0 ? `${currentAPY.toFixed(2)}% per year` : "loading...";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-background dark:from-background dark:to-background">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-lg border-b">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover-elevate active-elevate-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <span className="text-base sm:text-lg font-accent font-semibold">Relay Boost</span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-4">
            <TokenSelector />
            <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-12 space-y-3 sm:space-y-4">
        {/* How It Works - Simple Steps */}
        {!isConnected && (
          <>
            <div className="text-center mb-3 sm:mb-4">
              <h1 className="text-2xl sm:text-3xl font-accent font-bold mb-2">Grow Your Money</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Save safely and earn {earningRate}
              </p>
            </div>

            <Card className="border-emerald-200 bg-white dark:bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl">How It Works</CardTitle>
                <CardDescription className="text-sm sm:text-base">Three simple steps to start</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm sm:text-base text-emerald-700 dark:text-emerald-400 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">Connect Your Wallet</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Use MetaMask or Valora - we keep your money safe
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm sm:text-base text-emerald-700 dark:text-emerald-400 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">Save Your Money</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Put in as much or as little as you want
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm sm:text-base text-emerald-700 dark:text-emerald-400 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">Watch It Grow</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Your money grows automatically - take it out anytime
                    </p>
                  </div>
                </div>

                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <Button
                      onClick={openConnectModal}
                      size="lg"
                      className="w-full min-h-[44px] sm:h-14 text-base sm:text-lg mt-2"
                      data-testid="button-connect-wallet"
                    >
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Connect Wallet to Start
                    </Button>
                  )}
                </ConnectButton.Custom>
              </CardContent>
            </Card>
          </>
        )}

        {isConnected && (
          <>
            {isLoadingShares ? (
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-center py-8">
                    <div className="text-sm sm:text-base text-muted-foreground">Loading your money...</div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Hero Earnings Card - PROMINENTLY DISPLAYED */}
                <Card className="border-emerald-300 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-emerald-950/30">
                  <CardContent className="pt-4 pb-4 sm:pt-6 sm:pb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                        <p className="text-sm sm:text-base font-medium text-muted-foreground">
                          You Earned
                        </p>
                      </div>
                      <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-emerald-600 font-mono mb-2" data-testid="text-earned-amount">
                        {isStablecoin 
                          ? `+$${formattedEarned}`
                          : `+${formattedEarned} ${selectedToken}`
                        }
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Growing at {earningRate}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Primary Action - Save Money Button */}
                <Button
                  onClick={() => setDepositOpen(true)}
                  size="lg"
                  className="w-full min-h-[56px] sm:h-16 text-lg sm:text-xl font-semibold"
                  data-testid="button-save-money"
                >
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Save Money
                </Button>

                {/* Simplified Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="pt-4 pb-4 text-center">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">You Saved</p>
                      <p className="text-lg sm:text-xl font-bold" data-testid="text-saved-amount">
                        {isStablecoin 
                          ? `$${Number(formatUnits(savedAmount, tokenDecimals)).toFixed(2)}`
                          : `${Number(formatUnits(savedAmount, tokenDecimals)).toFixed(4)} ${selectedToken}`
                        }
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 pb-4 text-center">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total Now</p>
                      <p className="text-lg sm:text-xl font-bold" data-testid="text-total-amount">
                        {isStablecoin 
                          ? `$${Number(formatUnits(yourMoney, tokenDecimals)).toFixed(2)}`
                          : `${Number(formatUnits(yourMoney, tokenDecimals)).toFixed(4)} ${selectedToken}`
                        }
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Secondary Action - Withdraw */}
                <Button
                  onClick={() => setWithdrawOpen(true)}
                  variant="outline"
                  size="lg"
                  className="w-full min-h-[44px] sm:h-12"
                  data-testid="button-take-out"
                >
                  Take Out Money
                </Button>

                {/* Share Cast Button (Farcaster only) */}
                {isFarcaster && (
                  <ShareCastButton
                    stats={{
                      deposited: assetsForShares || BigInt(0),
                      profit: earned,
                      donationPct,
                      totalDonated: donated,
                      cause: "impact causes"
                    }}
                  />
                )}

                {/* Compact Donation Section */}
                {donationPct > 0 ? (
                  <Card className="border-pink-200 bg-pink-50/30 dark:bg-pink-950/10">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-pink-600" />
                          <div>
                            <p className="font-semibold text-sm sm:text-base">Sharing {donationPct}% of growth</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {isStablecoin 
                                ? `$${Number(formatUnits(donated, tokenDecimals)).toFixed(2)}`
                                : `${Number(formatUnits(donated, tokenDecimals)).toFixed(4)} ${selectedToken}`
                              } donated
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => setDonationOpen(true)}
                          variant="outline"
                          size="sm"
                          className="min-h-[44px]"
                          data-testid="button-share-growth"
                        >
                          Change
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Button
                    onClick={() => setDonationOpen(true)}
                    variant="outline"
                    className="w-full min-h-[44px] border-pink-200"
                    data-testid="button-share-growth"
                  >
                    <Heart className="w-4 h-4 mr-2 text-pink-600" />
                    Share Your Growth (Optional)
                  </Button>
                )}

                {/* Portfolio Overview - Collapsible */}
                <PortfolioOverview />

                {/* Additional Options - Compact */}
                <div className="space-y-2">
                  <YieldPreferenceSelector variant="simple" />

                  {/* Safety Info - Compact */}
                  <Card className="border-muted bg-muted/20">
                    <CardContent className="pt-3 pb-3">
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs sm:text-sm">
                          <p className="font-semibold mb-1">Protected & Flexible</p>
                          <p className="text-muted-foreground">Take out anytime • Blockchain secured</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Dialogs */}
      <DepositDialog
        open={depositOpen}
        onOpenChange={setDepositOpen}
        cusdBalance={tokenBalance?.value}
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
      <TokenSuggestionForm
        open={tokenSuggestOpen}
        onOpenChange={setTokenSuggestOpen}
        variant="simple"
      />
    </div>
  );
}
