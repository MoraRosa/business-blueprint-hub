import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Share2 } from "lucide-react";

interface DistributionSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const DistributionSection = ({ value, onChange }: DistributionSectionProps) => {
  return (
    <AccordionItem value="distribution" className="border rounded-lg px-4 bg-card">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Share2 className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-base md:text-lg">Distribution & GTM Channels</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-normal">
              Which channels convert, campaigns, and conversion rates
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-6">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Distribution Channels & Go-to-Market Strategy
            </label>
            <Textarea
              placeholder="Document which channels work and why:&#10;&#10;• Direct sales: Enterprise deals, avg deal size $50K, 6-month cycle&#10;• Channel partners: Resellers, system integrators (30% margin)&#10;• Marketplace: AWS Marketplace, Shopify App Store (conversion rate 2-3%)&#10;• Self-serve: Product-led growth, free trial → paid (15% conversion)&#10;• Partnerships: Strategic alliances, co-marketing&#10;&#10;Example campaigns:&#10;• LinkedIn ads → demo requests (5% CTR, $200 CPA)&#10;• Content marketing → organic leads (1,000 visitors/mo, 3% conversion)&#10;&#10;Sources: [cite case studies, industry benchmarks]"
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
              <li>• Focus on channels that are WORKING NOW (not theoretical)</li>
              <li>• Include actual conversion rates if available</li>
              <li>• Note which channels competitors use successfully</li>
              <li>• Document any partnerships or integrations that drive distribution</li>
              <li>• Be specific about campaign performance (CTR, CPA, conversion rates)</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DistributionSection;

