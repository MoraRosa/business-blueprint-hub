import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Scale } from "lucide-react";

interface RegulatorySectionProps {
  value: string;
  onChange: (value: string) => void;
}

const RegulatorySection = ({ value, onChange }: RegulatorySectionProps) => {
  return (
    <AccordionItem value="regulatory" className="border rounded-lg px-4 bg-card">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-base md:text-lg">Regulatory & Compliance</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-normal">
              Laws, standards, certifications, and jurisdiction risks
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-6">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Regulatory & Compliance Requirements
            </label>
            <Textarea
              placeholder="Document regulatory landscape:&#10;&#10;Key laws/standards:&#10;• GDPR (EU): Data privacy requirements, €20M fines&#10;• PIPEDA (Canada): Personal information protection&#10;• SOC 2 Type II: Security certification (required by enterprise)&#10;• HIPAA (if healthcare): Patient data protection&#10;&#10;Pending changes:&#10;• Bill C-27 (Canada): New privacy law expected 2025&#10;• AI regulation: EU AI Act coming into force&#10;&#10;Certification hurdles:&#10;• SOC 2: 6-12 months, $50K-100K cost&#10;• ISO 27001: 12-18 months, $100K+ cost&#10;&#10;Risks/opportunities by jurisdiction:&#10;• Canada: Strong privacy laws = competitive advantage&#10;• US: State-by-state patchwork = compliance complexity&#10;• EU: GDPR = barrier to entry but protects incumbents"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[250px] resize-y"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {value.length} characters
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg border">
            <h4 className="font-medium text-sm mb-2">💡 Tips:</h4>
            <ul className="text-xs md:text-sm space-y-1 text-muted-foreground">
              <li>• Research industry-specific regulations (healthcare, finance, etc.)</li>
              <li>• Note any certifications required to sell to enterprise</li>
              <li>• Track pending legislation that could impact your business</li>
              <li>• Identify compliance as a competitive moat or barrier</li>
              <li>• Document costs and timelines for certifications</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default RegulatorySection;

