import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { TrendingUp } from "lucide-react";

interface TrendsSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const TrendsSection = ({ value, onChange }: TrendsSectionProps) => {
  return (
    <AccordionItem value="trends" className="border rounded-lg px-4 bg-card">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-base md:text-lg">Demand Signals & Trends</h3>
            <p className="text-xs md:text-sm text-muted-foreground font-normal">
              12-24 month trendlines, catalysts, and seasonality
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 pb-6">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Market Trends & Demand Signals
            </label>
            <Textarea
              placeholder="Document market trends and demand signals:&#10;&#10;12-24 month trendlines:&#10;• Remote work adoption: +40% since 2020 (Gartner)&#10;• AI tool usage: +200% YoY (McKinsey)&#10;• Cloud migration: 85% of enterprises by 2025 (IDC)&#10;&#10;Catalysts:&#10;• COVID-19 accelerated digital transformation&#10;• New regulations driving compliance software demand&#10;• Economic downturn = focus on efficiency tools&#10;&#10;Seasonality:&#10;• Q4: Budget flush, high buying activity&#10;• Q1: New year planning, strategic initiatives&#10;• Summer: Slower decision-making&#10;&#10;Google Trends / Industry proxies:&#10;• 'project management software' searches +35% YoY&#10;• LinkedIn job postings for 'remote work' +120%&#10;&#10;Analyst viewpoints:&#10;• Gartner: Market growing 15% CAGR through 2027&#10;• Forrester: 'Leaders are investing in X'&#10;&#10;Sources: [include links and publication dates]"
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
              <li>• Use Google Trends to validate search interest over time</li>
              <li>• Check analyst reports (Gartner, Forrester, IDC) for market forecasts</li>
              <li>• Note any macro trends (economic, technological, social) impacting demand</li>
              <li>• Document seasonality patterns (when do customers buy?)</li>
              <li>• Include publication dates for all sources (prefer recent data)</li>
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TrendsSection;

