import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";

interface ProcurementSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const ProcurementSection = ({ value, onChange }: ProcurementSectionProps) => {
  return (
    <AccordionItem value="procurement" className="border rounded-lg px-4 bg-card">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-base md:text-lg">Procurement Reality Check</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-normal">
              Enterprise/public sector buying process (if relevant)
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-6">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Enterprise & Public Sector Procurement
            </label>
            <Textarea
              placeholder="Document the enterprise/public sector buying process:&#10;&#10;Vendor approvals:&#10;• Security review: 2-4 weeks, requires SOC 2&#10;• Legal review: 1-2 weeks, MSA negotiation&#10;• Procurement approval: 1-3 months, budget cycles&#10;&#10;RFP patterns:&#10;• Government RFPs: Quarterly, 60-90 day response time&#10;• Enterprise RFPs: Annual planning cycles, Q4 heavy&#10;• Typical requirements: Security, SLA, support, pricing&#10;&#10;Typical timelines:&#10;• SMB: 2-4 weeks (credit card purchase)&#10;• Mid-market: 1-3 months (procurement process)&#10;• Enterprise: 3-12 months (RFP, legal, security)&#10;• Government: 6-18 months (RFP, approvals, budget)&#10;&#10;Deal blockers ('why deals stall'):&#10;• Missing security certifications (SOC 2, ISO 27001)&#10;• Budget freeze / economic uncertainty&#10;• Internal champion leaves company&#10;• Competing priorities / lack of urgency&#10;• Legal terms (data residency, liability, indemnification)&#10;&#10;Note: Skip this section if you're targeting SMB/consumer only"
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
              <li>• Only fill this out if targeting enterprise or public sector</li>
              <li>• Interview sales reps who sell to enterprise to understand the process</li>
              <li>• Document common objections and how to overcome them</li>
              <li>• Note any certifications required to even be considered</li>
              <li>• Understand budget cycles (when do they buy?)</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ProcurementSection;

