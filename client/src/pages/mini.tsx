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
import { BOOST_VAULT_ADDRESS, CUSD_ADDRESS, BoostVaultABI } from "@/lib/BoostVaultABI";
import { initializeFarcaster, getFarcasterContext, type FarcasterContext } from "@/lib/farcasterClient";

export default function MiniPage() {
  const { address, isConnected } = useAccount();
  const [farcasterContext, setFarcasterContext] = useState<FarcasterContext>(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);

  // Initialize Farcaster SDK
  useEffect(() => {
    const init = async () => {
      await initializeFarcaster();
      const context = await getFarcasterContext();
      setFarcasterContext(context);
    };
    init();
  }, []);

  // Read user's vault balance
  const { data: userShares } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!BOOST_VAULT_ADDRESS }
  });

  const { data: assetsForShares } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'previewRedeem',
    args: userShares ? [userShares] : undefined,
    query: { enabled: !!userShares && userShares > BigInt(0) }
  });

  const { data: userPrincipal } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'principalOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!BOOST_VAULT_ADDRESS }
  });

  const { data: userDonationPct } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'donationPctOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!BOOST_VAULT_ADDRESS }
  });

  const { data: totalAssets } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'totalAssets',
    query: { enabled: !!BOOST_VAULT_ADDRESS }
  });

  // Read user's cUSD balance
  const { data: cusdBalance } = useBalance({
    address: address,
    token: CUSD_ADDRESS,
    query: { enabled: !!address }
  });

  // Calculate stats
  const deposited = assetsForShares || BigInt(0);
  const principal = userPrincipal || BigInt(0);
  const profit = deposited > principal ? deposited - principal : BigInt(0);
  const donationPct = Number(userDonationPct || BigInt(0));
  const totalDonated = (profit * BigInt(donationPct)) / BigInt(100);

  // Estimate APY (simplified - in production, fetch from backend)
  const estimatedAPY = 11.2;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-optimized header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-bold">Boost</h1>
            {farcasterContext && (
              <p className="text-sm text-muted-foreground">
                @{farcasterContext.user?.username || 'anon'}
              </p>
            )}
          </div>
          <ConnectButton />
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
                <span className="text-sm text-muted-foreground">Est. APY</span>
                <span className="text-3xl font-bold text-emerald-600">
                  {estimatedAPY.toFixed(1)}%
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
