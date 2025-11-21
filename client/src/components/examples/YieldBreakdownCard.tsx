import { YieldBreakdownCard } from "../YieldBreakdownCard";

export default function YieldBreakdownCardExample() {
  return (
    <div className="p-6 max-w-md">
      <YieldBreakdownCard
        earnedYield={125.50}
        donatedYield={125.50}
        causeName="Mujeres2000"
      />
    </div>
  );
}
