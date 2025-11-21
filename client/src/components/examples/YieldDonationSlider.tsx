import { YieldDonationSlider } from "../YieldDonationSlider";

export default function YieldDonationSliderExample() {
  return (
    <div className="p-6 max-w-md">
      <YieldDonationSlider
        causeName="Mujeres2000 (women microcredit)"
        value={50}
        onValueChange={(value) => console.log("Donation percent:", value)}
      />
    </div>
  );
}
