import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { composeCast, isFarcasterMiniapp } from "@/lib/farcasterClient";
import { useToast } from "@/hooks/use-toast";

interface ShareCastButtonProps {
  stats: {
    deposited: bigint;
    profit: bigint;
    donationPct: number;
    totalDonated: bigint;
    cause?: string;
  };
}

export function ShareCastButton({ stats }: ShareCastButtonProps) {
  const { toast } = useToast();
  const isMiniapp = isFarcasterMiniapp();

  if (!isMiniapp) {
    return null; // Only show in Farcaster miniapp
  }

  const handleShare = async () => {
    try {
      const depositedUSD = Number(stats.deposited) / 1e18;
      const profitUSD = Number(stats.profit) / 1e18;
      const apy = depositedUSD > 0 
        ? ((profitUSD / depositedUSD) * 100).toFixed(1)
        : '0';

      let castText = `I'm earning ${apy}% APY with Boost on Celo`;

      if (stats.donationPct > 0 && stats.cause) {
        castText += `\n\nDonating ${stats.donationPct}% of my yield to ${stats.cause}`;
      }

      castText += `\n\nJoin the yield revolution`;

      await composeCast({
        text: castText,
        embeds: [window.location.origin + '/mini']
      });
    } catch (error) {
      console.error('Failed to share cast:', error);
      toast({
        variant: "destructive",
        title: "Failed to share",
        description: "Could not open cast composer. Please try again."
      });
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="default"
      className="w-full"
      data-testid="button-share-cast"
    >
      <Share2 className="w-4 h-4 mr-2" />
      Share on Farcaster
    </Button>
  );
}
