import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useAccount, useReadContract, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shield, DollarSign, Heart, TrendingUp, CheckCircle } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DepositDialog } from "@/components/DepositDialog";
import { WithdrawDialog } from "@/components/WithdrawDialog";
import { DonationSettingsDialog } from "@/components/DonationSettingsDialog";
import { BOOST_VAULT_ADDRESS, CUSD_ADDRESS, BoostVaultABI } from "@/lib/BoostVaultABI";

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

function useAaveAPY() {
  const { data: reserveData } = useReadContract({
    address: AAVE_POOL_ADDRESS,
    abi: POOL_ABI,
    functionName: 'getReserveData',
    args: [CUSD_ADDRESS],
    query: { refetchInterval: 60000 }
  });
  
  if (!reserveData) return 0;
  
  const liquidityRateRay = reserveData.currentLiquidityRate;
  const apyDecimal = parseFloat(formatUnits(liquidityRateRay, 27));
  return apyDecimal * 100; // Convert to percentage
}

function useInterpolatedEarnings(baseEarnedAmount: bigint, principalAmount: bigint, lastUpdateTime: number, decimals = 18) {
  const [displayValue, setDisplayValue] = useState('0.00');
  const precisionRef = useRef<number>(2);
  const velocityRef = useRef<number>(0);
  
  const { data: reserveData } = useReadContract({
    address: AAVE_POOL_ADDRESS,
    abi: POOL_ABI,
    functionName: 'getReserveData',
    args: [CUSD_ADDRESS],
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
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Read user's vault balance
  const { data: userShares, isLoading: isLoadingShares } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address && !!BOOST_VAULT_ADDRESS,
      refetchInterval: 5000 // Refetch every 5 seconds
    }
  });

  const { data: assetsForShares, dataUpdatedAt } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
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
      console.log('📊 Formatted:', formatUnits(assetsForShares, 18));
      console.log('📊 Updated at:', new Date(dataUpdatedAt).toISOString());
    }
  }, [assetsForShares, dataUpdatedAt]);

  const { data: userPrincipal } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'principalOf',
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address && !!BOOST_VAULT_ADDRESS,
      refetchInterval: POLL_INTERVAL_MS
    }
  });

  const { data: userDonationPct } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'donationPctOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!BOOST_VAULT_ADDRESS }
  });

  const { data: cusdBalance } = useBalance({
    address: address,
    token: CUSD_ADDRESS,
    query: { enabled: !!address }
  });

  // Calculate stats
  const savedAmount = userPrincipal || BigInt(0);
  const totalAmount = assetsForShares || BigInt(0);
  const earned = totalAmount > savedAmount ? totalAmount - savedAmount : BigInt(0);
  const donationPct = Number(userDonationPct || BigInt(0));
  const donated = (earned * BigInt(donationPct)) / BigInt(100);
  const yourMoney = totalAmount - donated;
  
  const formattedEarned = useInterpolatedEarnings(earned, savedAmount, lastUpdate, 18);
  const currentAPY = useAaveAPY();

  // Convert to local display (simplified - in production would use exchange rates)
  const earningRate = currentAPY > 0 ? `${currentAPY.toFixed(2)}% per year` : "loading...";

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-background dark:from-background dark:to-background">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-lg border-b">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 px-3 py-2 rounded-md">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-lg font-accent font-semibold">Boost</span>
            </div>
          </Link>
          <ConnectButton />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 pt-8 pb-12 space-y-6">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-accent font-bold mb-3">Grow Your Money</h1>
          <p className="text-lg text-muted-foreground">
            Save safely and earn {earningRate}
          </p>
        </div>

        {/* How It Works - Simple Steps */}
        {!isConnected && (
          <Card className="border-emerald-200 bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="text-2xl">How It Works</CardTitle>
              <CardDescription className="text-base">Three simple steps to start growing your savings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Connect Your Wallet</h3>
                  <p className="text-sm text-muted-foreground">
                    Use MetaMask or Valora - we keep your money safe
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Save Your Money</h3>
                  <p className="text-sm text-muted-foreground">
                    Put in as much or as little as you want - start with any amount
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Watch It Grow</h3>
                  <p className="text-sm text-muted-foreground">
                    Your money grows automatically - take it out anytime you need it
                  </p>
                </div>
              </div>

              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    onClick={openConnectModal}
                    size="lg"
                    className="w-full h-14 text-lg"
                    data-testid="button-connect-wallet"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Connect Wallet to Start
                  </Button>
                )}
              </ConnectButton.Custom>
            </CardContent>
          </Card>
        )}

        {isConnected && (
          <>
            {/* Your Money Summary */}
            <Card className="border-emerald-200">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20">
                <CardTitle className="text-2xl">Your Money</CardTitle>
                <CardDescription className="text-base">See how much you have and how much you earned</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {isLoadingShares ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-muted-foreground">Loading your money...</div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <DollarSign className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">You Saved</p>
                        <p className="text-2xl font-bold">${Number(formatUnits(savedAmount, 18)).toFixed(2)}</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/20">
                        <TrendingUp className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                        <p className="text-sm text-muted-foreground mb-1">
                          You Earned
                        </p>
                        <p className="text-xl font-bold text-emerald-600 font-mono">
                          +${formattedEarned}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-muted/50">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">Total Now</p>
                        <p className="text-2xl font-bold">${Number(formatUnits(yourMoney, 18)).toFixed(2)}</p>
                      </div>
                    </div>

                    {Number(formatUnits(savedAmount, 18)) > 0 && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Your money is growing</p>
                        <Progress value={Math.min((Number(formatUnits(earned, 18)) / Number(formatUnits(savedAmount, 18))) * 100, 100)} className="h-3" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Earning {earningRate} - much better than banks
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Share Your Growth - Donation Feature */}
            <Card className="border-pink-200 bg-gradient-to-br from-pink-50/50 to-transparent dark:from-pink-950/10">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-6 h-6 text-pink-600" />
                  <CardTitle className="text-2xl">Share Your Growth</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Help others while your money grows. Give part of what you earn - not your savings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-white dark:bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg">
                        {donationPct === 0 ? "Not sharing yet" : `Sharing ${donationPct}% of growth`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {donationPct === 0 
                          ? "Start sharing to make an impact"
                          : "Your earnings help families in need"}
                      </p>
                    </div>
                    <Button
                      onClick={() => setDonationOpen(true)}
                      size="lg"
                      variant={donationPct > 0 ? "outline" : "default"}
                      data-testid="button-share-growth"
                    >
                      {donationPct > 0 ? "Change Amount" : "Start Sharing"}
                    </Button>
                  </div>

                  {donationPct > 0 && (
                    <div className="pt-3 border-t space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">You earned</span>
                        <span className="font-medium">${Number(formatUnits(earned, 18)).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">You shared</span>
                        <span className="font-medium text-pink-600">
                          ${Number(formatUnits(donated, 18)).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-semibold">
                        <span>You keep</span>
                        <span className="text-emerald-600">
                          ${Number(formatUnits(earned - donated, 18)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-pink-50 dark:bg-pink-950/10 text-sm">
                  <Heart className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">No-loss giving:</strong> You only share from what you earn, never from your savings. 
                    Your money keeps growing while helping others.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setDepositOpen(true)}
                size="lg"
                className="h-16 text-lg"
                data-testid="button-save-money"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Save Money
              </Button>
              <Button
                onClick={() => setWithdrawOpen(true)}
                variant="outline"
                size="lg"
                className="h-16 text-lg"
                data-testid="button-take-out"
              >
                Take Out Money
              </Button>
            </div>

            {/* Safety Info */}
            <Card className="border-muted bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Your money is protected</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Take out your money anytime</li>
                      <li>• Secured by blockchain technology</li>
                      <li>• Used by thousands of people worldwide</li>
                    </ul>
                  </div>
                </div>
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
