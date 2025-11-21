import { CauseCard } from "./CauseCard";
import { Button } from "@/components/ui/button";
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
    name: "Local UBI Collective",
    category: "Universal Basic Income",
    description: "Providing universal basic income to underserved communities, helping families meet basic needs with dignity.",
    totalYieldReceived: "$8,320",
    imageUrl: communityImage,
  },
  {
    id: 3,
    name: "Small Business Fund",
    category: "Economic Development",
    description: "Funding small businesses and entrepreneurs in emerging markets to create sustainable livelihoods.",
    totalYieldReceived: "$15,680",
    imageUrl: localBusinessImage,
  },
];

export function CauseBrowseSection() {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Support Community Causes
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose where your yield goes. Every dollar makes a difference.
          </p>
          <div className="mt-6 p-4 bg-impact-primary/10 rounded-lg inline-block">
            <p className="text-sm text-muted-foreground">Total yield donated across all causes</p>
            <p className="text-3xl font-bold text-impact-primary tabular-nums">$36,450</p>
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
        </div>
      </div>
    </section>
  );
}
