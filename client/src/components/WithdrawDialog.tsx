import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BoostVaultABI, BOOST_VAULT_ADDRESS } from "@/lib/BoostVaultABI";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaultShares?: bigint;
  userPrincipal?: bigint;
  donationPct?: number;
}

export function WithdrawDialog({ 
  open, 
  onOpenChange, 
  vaultShares,
  userPrincipal,
  donationPct = 0,
}: WithdrawDialogProps) {
  const [shareAmount, setShareAmount] = useState('');
  const { address } = useAccount();
  const { toast } = useToast();

  // Debug logging
  useEffect(() => {
    if (open) {
      console.log('📤 WithdrawDialog opened with:', {
        vaultShares: vaultShares?.toString(),
        userPrincipal: userPrincipal?.toString(),
        donationPct,
        address
      });
    }
  }, [open, vaultShares, userPrincipal, donationPct, address]);

  const shareAmountBigInt = shareAmount ? parseUnits(shareAmount, 18) : BigInt(0);

  // Preview redemption
  const { data: previewAssets } = useReadContract({
    address: BOOST_VAULT_ADDRESS,
    abi: BoostVaultABI,
    functionName: 'previewRedeem',
    args: shareAmountBigInt > BigInt(0) ? [shareAmountBigInt] : undefined,
    query: {
      enabled: !!BOOST_VAULT_ADDRESS && shareAmountBigInt > BigInt(0),
    },
  });

  // Withdraw transaction
  const {
    writeContract: redeem,
    data: redeemHash,
    isPending: isRedeemPending,
    error: redeemError,
  } = useWriteContract();

  const { isLoading: isRedeemConfirming, isSuccess: isRedeemSuccess } =
    useWaitForTransactionReceipt({
      hash: redeemHash,
    });

  const hasShares = vaultShares !== undefined && shareAmountBigInt > BigInt(0) && shareAmountBigInt <= vaultShares;

  // Calculate profit and donation preview
  const assetsOut = previewAssets || BigInt(0);
  
  // Calculate pro-rata principal for the shares being redeemed
  const totalUserPrincipal = userPrincipal || BigInt(0);
  const totalUserShares = vaultShares || BigInt(1); // Avoid division by zero
  const principalForRedeemingShares = hasShares && totalUserShares > BigInt(0)
    ? (totalUserPrincipal * shareAmountBigInt) / totalUserShares
    : BigInt(0);
  
  const profit = assetsOut > principalForRedeemingShares ? assetsOut - principalForRedeemingShares : BigInt(0);
  const donationAmount = (profit * BigInt(donationPct)) / BigInt(100);
  const netReceived = assetsOut - donationAmount;

  const handleRedeem = async () => {
    if (!address || !BOOST_VAULT_ADDRESS || !shareAmountBigInt) {
      console.error('❌ Missing required data:', { address, BOOST_VAULT_ADDRESS, shareAmountBigInt: shareAmountBigInt.toString() });
      return;
    }

    console.log('🔄 Attempting redeem with:', {
      shares: shareAmountBigInt.toString(),
      receiver: address,
      owner: address
    });

    try {
      redeem({
        address: BOOST_VAULT_ADDRESS,
        abi: BoostVaultABI,
        functionName: 'redeem',
        args: [shareAmountBigInt, address, address],
      });
    } catch (error: any) {
      console.error('❌ Redeem error:', error);
      toast({
        variant: "destructive",
        title: "Withdrawal Failed",
        description: error.message || "Failed to withdraw from vault",
      });
    }
  };

  // Show success and close dialog after withdrawal succeeds
  useEffect(() => {
    if (isRedeemSuccess && open) {
      toast({
        title: "Withdrawal Successful",
        description: donationAmount > BigInt(0)
          ? `Withdrew ${parseFloat(formatUnits(netReceived, 18)).toFixed(2)} cUSD (donated ${parseFloat(formatUnits(donationAmount, 18)).toFixed(2)} cUSD)`
          : `Withdrew ${parseFloat(formatUnits(assetsOut, 18)).toFixed(2)} cUSD`,
      });
      setShareAmount('');
      onOpenChange(false);
    }
  }, [isRedeemSuccess, open, netReceived, donationAmount, assetsOut, toast, onOpenChange]);

  const isProcessing = isRedeemPending || isRedeemConfirming;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-withdraw">
        <DialogHeader>
          <DialogTitle>Withdraw from Vault</DialogTitle>
          <DialogDescription>
            Redeem your vault shares for cUSD
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="shares">Shares to Redeem</Label>
            <Input
              id="shares"
              type="number"
              placeholder="0.0000"
              value={shareAmount}
              onChange={(e) => setShareAmount(e.target.value)}
              disabled={isProcessing}
              data-testid="input-withdraw-shares"
            />
            {vaultShares !== undefined && (
              <p className="text-sm text-muted-foreground">
                Your shares: {parseFloat(formatUnits(vaultShares, 18)).toFixed(4)}
                {vaultShares > BigInt(0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => setShareAmount(formatUnits(vaultShares, 18))}
                    data-testid="button-max-shares"
                  >
                    Max
                  </Button>
                )}
              </p>
            )}
            {!hasShares && shareAmountBigInt > BigInt(0) && (
              <p className="text-sm text-destructive">Insufficient shares</p>
            )}
          </div>

          {shareAmountBigInt > BigInt(0) && previewAssets !== undefined && (
            <div className="space-y-2 rounded-lg border p-4">
              <h4 className="font-medium text-sm">Withdrawal Preview</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assets received:</span>
                  <span className="font-mono">{parseFloat(formatUnits(assetsOut, 18)).toFixed(2)} cUSD</span>
                </div>
                {profit > BigInt(0) && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profit earned:</span>
                      <span className="font-mono text-green-600">+{parseFloat(formatUnits(profit, 18)).toFixed(2)} cUSD</span>
                    </div>
                    {donationPct > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Donation ({donationPct}%):</span>
                        <span className="font-mono">-{parseFloat(formatUnits(donationAmount, 18)).toFixed(2)} cUSD</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>You receive:</span>
                  <span className="font-mono">{parseFloat(formatUnits(netReceived, 18)).toFixed(2)} cUSD</span>
                </div>
              </div>
            </div>
          )}

          {donationPct === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You haven't set up donation preferences yet. Consider setting aside a portion of your profits to support vetted causes.
              </AlertDescription>
            </Alert>
          )}

          {isRedeemConfirming && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Waiting for withdrawal confirmation...
            </div>
          )}

          {redeemError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {redeemError.message || 'Transaction failed. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleRedeem}
            disabled={!hasShares || isProcessing}
            data-testid="button-confirm-withdraw"
          >
            {isRedeemPending || isRedeemConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Withdrawing...
              </>
            ) : (
              'Withdraw'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
