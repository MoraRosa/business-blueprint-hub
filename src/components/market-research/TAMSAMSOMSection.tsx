import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from "lucide-react";

interface TAMSAMSOMSectionProps {
  tamCurrent: string;
  samCurrent: string;
  somCurrent: string;
  tamProjection: string;
  samProjection: string;
  somProjection: string;
  assumptions: string;
  onChange: (field: string, value: string) => void;
}

const TAMSAMSOMSection = ({
  tamCurrent,
  samCurrent,
  somCurrent,
  tamProjection,
  samProjection,
  somProjection,
  assumptions,
  onChange,
}: TAMSAMSOMSectionProps) => {
  return (
    <AccordionItem value="tam-sam-som" className="border rounded-lg px-4 bg-card">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-base md:text-lg">TAM / SAM / SOM</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-normal">
              Total, Serviceable, and Obtainable market size with projections
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-6">
        <div className="space-y-6">
          {/* Current Year */}
          <div>
            <h4 className="font-medium mb-3">Current Year Market Size</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  TAM (Total Addressable Market)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., $500M"
                  value={tamCurrent}
                  onChange={(e) => onChange("tamCurrent", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Total market demand
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  SAM (Serviceable Addressable Market)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., $150M"
                  value={samCurrent}
                  onChange={(e) => onChange("samCurrent", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Market you can serve
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  SOM (Serviceable Obtainable Market)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., $15M"
                  value={somCurrent}
                  onChange={(e) => onChange("somCurrent", e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Market you can capture
                </p>
              </div>
            </div>
          </div>

          {/* 3-5 Year Projections */}
          <div>
            <h4 className="font-medium mb-3">3-5 Year Projections</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  TAM Projection
                </label>
                <Input
                  type="text"
                  placeholder="e.g., $800M"
                  value={tamProjection}
                  onChange={(e) => onChange("tamProjection", e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  SAM Projection
                </label>
                <Input
                  type="text"
                  placeholder="e.g., $250M"
                  value={samProjection}
                  onChange={(e) => onChange("samProjection", e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  SOM Projection
                </label>
                <Input
                  type="text"
                  placeholder="e.g., $30M"
                  value={somProjection}
                  onChange={(e) => onChange("somProjection", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Assumptions */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Formulas, Sources & Assumptions
            </label>
            <Textarea
              placeholder="Document your calculations, data sources, and key assumptions.&#10;&#10;Example:&#10;• TAM = 50,000 companies × $10,000 avg spend = $500M (Source: Industry Report 2024)&#10;• SAM = 15,000 companies in target segment × $10,000 = $150M&#10;• SOM = 10% market share in year 3 = $15M&#10;• Growth assumption: 12% CAGR based on Gartner forecast"
              value={assumptions}
              onChange={(e) => onChange("tamAssumptions", e.target.value)}
              className="min-h-[150px] resize-y"
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg border">
            <h4 className="font-medium text-sm mb-2">💡 Tips:</h4>
            <ul className="text-xs md:text-sm space-y-1 text-muted-foreground">
              <li>• Show your math - investors want to see how you calculated these numbers</li>
              <li>• Cite credible sources (industry reports, government stats, analyst notes)</li>
              <li>• Be conservative - better to under-promise and over-deliver</li>
              <li>• Include low/base/high scenarios if there's uncertainty</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TAMSAMSOMSection;

