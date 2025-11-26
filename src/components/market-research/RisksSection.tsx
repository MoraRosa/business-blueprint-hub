import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Risk } from "../MarketResearch";

interface RisksSectionProps {
  risks: Risk[];
  onChange: (risks: Risk[]) => void;
}

const RisksSection = ({ risks, onChange }: RisksSectionProps) => {
  const addRisk = () => {
    const newRisk: Risk = {
      id: Date.now().toString(),
      description: "",
      likelihood: "Medium",
      impact: "Medium",
    };
    onChange([...risks, newRisk]);
  };

  const removeRisk = (id: string) => {
    onChange(risks.filter((r) => r.id !== id));
  };

  const updateRisk = (id: string, field: keyof Risk, value: string) => {
    onChange(
      risks.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const getRiskColor = (likelihood: string, impact: string) => {
    if (likelihood === "High" && impact === "High") return "bg-red-500/10 border-red-500/50";
    if (likelihood === "High" || impact === "High") return "bg-orange-500/10 border-orange-500/50";
    if (likelihood === "Low" && impact === "Low") return "bg-green-500/10 border-green-500/50";
    return "bg-yellow-500/10 border-yellow-500/50";
  };

  return (
    <AccordionItem value="risks" className="border rounded-lg px-4 bg-card">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-base md:text-lg">Risks & Unknowns</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-normal">
              Top 10 risks with likelihood/impact matrix and data gaps
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-6">
        <div className="space-y-4">
          {risks.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">No risks identified yet</p>
              <Button onClick={addRisk} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add First Risk
              </Button>
            </div>
          ) : (
            <>
              {risks.map((risk, index) => (
                <Card key={risk.id} className={getRiskColor(risk.likelihood, risk.impact)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Risk {index + 1}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRisk(risk.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Risk Description</label>
                      <Input
                        placeholder="e.g., Market saturation - 50+ competitors in space"
                        value={risk.description}
                        onChange={(e) => updateRisk(risk.id, "description", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Likelihood</label>
                        <Select
                          value={risk.likelihood}
                          onValueChange={(value) => updateRisk(risk.id, "likelihood", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Impact</label>
                        <Select
                          value={risk.impact}
                          onValueChange={(value) => updateRisk(risk.id, "impact", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addRisk} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Risk
              </Button>
            </>
          )}

          <div className="bg-muted/50 p-4 rounded-lg border mt-4">
            <h4 className="font-medium text-sm mb-2">💡 Tips:</h4>
            <ul className="text-xs md:text-sm space-y-1 text-muted-foreground">
              <li>• Be honest about risks - investors appreciate transparency</li>
              <li>• Include market risks, competitive risks, execution risks, regulatory risks</li>
              <li>• Note any data gaps or unknowns (what don't you know?)</li>
              <li>• High likelihood + High impact = RED FLAG (address these first!)</li>
              <li>• Consider mitigation strategies for top risks</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default RisksSection;

