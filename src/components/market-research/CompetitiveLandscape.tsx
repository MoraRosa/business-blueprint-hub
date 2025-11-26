import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Trophy } from "lucide-react";
import { Competitor } from "../MarketResearch";

interface CompetitiveLandscapeProps {
  competitors: Competitor[];
  onChange: (competitors: Competitor[]) => void;
}

const CompetitiveLandscape = ({ competitors, onChange }: CompetitiveLandscapeProps) => {
  const addCompetitor = () => {
    const newCompetitor: Competitor = {
      id: Date.now().toString(),
      name: "",
      foundingYear: "",
      hq: "",
      fundingRevenue: "",
      coreOffer: "",
      pricingModel: "",
      differentiators: "",
      gtmMotion: "",
      notableCustomers: "",
    };
    onChange([...competitors, newCompetitor]);
  };

  const removeCompetitor = (id: string) => {
    onChange(competitors.filter((c) => c.id !== id));
  };

  const updateCompetitor = (id: string, field: keyof Competitor, value: string) => {
    onChange(
      competitors.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  return (
    <AccordionItem value="competitive-landscape" className="border rounded-lg px-4 bg-card">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-base md:text-lg">Competitive Landscape</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-normal">
              Top 10 competitors (incumbents + upstarts)
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-6">
        <div className="space-y-4">
          {competitors.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">No competitors added yet</p>
              <Button onClick={addCompetitor} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add First Competitor
              </Button>
            </div>
          ) : (
            <>
              {competitors.map((competitor, index) => (
                <Card key={competitor.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Competitor {index + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCompetitor(competitor.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Company Name</label>
                        <Input
                          placeholder="e.g., Acme Corp"
                          value={competitor.name}
                          onChange={(e) => updateCompetitor(competitor.id, "name", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Founding Year</label>
                        <Input
                          placeholder="e.g., 2015"
                          value={competitor.foundingYear}
                          onChange={(e) => updateCompetitor(competitor.id, "foundingYear", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Headquarters</label>
                        <Input
                          placeholder="e.g., San Francisco, CA"
                          value={competitor.hq}
                          onChange={(e) => updateCompetitor(competitor.id, "hq", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Funding / Revenue
                        </label>
                        <Input
                          placeholder="e.g., $50M Series B / $10M ARR"
                          value={competitor.fundingRevenue}
                          onChange={(e) => updateCompetitor(competitor.id, "fundingRevenue", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Core Offer</label>
                      <Textarea
                        placeholder="What do they sell? What's their main value proposition?"
                        value={competitor.coreOffer}
                        onChange={(e) => updateCompetitor(competitor.id, "coreOffer", e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Pricing Model</label>
                      <Input
                        placeholder="e.g., $99/mo per user, freemium"
                        value={competitor.pricingModel}
                        onChange={(e) => updateCompetitor(competitor.id, "pricingModel", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Differentiators</label>
                      <Textarea
                        placeholder="What makes them unique? What are their strengths?"
                        value={competitor.differentiators}
                        onChange={(e) => updateCompetitor(competitor.id, "differentiators", e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Go-to-Market Motion
                      </label>
                      <Input
                        placeholder="e.g., Product-led growth, Enterprise sales"
                        value={competitor.gtmMotion}
                        onChange={(e) => updateCompetitor(competitor.id, "gtmMotion", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Notable Customers</label>
                      <Input
                        placeholder="e.g., Google, Shopify, Airbnb"
                        value={competitor.notableCustomers}
                        onChange={(e) => updateCompetitor(competitor.id, "notableCustomers", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addCompetitor} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Competitor
              </Button>
            </>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CompetitiveLandscape;

