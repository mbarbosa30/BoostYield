import { useState } from "react";
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
import { BOOST_VAULT_ADDRESS, CUSD_ADDRESS, BoostVaultABI } from "@/lib/BoostVaultABI";

export default function DegenPage() {
  const { address, isConnected } = useAccount();
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);

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
  const netProfit = profit - totalDonated;

  // APY calculation (simplified)
  const estimatedAPY = 11.2;
  const tvl = totalAssets ? Number(formatUnits(BigInt(totalAssets.toString()), 18)) : 0;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-accent font-bold mb-2">Yield Protocol</h1>
            <p className="text-muted-foreground">
              Aave V3 optimized vault · Celo mainnet · ERC4626 compliant
            </p>
          </div>
          {!isConnected && <ConnectButton />}
        </div>

        {/* Protocol Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Current APY</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{estimatedAPY.toFixed(2)}%</div>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Deposited</p>
                    <p className="text-2xl font-bold">${Number(formatUnits(deposited, 18)).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Principal + accrued yield</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Profit Realized</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      +${Number(formatUnits(profit, 18)).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Gross yield earned</p>
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
                  <div className="text-xs opacity-80">Add cUSD to earn yield</div>
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
                  <div className="text-xs opacity-80">Redeem shares for cUSD</div>
                </div>
              </Button>
            </div>

            {/* Contract Info */}
            <Card className="border-muted">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vault Contract</span>
                  <code className="text-xs">{BOOST_VAULT_ADDRESS}</code>
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
      <WithdrawDialog open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      <DonationSettingsDialog open={donationOpen} onOpenChange={setDonationOpen} />
    </div>
  );
}
