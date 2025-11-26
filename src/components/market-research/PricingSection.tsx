import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from "lucide-react";

interface PricingSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const PricingSection = ({ value, onChange }: PricingSectionProps) => {
  return (
    <AccordionItem value="pricing" className="border rounded-lg px-4 bg-card">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-base md:text-lg">Pricing & Unit Economics</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-normal">
              Price points, discounting, payback, CAC/LTV ranges
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-6">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Pricing & Unit Economics Analysis
            </label>
            <Textarea
              placeholder="Document pricing insights and unit economics:&#10;&#10;• Common price points: $X - $Y per [unit]&#10;• Discounting patterns: Annual plans get 20% off, enterprise custom pricing&#10;• Payback benchmarks: 6-12 months typical&#10;• CAC/LTV ranges by segment:&#10;  - SMB: CAC $500, LTV $3,000 (6:1 ratio)&#10;  - Mid-market: CAC $2,000, LTV $15,000 (7.5:1 ratio)&#10;• Sources: [cite industry reports, competitor pricing pages, etc.]"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[200px] resize-y"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {value.length} characters
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg border">
            <h4 className="font-medium text-sm mb-2">💡 Tips:</h4>
            <ul className="text-xs md:text-sm space-y-1 text-muted-foreground">
              <li>• Research competitor pricing (check their websites, G2, Capterra)</li>
              <li>• Note any freemium models or free trials</li>
              <li>• Document typical contract lengths (monthly, annual, multi-year)</li>
              <li>• Include CAC (Customer Acquisition Cost) and LTV (Lifetime Value) if available</li>
              <li>• Cite sources or state if these are estimates</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PricingSection;

