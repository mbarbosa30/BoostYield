import { useEffect, useState } from "react";
import { useAccount, useReadContract, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, TrendingUp, Heart, Wallet } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { DepositDialog } from "@/components/DepositDialog";
import { WithdrawDialog } from "@/components/WithdrawDialog";
import { DonationSettingsDialog } from "@/components/DonationSettingsDialog";
import { ShareCastButton } from "@/components/ShareCastButton";
import { TOKEN_CONFIGS, BoostVaultABI } from "@/lib/BoostVaultABI";
import { useToken } from "@/contexts/TokenContext";
import { TokenSelector } from "@/components/TokenSelector";
import { initializeFarcaster, getFarcasterContext, type FarcasterContext } from "@/lib/farcasterClient";

const AAVE_POOL_ADDRESS = '0x3E59A31363E2ad014dcbc521c4a0d5757d9f3402' as const;

const POOL_ABI = [
  {
    inputs: [{ name: 'asset', type: 'address' }],
    name: 'getReserveData',
    outputs: [{
      components: [
        { name: 'configuration', type: 'uint256' },
        { name: 'liquidityIndex', type: 'uint128' },
        { name: 'currentLiquidityRate', type: 'uint128' },
        { name: 'variableBorrowIndex', type: 'uint128' },
        { name: 'currentVariableBorrowRate', type: 'uint128' },
        { name: 'currentStableBorrowRate', type: 'uint128' },
        { name: 'lastUpdateTimestamp', type: 'uint40' },
        { name: 'id', type: 'uint16' },
        { name: 'aTokenAddress', type: 'address' },
        { name: 'stableDebtTokenAddress', type: 'address' },
        { name: 'variableDebtTokenAddress', type: 'address' },
        { name: 'interestRateStrategyAddress', type: 'address' },
        { name: 'accruedToTreasury', type: 'uint128' },
        { name: 'unbacked', type: 'uint128' },
        { name: 'isolationModeTotalDebt', type: 'uint128' }
      ],
      name: 'ReserveData',
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
  return apyDecimal * 100;
}

export default function MiniPage() {
  const { address, isConnected } = useAccount();
  const [farcasterContext, setFarcasterContext] = useState<FarcasterContext>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const { selectedToken } = useToken();

  const tokenConfig = TOKEN_CONFIGS[selectedToken];
  const vaultAddress = tokenConfig.vaultAddress;
  const tokenAddress = tokenConfig.address;
  const tokenDecimals = tokenConfig.decimals;

  // Initialize Farcaster SDK and attempt wallet connection
  // Note: Farcaster's native wallet provider supports Ethereum/Base but not Celo
  // Users must connect using Celo-compatible wallets (Valora, MetaMask, etc.) via RainbowKit
  useEffect(() => {
    const init = async () => {
      await initializeFarcaster();
      const context = await getFarcasterContext();
      setFarcasterContext(context);
      
      // Log Farcaster context for debugging
      if (context) {
        console.log('Farcaster miniapp context:', {
          user: context.user?.username,
          fid: context.user?.fid
        });
      }
    };
    init();
  }, []);

  // Read user's vault balance
  const { data: userShares } = useReadContract({
    address: vaultAddress,
    abi: BoostVaultABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!vaultAddress }
  });

  const { data: assetsForShares } = useReadContract({
    address: vaultAddress,
    abi: BoostVaultABI,
    functionName: 'previewRedeem',
    args: userShares ? [userShares] : undefined,
    query: { enabled: !!userShares && userShares > BigInt(0) }
  });

  const { data: userPrincipal } = useReadContract({
    address: vaultAddress,
    abi: BoostVaultABI,
    functionName: 'principalOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!vaultAddress }
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

  // Read user's cUSD balance
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

  const currentAPY = useAaveAPY(tokenAddress);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-optimized header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Relay Boost</h1>
              {farcasterContext && (
                <p className="text-sm text-muted-foreground">
                  @{farcasterContext.user?.username || 'anon'}
                </p>
              )}
            </div>
            <ConnectButton />
          </div>
          <TokenSelector />
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Hero Card */}
        <Card className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border-emerald-500/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-lg">Inflation Shield</CardTitle>
            </div>
            <CardDescription>
              Safe stablecoin yield on Celo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Current APY</span>
                <span className="text-3xl font-bold text-emerald-600">
                  {currentAPY > 0 ? `${currentAPY.toFixed(2)}%` : 'Loading...'}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted-foreground">Total Value Locked</span>
                <span className="text-lg font-semibold">
                  ${totalAssets ? Number(formatUnits(BigInt(totalAssets.toString()), 18)).toLocaleString() : '0'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {!isConnected ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Connect Your Wallet
              </CardTitle>
              <CardDescription>
                Connect to start earning yield on Celo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <Button
                    onClick={openConnectModal}
                    className="w-full"
                    size="lg"
                    data-testid="button-connect-wallet"
                  >
                    Connect Wallet
                  </Button>
                )}
              </ConnectButton.Custom>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Your Position */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposited</span>
                  <span className="font-semibold">
                    ${Number(formatUnits(deposited, 18)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profit</span>
                  <span className="font-semibold text-emerald-600">
                    +${Number(formatUnits(profit, 18)).toFixed(2)}
                  </span>
                </div>
                {donationPct > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Donated</span>
                    <span className="font-semibold text-pink-600">
                      ${Number(formatUnits(BigInt(totalDonated.toString()), 18)).toFixed(2)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setDepositOpen(true)}
                className="w-full"
                size="lg"
                data-testid="button-open-deposit"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Deposit
              </Button>
              <Button
                onClick={() => setWithdrawOpen(true)}
                variant="outline"
                className="w-full"
                size="lg"
                data-testid="button-open-withdraw"
              >
                Withdraw
              </Button>
            </div>

            <Button
              onClick={() => setDonationOpen(true)}
              variant="outline"
              className="w-full"
              data-testid="button-open-donation"
            >
              <Heart className="w-4 h-4 mr-2" />
              Set Donation ({donationPct}%)
            </Button>

            {/* Share Cast Button (only visible in Farcaster) */}
            <ShareCastButton
              stats={{
                deposited,
                profit,
                donationPct,
                totalDonated,
                cause: "impact causes"
              }}
            />
          </>
        )}

        {/* Risk Disclosure */}
        <Card className="border-muted">
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground text-center">
              Yield comes from Aave V3 lending on Celo. Not FDIC insured. 
              Past performance doesn't predict future returns.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <DepositDialog
        open={depositOpen}
        onOpenChange={setDepositOpen}
        cusdBalance={cusdBalance?.value}
      />
      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      <DonationSettingsDialog open={donationOpen} onOpenChange={setDonationOpen} />
    </div>
  );
}
