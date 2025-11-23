import { useState } from "react";
import { useAccount } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const tokenSuggestionSchema = z.object({
  tokenName: z.string().min(1, "Token name is required"),
  tokenSymbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long"),
  contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Celo address"),
  projectDescription: z.string().min(20, "Please provide at least 20 characters"),
  uniswapPoolInfo: z.string().optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal('')),
  contactTelegram: z.string().optional(),
});

type TokenSuggestionFormData = z.infer<typeof tokenSuggestionSchema>;

interface TokenSuggestionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: 'simple' | 'degen';
}

export function TokenSuggestionForm({ open, onOpenChange, variant = 'simple' }: TokenSuggestionFormProps) {
  const { address } = useAccount();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<TokenSuggestionFormData>({
    resolver: zodResolver(tokenSuggestionSchema),
    defaultValues: {
      tokenName: '',
      tokenSymbol: '',
      contractAddress: '',
      projectDescription: '',
      uniswapPoolInfo: '',
      contactEmail: '',
      contactTelegram: '',
    },
  });

  const submitSuggestion = useMutation({
    mutationFn: async (data: TokenSuggestionFormData) => {
      if (!address) throw new Error('Wallet not connected');

      return apiRequest('POST', '/api/token-suggestion', {
        ...data,
        submitterAddress: address,
        chainId: '42220',
        status: 'pending',
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Suggestion submitted!",
        description: variant === 'simple'
          ? "Thanks for your suggestion! We'll review it and get back to you."
          : "Your token has been submitted for review. Track status in your dashboard.",
      });
      
      setTimeout(() => {
        onOpenChange(false);
        setSubmitted(false);
        form.reset();
      }, 2000);
    },
    onError: (error) => {
      console.error('Failed to submit suggestion:', error);
      toast({
        title: "Submission failed",
        description: "Could not submit your suggestion. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TokenSuggestionFormData) => {
    submitSuggestion.mutate(data);
  };

  if (!address) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Please connect your wallet to suggest a token.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <DialogTitle>Submission Received!</DialogTitle>
              <DialogDescription className="text-center">
                {variant === 'simple'
                  ? "We'll review your token suggestion and reach out if we have questions."
                  : "Your token is now in the review queue. We'll notify you of the status."}
              </DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {variant === 'simple' ? 'Suggest a New Token' : 'Submit Token for Yield Conversion'}
          </DialogTitle>
          <DialogDescription>
            {variant === 'simple'
              ? 'Help us add more ways to earn! Tell us about a token you\'d like to receive your earnings in.'
              : 'Propose a token to be whitelisted as a yield output option. Token sponsors can offer bonus APY.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tokenName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mento Dollar" {...field} data-testid="input-token-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tokenSymbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., MENTO" {...field} data-testid="input-token-symbol" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Address (Celo Mainnet)</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} data-testid="input-contract-address" />
                  </FormControl>
                  <FormDescription>
                    The Celo mainnet address of the token contract
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why this token?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={variant === 'simple'
                        ? "Tell us why this token matters and how it helps people..."
                        : "Describe your project, use case, and value proposition for Boost users..."}
                      className="min-h-24"
                      {...field}
                      data-testid="textarea-project-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="uniswapPoolInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uniswap Pool Info (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pool address or link to liquidity info"
                      {...field}
                      data-testid="input-uniswap-pool"
                    />
                  </FormControl>
                  <FormDescription>
                    Help us verify there's sufficient liquidity for swaps
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} data-testid="input-contact-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactTelegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="@username" {...field} data-testid="input-contact-telegram" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitSuggestion.isPending}
                data-testid="button-cancel-suggestion"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitSuggestion.isPending}
                data-testid="button-submit-suggestion"
              >
                {submitSuggestion.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Suggestion
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
