import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2, Download, Loader2, FileImage, FileText, TrendingUp, AlertTriangle, Target, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BrandHeader from "./BrandHeader";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SWOTItem {
  id: string;
  text: string;
}

interface SWOTData {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
}

const SWOTAnalysis = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [data, setData] = useState<SWOTData>({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  });

  const [newItems, setNewItems] = useState({
    strengths: "",
    weaknesses: "",
    opportunities: "",
    threats: "",
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("swotAnalysis");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem("swotAnalysis", JSON.stringify(data));
  }, [data]);

  const handleSave = () => {
    localStorage.setItem("swotAnalysis", JSON.stringify(data));
    toast({
      title: "Saved successfully",
      description: "Your SWOT analysis has been saved",
    });
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById("swot-content");
      if (!element) throw new Error("SWOT content not found");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: document.documentElement.classList.contains("dark") ? "#0a0a0a" : "#ffffff",
      });

      const link = document.createElement("a");
      link.download = "swot-analysis.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Export successful",
        description: "SWOT analysis exported as PNG",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export failed",
        description: "Failed to export as PNG",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById("swot-content");
      if (!element) throw new Error("SWOT content not found");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: document.documentElement.classList.contains("dark") ? "#0a0a0a" : "#ffffff",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: imgHeight > imgWidth ? "portrait" : "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");

      // If content is longer than one page, split it
      if (imgHeight > 297) {
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= 297;
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }

      pdf.save("swot-analysis.pdf");

      toast({
        title: "Export successful",
        description: "SWOT analysis exported as PDF",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export failed",
        description: "Failed to export as PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const addItem = (category: keyof SWOTData) => {
    const text = newItems[category].trim();
    if (!text) {
      toast({
        title: "Text required",
        description: "Please enter some text before adding",
        variant: "destructive",
      });
      return;
    }

    const newItem: SWOTItem = {
      id: Date.now().toString(),
      text,
    };

    setData((prev) => ({
      ...prev,
      [category]: [...prev[category], newItem],
    }));

    setNewItems((prev) => ({
      ...prev,
      [category]: "",
    }));
  };

  const removeItem = (category: keyof SWOTData, id: string) => {
    setData((prev) => ({
      ...prev,
      [category]: prev[category].filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <BrandHeader />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">SWOT Analysis</h2>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
            Analyze your Strengths, Weaknesses, Opportunities, and Threats
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={isExporting} className="flex-1 sm:flex-none">
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 sm:mr-2 animate-spin" />
                    <span className="hidden sm:inline">Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Export</span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPNG} disabled={isExporting}>
                <FileImage className="h-4 w-4 mr-2" />
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF} disabled={isExporting}>
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleSave} className="flex-1 sm:flex-none">
            <Save className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>

      <div id="swot-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Strengths */}
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader className="bg-green-50 dark:bg-green-950/30">
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Shield className="h-5 w-5" />
                Strengths
              </CardTitle>
              <CardDescription>Internal positive factors that give you an advantage</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Strong brand recognition, Experienced team..."
                  value={newItems.strengths}
                  onChange={(e) => setNewItems({ ...newItems, strengths: e.target.value })}
                  onKeyPress={(e) => e.key === "Enter" && addItem("strengths")}
                />
                <Button onClick={() => addItem("strengths")} size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {data.strengths.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <p className="mb-2">No strengths added yet</p>
                  <p className="text-xs">Examples: Unique technology, Strong customer base, Cost advantages</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.strengths.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900"
                    >
                      <p className="flex-1 text-sm">{item.text}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeItem("strengths", item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weaknesses */}
          <Card className="border-yellow-200 dark:border-yellow-900">
            <CardHeader className="bg-yellow-50 dark:bg-yellow-950/30">
              <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <AlertTriangle className="h-5 w-5" />
                Weaknesses
              </CardTitle>
              <CardDescription>Internal negative factors that put you at a disadvantage</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Limited budget, Lack of expertise in..."
                  value={newItems.weaknesses}
                  onChange={(e) => setNewItems({ ...newItems, weaknesses: e.target.value })}
                  onKeyPress={(e) => e.key === "Enter" && addItem("weaknesses")}
                />
                <Button onClick={() => addItem("weaknesses")} size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {data.weaknesses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <p className="mb-2">No weaknesses added yet</p>
                  <p className="text-xs">Examples: Limited resources, Weak online presence, High costs</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.weaknesses.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-100 dark:border-yellow-900"
                    >
                      <p className="flex-1 text-sm">{item.text}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeItem("weaknesses", item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card className="border-blue-200 dark:border-blue-900">
            <CardHeader className="bg-blue-50 dark:bg-blue-950/30">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Target className="h-5 w-5" />
                Opportunities
              </CardTitle>
              <CardDescription>External positive factors you can capitalize on</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Growing market demand, New technology..."
                  value={newItems.opportunities}
                  onChange={(e) => setNewItems({ ...newItems, opportunities: e.target.value })}
                  onKeyPress={(e) => e.key === "Enter" && addItem("opportunities")}
                />
                <Button onClick={() => addItem("opportunities")} size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {data.opportunities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <p className="mb-2">No opportunities added yet</p>
                  <p className="text-xs">Examples: Market trends, Partnerships, Emerging technologies</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.opportunities.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900"
                    >
                      <p className="flex-1 text-sm">{item.text}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeItem("opportunities", item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Threats */}
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader className="bg-red-50 dark:bg-red-950/30">
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <TrendingUp className="h-5 w-5 rotate-180" />
                Threats
              </CardTitle>
              <CardDescription>External negative factors that could harm your business</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Strong competition, Economic downturn..."
                  value={newItems.threats}
                  onChange={(e) => setNewItems({ ...newItems, threats: e.target.value })}
                  onKeyPress={(e) => e.key === "Enter" && addItem("threats")}
                />
                <Button onClick={() => addItem("threats")} size="icon" className="shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {data.threats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  <p className="mb-2">No threats added yet</p>
                  <p className="text-xs">Examples: New competitors, Regulatory changes, Market saturation</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.threats.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900"
                    >
                      <p className="flex-1 text-sm">{item.text}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                        onClick={() => removeItem("threats", item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SWOTAnalysis;

