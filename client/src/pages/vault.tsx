import { useAccount, useReadContract, useBalance } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Wallet, Shield } from "lucide-react";
import { Link } from "wouter";
import { BoostVaultABI, BOOST_VAULT_ADDRESS, CUSD_ADDRESS } from "@/lib/BoostVaultABI";
import { formatUnits } from 'viem';

export default function VaultPage() {
  const { address, isConnected } = useAccount();

  const vaultEnabled = isConnected && !!address && !!BOOST_VAULT_ADDRESS;

  // Read cUSD balance
  const { data: cusdBalance, isLoading: isLoadingBalance } = useBalance({
    address: address,
    token: CUSD_ADDRESS,
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Read vault shares
  const { data: vaultShares, isLoading: isLoadingShares } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: vaultEnabled,
    },
  });

  // Read user principal
  const { data: userPrincipal, isLoading: isLoadingPrincipal } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'principalOf',
    args: address ? [address] : undefined,
    query: {
      enabled: vaultEnabled,
    },
  });

  // Read total vault assets
  const { data: totalAssets, isLoading: isLoadingTotal } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'totalAssets',
    query: {
      enabled: !!BOOST_VAULT_ADDRESS,
    },
  });

  // Read donation settings
  const { data: donationPct, isLoading: isLoadingDonation } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'donationPctOf',
    args: address ? [address] : undefined,
    query: {
      enabled: vaultEnabled,
    },
  });

  const isLoading = isLoadingBalance || isLoadingShares || isLoadingPrincipal || isLoadingTotal || isLoadingDonation;

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to access the Inflation Shield vault.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/" data-testid="link-back-home">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!BOOST_VAULT_ADDRESS) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Vault Not Deployed</CardTitle>
            <CardDescription>
              The Boost vault contract has not been deployed yet. Please check back soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/" data-testid="link-back-home">
              <Button variant="outline" className="w-full gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedCusdBalance = isLoadingBalance ? '...' : 
    cusdBalance ? parseFloat(formatUnits(cusdBalance.value, cusdBalance.decimals)).toFixed(2) : '0.00';
  const formattedShares = isLoadingShares ? '...' :
    vaultShares ? parseFloat(formatUnits(vaultShares, 18)).toFixed(4) : '0.0000';
  const formattedPrincipal = isLoadingPrincipal ? '...' :
    userPrincipal ? parseFloat(formatUnits(userPrincipal, 18)).toFixed(2) : '0.00';
  const formattedTotalAssets = isLoadingTotal ? '...' :
    totalAssets ? parseFloat(formatUnits(totalAssets, 18)).toFixed(2) : '0.00';
  const currentDonationPct = isLoadingDonation ? '...' : (donationPct || 0);

  return (
    <div className="min-h-screen bg-muted/20 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/" data-testid="link-back-home">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold font-accent">Inflation Shield Vault</h1>
          </div>
          <p className="text-muted-foreground">
            Earn stable yields while protecting your savings from inflation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card data-testid="card-wallet-info">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Wallet</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono" data-testid="text-wallet-address">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                cUSD Balance: {formattedCusdBalance}
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-vault-apy">
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current APY</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-current-apy">8-12%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Historically earning from Aave V3
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6" data-testid="card-vault-position">
          <CardHeader>
            <CardTitle>Your Position</CardTitle>
            <CardDescription>
              Track your deposits, earnings, and donation settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Vault Shares</p>
                <p className="text-2xl font-bold" data-testid="text-vault-shares">{formattedShares}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Principal Deposited</p>
                <p className="text-2xl font-bold" data-testid="text-principal">{formattedPrincipal} cUSD</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Donation Setting</p>
                <p className="text-2xl font-bold" data-testid="text-donation-pct">{currentDonationPct}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-vault-stats">
          <CardHeader>
            <CardTitle>Vault Statistics</CardTitle>
            <CardDescription>
              Total assets under management in the Inflation Shield vault
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-muted-foreground">Total Vault Assets</p>
              <p className="text-3xl font-bold" data-testid="text-total-assets">{formattedTotalAssets} cUSD</p>
              <Badge className="mt-2">Powered by Aave V3</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-4">
          <Button size="lg" className="flex-1" data-testid="button-deposit">
            Deposit cUSD
          </Button>
          <Button size="lg" variant="outline" className="flex-1" data-testid="button-withdraw">
            Withdraw
          </Button>
        </div>
      </div>
    </div>
  );
}
