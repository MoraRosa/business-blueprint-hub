import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";

interface MarketDefinitionProps {
  value: string;
  onChange: (value: string) => void;
}

const MarketDefinition = ({ value, onChange }: MarketDefinitionProps) => {
  return (
    <AccordionItem value="market-definition" className="border rounded-lg px-4 bg-card">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-base md:text-lg">Market Definition & Boundaries</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-normal">
              Define your market scope, what's in/out, and adjacent categories
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-6">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Market Scope & Boundaries
            </label>
            <Textarea
              placeholder="Define your market. What's included? What's excluded? What are adjacent categories?&#10;&#10;Example:&#10;• In scope: Cloud-based project management tools for remote teams (5-50 people)&#10;• Out of scope: Enterprise solutions (50+ people), on-premise software&#10;• Adjacent: Time tracking, team communication, file sharing"
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
              <li>• Be specific about geography (Canada-first? Global?)</li>
              <li>• Define customer size (SMB, Mid-market, Enterprise)</li>
              <li>• Clarify industry verticals (if applicable)</li>
              <li>• Note what you're NOT targeting (helps focus)</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default MarketDefinition;

