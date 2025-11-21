import { CauseCard } from "./CauseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Globe } from "lucide-react";
import womenCoopImage from "@assets/generated_images/women's_cooperative_cause_card.png";
import communityImage from "@assets/generated_images/community_ubi_cause_card.png";
import localBusinessImage from "@assets/generated_images/local_business_cause_card.png";

//todo: remove mock functionality
const causes = [
  {
    id: 1,
    name: "Mujeres2000",
    category: "Women Empowerment",
    description: "Supporting women's microcredit cooperatives in Latin America to build sustainable businesses and economic independence.",
    totalYieldReceived: "$12,450",
    imageUrl: womenCoopImage,
  },
  {
    id: 2,
    name: "Clean Water Lagos",
    category: "Public Infrastructure",
    description: "Ahmed's choice. Funding clean water projects in Lagos, Nigeria. Transparent on-chain tracking with tax receipts.",
    totalYieldReceived: "$8,320",
    imageUrl: communityImage,
  },
  {
    id: 3,
    name: "Buenos Aires Schools",
    category: "Education",
    description: "Maria's choice. Supporting local schools in Buenos Aires, Argentina. Building resilience through education.",
    totalYieldReceived: "$15,680",
    imageUrl: localBusinessImage,
  },
];

export function CauseBrowseSection() {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-impact-primary/10 text-impact-primary border-impact-primary/20">
            Impact Flywheel
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-accent">
            Turn Earning Into a Force for Good
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Donate 0-100% of your yield. Global leaderboard. Transparent on-chain tracking. You don't just earn—you build communities.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="p-6 bg-impact-primary/10 rounded-lg">
              <Globe className="h-8 w-8 mx-auto mb-3 text-impact-primary" />
              <p className="text-sm text-muted-foreground mb-1">Total yield donated</p>
              <p className="text-3xl font-bold text-impact-primary tabular-nums">$436,450</p>
            </div>
            <div className="p-6 bg-impact-primary/10 rounded-lg">
              <Trophy className="h-8 w-8 mx-auto mb-3 text-impact-primary" />
              <p className="text-sm text-muted-foreground mb-1">Active community builders</p>
              <p className="text-3xl font-bold text-impact-primary tabular-nums">2,847</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {causes.map((cause) => (
            <CauseCard
              key={cause.id}
              {...cause}
              onSupport={() => console.log(`Support ${cause.name}`)}
            />
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            variant="outline"
            data-testid="button-browse-all-causes"
          >
            Browse All Causes
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Tax receipts provided • Fully transparent on-chain • Education, water, public goods & more
          </p>
        </div>
      </div>
    </section>
  );
}
