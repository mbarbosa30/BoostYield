import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits, erc20Abi } from 'viem';
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
import { BoostVaultABI, BOOST_VAULT_ADDRESS, CUSD_ADDRESS } from "@/lib/BoostVaultABI";
import { Loader2, CheckCircle2 } from "lucide-react";

interface DepositDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cusdBalance?: bigint;
}

export function DepositDialog({ open, onOpenChange, cusdBalance }: DepositDialogProps) {
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const { toast } = useToast();

  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CUSD_ADDRESS,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address && BOOST_VAULT_ADDRESS ? [address, BOOST_VAULT_ADDRESS] : undefined,
    query: {
      enabled: !!address && !!BOOST_VAULT_ADDRESS,
    },
  });

  // Approve transaction
  const {
    writeContract: approve,
    data: approveHash,
    isPending: isApprovePending,
  } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  // Deposit transaction
  const {
    writeContract: deposit,
    data: depositHash,
    isPending: isDepositPending,
    error: depositError,
  } = useWriteContract();

  // Log deposit errors
  useEffect(() => {
    if (depositError) {
      console.error('Deposit transaction error:', depositError);
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: depositError.message || "Failed to initiate deposit transaction",
      });
    }
  }, [depositError, toast]);

  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } =
    useWaitForTransactionReceipt({
      hash: depositHash,
    });

  const amountBigInt = amount ? parseUnits(amount, 18) : BigInt(0);
  const needsApproval = allowance !== undefined && amountBigInt > allowance;
  const hasBalance = cusdBalance !== undefined && amountBigInt > BigInt(0) && amountBigInt <= cusdBalance;

  // Auto-refetch allowance after approval succeeds
  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  // Show success and close dialog after deposit succeeds
  useEffect(() => {
    if (isDepositSuccess && open) {
      toast({
        title: "Deposit Successful",
        description: `Successfully deposited ${amount} cUSD to the vault`,
      });
      setAmount('');
      onOpenChange(false);
    }
  }, [isDepositSuccess, open, amount, toast, onOpenChange]);

  const handleApprove = async () => {
    if (!BOOST_VAULT_ADDRESS || !amountBigInt) return;

    try {
      approve({
        address: CUSD_ADDRESS,
        abi: erc20Abi,
        functionName: 'approve',
        args: [BOOST_VAULT_ADDRESS, amountBigInt],
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: error.message || "Failed to approve cUSD",
      });
    }
  };

  const handleDeposit = async () => {
    console.log('handleDeposit called', {
      address,
      BOOST_VAULT_ADDRESS,
      amountBigInt: amountBigInt.toString(),
      hasBalance,
      needsApproval,
      isApproveSuccess,
      isDepositPending,
      isProcessing
    });

    // Prevent multiple simultaneous calls
    if (isDepositPending || isDepositConfirming) {
      console.log('Deposit already in progress, ignoring click');
      return;
    }

    if (!address || !BOOST_VAULT_ADDRESS || !amountBigInt) {
      console.log('handleDeposit: missing required params');
      return;
    }

    try {
      console.log('Calling deposit with args:', [amountBigInt.toString(), address]);
      const result = deposit({
        address: BOOST_VAULT_ADDRESS,
        abi: BoostVaultABI,
        functionName: 'deposit',
        args: [amountBigInt, address],
      });
      console.log('deposit() returned:', result);
    } catch (error: any) {
      console.error('Deposit error:', error);
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: error.message || "Failed to deposit cUSD",
      });
    }
  };

  const isProcessing = isApprovePending || isApproveConfirming || isDepositPending || isDepositConfirming;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-deposit">
        <DialogHeader>
          <DialogTitle>Deposit cUSD</DialogTitle>
          <DialogDescription>
            Deposit cUSD to earn 8-12% APY from Aave V3 lending
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (cUSD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isProcessing}
              data-testid="input-deposit-amount"
            />
            {cusdBalance !== undefined && (
              <p className="text-sm text-muted-foreground">
                Available: {parseFloat(formatUnits(cusdBalance, 18)).toFixed(2)} cUSD
                {cusdBalance > BigInt(0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-2"
                    onClick={() => setAmount(formatUnits(cusdBalance, 18))}
                    data-testid="button-max"
                  >
                    Max
                  </Button>
                )}
              </p>
            )}
            {!hasBalance && amountBigInt > BigInt(0) && (
              <p className="text-sm text-destructive">Insufficient balance</p>
            )}
          </div>

          {isApproveConfirming && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Waiting for approval confirmation...
            </div>
          )}

          {isApproveSuccess && !isDepositSuccess && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Approval confirmed! Ready to deposit.
            </div>
          )}

          {isDepositConfirming && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Waiting for deposit confirmation...
            </div>
          )}
        </div>

        <DialogFooter>
          {needsApproval && !isApproveSuccess ? (
            <Button
              onClick={handleApprove}
              disabled={!hasBalance || isProcessing}
              data-testid="button-approve"
            >
              {isApprovePending || isApproveConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve cUSD'
              )}
            </Button>
          ) : (
            <Button
              onClick={handleDeposit}
              disabled={!hasBalance || isProcessing || (needsApproval && !isApproveSuccess)}
              data-testid="button-confirm-deposit"
            >
              {isDepositPending || isDepositConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Depositing...
                </>
              ) : (
                'Deposit'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
