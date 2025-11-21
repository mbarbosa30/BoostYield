import { CauseCard } from "../CauseCard";
import causeImage from "@assets/generated_images/women's_cooperative_cause_card.png";

export default function CauseCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <CauseCard
        name="Mujeres2000"
        category="Women Empowerment"
        description="Supporting women's microcredit cooperatives in Latin America to build sustainable businesses."
        totalYieldReceived="$12,450"
        imageUrl={causeImage}
        onSupport={() => console.log("Support cause clicked")}
      />
    </div>
  );
}
