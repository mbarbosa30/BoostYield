import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Heart } from "lucide-react";

interface YieldDonationSliderProps {
  causeName?: string;
  value?: number;
  onValueChange?: (value: number) => void;
}

const presets = [0, 25, 50, 75, 100];

export function YieldDonationSlider({ 
  causeName = "Selected Cause",
  value,
  onValueChange 
}: YieldDonationSliderProps) {
  const [donationPercent, setDonationPercent] = useState(value || 0);

  const handleChange = (newValue: number[]) => {
    setDonationPercent(newValue[0]);
    onValueChange?.(newValue[0]);
  };

  const userPercent = 100 - donationPercent;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className={`h-5 w-5 transition-colors ${donationPercent > 0 ? 'text-impact-primary' : 'text-muted-foreground'}`} />
        <h4 className="font-semibold">Support a cause with my yield?</h4>
      </div>

      <div className="space-y-2">
        <Slider
          value={[donationPercent]}
          onValueChange={handleChange}
          max={100}
          step={1}
          className="py-4"
          data-testid="slider-donation"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleChange([preset])}
              className="hover-elevate active-elevate-2 px-2 py-1 rounded"
              data-testid={`button-preset-${preset}`}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">You keep:</span>
          <span className="font-semibold text-lg tabular-nums" data-testid="text-user-percent">
            {userPercent}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">{causeName} receives:</span>
          <span 
            className="font-semibold text-lg tabular-nums text-impact-primary" 
            data-testid="text-donation-percent"
          >
            {donationPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
