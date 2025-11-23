import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { isAddress } from 'viem';
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
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BoostVaultABI, TOKEN_CONFIGS } from "@/lib/BoostVaultABI";
import { useToken } from "@/contexts/TokenContext";
import { Loader2, Heart } from "lucide-react";

interface DonationSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Vetted causes - these would come from a registry in production
const VETTED_CAUSES = [
  {
    address: '0x1234567890123456789012345678901234567890' as `0x${string}`,
    name: 'Education Fund Argentina',
    description: 'Supporting education initiatives in Buenos Aires',
  },
  {
    address: '0x2345678901234567890123456789012345678901' as `0x${string}`,
    name: 'Healthcare Nigeria',
    description: 'Providing medical supplies to rural clinics',
  },
  {
    address: '0x3456789012345678901234567890123456789012' as `0x${string}`,
    name: 'Food Security Venezuela',
    description: 'Emergency food distribution in Caracas',
  },
];

export function DonationSettingsDialog({ open, onOpenChange }: DonationSettingsDialogProps) {
  const [percentage, setPercentage] = useState([0]);
  const [selectedCause, setSelectedCause] = useState<string>('');
  const [customAddress, setCustomAddress] = useState('');
  const { address } = useAccount();
  const { toast } = useToast();
  const { selectedToken } = useToken();

  const tokenConfig = TOKEN_CONFIGS[selectedToken];
  const vaultAddress = tokenConfig.vaultAddress;

  // Read current donation settings
  const { data: currentPct } = useReadContract({
    address: vaultAddress,
    abi: BoostVaultABI,
    functionName: 'donationPctOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!vaultAddress,
    },
  });

  const { data: currentBeneficiary } = useReadContract({
    address: vaultAddress,
    abi: BoostVaultABI,
    functionName: 'beneficiaryOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!vaultAddress,
    },
  });

  // Initialize with current settings when dialog opens
  useEffect(() => {
    if (open && currentPct !== undefined) {
      setPercentage([Number(currentPct)]);
    }
    if (open && currentBeneficiary && currentBeneficiary !== '0x0000000000000000000000000000000000000000') {
      const vettedCause = VETTED_CAUSES.find(c => c.address.toLowerCase() === currentBeneficiary.toLowerCase());
      if (vettedCause) {
        setSelectedCause(vettedCause.address);
      } else {
        setSelectedCause('custom');
        setCustomAddress(currentBeneficiary);
      }
    }
  }, [open, currentPct, currentBeneficiary]);

  // Set donation transaction
  const {
    writeContract: setDonation,
    data: setDonationHash,
    isPending: isSetDonationPending,
  } = useWriteContract();

  const { isLoading: isSetDonationConfirming, isSuccess: isSetDonationSuccess } =
    useWaitForTransactionReceipt({
      hash: setDonationHash,
    });

  const beneficiaryAddress = selectedCause === 'custom' 
    ? customAddress 
    : selectedCause || VETTED_CAUSES[0].address;

  const isValidAddress = isAddress(beneficiaryAddress);
  const canSave = isValidAddress && percentage[0] >= 0 && percentage[0] <= 100;

  const handleSave = async () => {
    if (!vaultAddress || !canSave) return;

    try {
      setDonation({
        address: vaultAddress,
        abi: BoostVaultABI,
        functionName: 'setMyDonation',
        args: [percentage[0], beneficiaryAddress as `0x${string}`],
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update donation settings",
      });
    }
  };

  // Show success and close dialog after transaction succeeds
  useEffect(() => {
    if (isSetDonationSuccess && open) {
      toast({
        title: "Donation Settings Updated",
        description: percentage[0] > 0 
          ? `You'll donate ${percentage[0]}% of your profits` 
          : "Donations disabled",
      });
      onOpenChange(false);
    }
  }, [isSetDonationSuccess, open, percentage, toast, onOpenChange]);

  const isProcessing = isSetDonationPending || isSetDonationConfirming;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="dialog-donation-settings">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Donation Settings
          </DialogTitle>
          <DialogDescription>
            Choose how much of your profits to donate to vetted causes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Donation Percentage</Label>
              <span className="text-2xl font-bold font-mono">{percentage[0]}%</span>
            </div>
            <Slider
              value={percentage}
              onValueChange={setPercentage}
              max={100}
              step={1}
              disabled={isProcessing}
              data-testid="slider-donation-percentage"
            />
            <p className="text-sm text-muted-foreground">
              {percentage[0] === 0 
                ? "Donations disabled - you'll keep 100% of profits"
                : `You'll donate ${percentage[0]}% of your profits (only from gains, never principal)`}
            </p>
          </div>

          {percentage[0] > 0 && (
            <div className="space-y-2">
              <Label>Beneficiary</Label>
              <Select value={selectedCause} onValueChange={setSelectedCause}>
                <SelectTrigger data-testid="select-cause">
                  <SelectValue placeholder="Select a cause" />
                </SelectTrigger>
                <SelectContent>
                  {VETTED_CAUSES.map((cause) => (
                    <SelectItem key={cause.address} value={cause.address}>
                      <div>
                        <div className="font-medium">{cause.name}</div>
                        <div className="text-xs text-muted-foreground">{cause.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom Wallet Address</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedCause === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-address">Custom Beneficiary Address</Label>
              <Input
                id="custom-address"
                placeholder="0x..."
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                disabled={isProcessing}
                data-testid="input-custom-address"
              />
              {customAddress && !isValidAddress && (
                <p className="text-sm text-destructive">Invalid Ethereum address</p>
              )}
            </div>
          )}

          {isSetDonationConfirming && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Waiting for confirmation...
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={!canSave || isProcessing}
            data-testid="button-save-donation"
          >
            {isSetDonationPending || isSetDonationConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
