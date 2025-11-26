import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Rocket } from "lucide-react";
import { Experiment } from "../MarketResearch";

interface EntryPlanSectionProps {
  entryPlan: string;
  experiments: Experiment[];
  onEntryPlanChange: (value: string) => void;
  onExperimentsChange: (experiments: Experiment[]) => void;
}

const EntryPlanSection = ({
  entryPlan,
  experiments,
  onEntryPlanChange,
  onExperimentsChange,
}: EntryPlanSectionProps) => {
  const addExperiment = () => {
    const newExperiment: Experiment = {
      id: Date.now().toString(),
      name: "",
      description: "",
      costRange: "",
    };
    onExperimentsChange([...experiments, newExperiment]);
  };

  const removeExperiment = (id: string) => {
    onExperimentsChange(experiments.filter((e) => e.id !== id));
  };

  const updateExperiment = (id: string, field: keyof Experiment, value: string) => {
    onExperimentsChange(
      experiments.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  return (
    <AccordionItem value="entry-plan" className="border rounded-lg px-4 bg-card">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Rocket className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-base md:text-lg">Actionable Entry Plan</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-normal">
              90-day test plan with ICP, offer, channel, and experiments
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-6">
        <div className="space-y-6">
          {/* 90-Day Plan */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              90-Day Market Entry Plan
            </label>
            <Textarea
              placeholder="Document your actionable 90-day plan:&#10;&#10;ICP (Ideal Customer Profile):&#10;• Small marketing agencies (5-20 people)&#10;• $500K-5M annual revenue&#10;• Using 3+ disconnected tools&#10;• Pain: Wasting 10+ hours/week on manual reporting&#10;&#10;Offer:&#10;• Free 14-day trial&#10;• $99/mo starter plan (up to 10 users)&#10;• Onboarding call included&#10;&#10;Channel:&#10;• LinkedIn outbound (target agency owners)&#10;• Content marketing (SEO for 'agency reporting tools')&#10;• Partner with agency consultants&#10;&#10;Sample outreach:&#10;• 'Hi [Name], noticed you're using [Tool A] and [Tool B]. We built [Product] to consolidate these into one dashboard. Would you be open to a 15-min demo?'&#10;&#10;Success metrics:&#10;• 100 outbound messages → 20 replies → 5 demos → 1 customer&#10;• Target: 10 paying customers in 90 days&#10;• Budget: $5K (ads, tools, contractors)"
              value={entryPlan}
              onChange={(e) => onEntryPlanChange(e.target.value)}
              className="min-h-[250px] resize-y"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {entryPlan.length} characters
            </p>
          </div>

          {/* Quick Experiments */}
          <div>
            <h4 className="font-medium mb-3">3 Quick Experiments (with cost ranges)</h4>
            {experiments.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">No experiments yet</p>
                <Button onClick={addExperiment} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Experiment
                </Button>
              </div>
            ) : (
              <>
                {experiments.map((experiment, index) => (
                  <Card key={experiment.id} className="mb-4">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Experiment {index + 1}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperiment(experiment.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Experiment Name</label>
                        <Input
                          placeholder="e.g., LinkedIn Outbound Test"
                          value={experiment.name}
                          onChange={(e) => updateExperiment(experiment.id, "name", e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          placeholder="What will you test? How will you measure success?"
                          value={experiment.description}
                          onChange={(e) => updateExperiment(experiment.id, "description", e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Cost Range</label>
                        <Input
                          placeholder="e.g., $500-1000"
                          value={experiment.costRange}
                          onChange={(e) => updateExperiment(experiment.id, "costRange", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button onClick={addExperiment} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Experiment
                </Button>
              </>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border">
            <h4 className="font-medium text-sm mb-2">💡 Tips:</h4>
            <ul className="text-xs md:text-sm space-y-1 text-muted-foreground">
              <li>• Be specific - vague plans don't get executed</li>
              <li>• Include actual numbers (outreach volume, conversion rates, budget)</li>
              <li>• Design experiments to test your riskiest assumptions</li>
              <li>• Keep experiments small and fast (2-4 weeks max)</li>
              <li>• Define clear success metrics before you start</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default EntryPlanSection;

