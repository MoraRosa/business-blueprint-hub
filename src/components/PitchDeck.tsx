import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, ChevronLeft, ChevronRight, Edit, Eye, Columns2, Upload, Download, FileImage, FileText, Presentation, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BrandHeader from "./BrandHeader";
import SlidePreview from "./SlidePreview";
import { exportPitchDeckAsPNG, exportPitchDeckAsPDF, exportPitchDeckAsPPTX } from "@/lib/pitchDeckExport";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Slide {
  title: string;
  content: string;
}

type ViewMode = "edit" | "split" | "preview";

const defaultSlides: Slide[] = [
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
  { title: "", content: "" },
];

// Placeholder text for each slide
const slidePlaceholders = [
  { title: "Your Company Name", content: "Your tagline here" },
  { title: "Problem", content: "What problem are you solving?" },
  { title: "Solution", content: "How does your product/service solve it?" },
  { title: "Market Opportunity", content: "How big is the market?" },
  { title: "Product/Service", content: "What do you offer?" },
  { title: "Business Model", content: "How do you make money?" },
  { title: "Traction & Milestones", content: "What progress have you made?" },
  { title: "Competition", content: "Who are your competitors?" },
  { title: "Team", content: "Who is building this?" },
  { title: "Financial Projections", content: "What are your revenue projections?" },
  { title: "Investment Ask", content: "What are you asking for?" },
  { title: "Contact Information", content: "How can investors reach you?" },
];

const PitchDeck = () => {
  const { toast } = useToast();
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [companyLogo, setCompanyLogo] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pitchDeck");
    if (saved) {
      setSlides(JSON.parse(saved));
    }
    const savedLogo = localStorage.getItem("pitchDeckLogo");
    if (savedLogo) {
      setCompanyLogo(savedLogo);
    }
  }, []);

  // Auto-save whenever slides change
  useEffect(() => {
    localStorage.setItem("pitchDeck", JSON.stringify(slides));
  }, [slides]);

  // Auto-save logo
  useEffect(() => {
    if (companyLogo) {
      localStorage.setItem("pitchDeckLogo", companyLogo);
    }
  }, [companyLogo]);

  const handleSave = () => {
    localStorage.setItem("pitchDeck", JSON.stringify(slides));
    toast({
      title: "Saved successfully",
      description: "Your pitch deck has been saved",
    });
  };

  const updateSlide = (index: number, field: keyof Slide, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCompanyLogo(result);
        toast({
          title: "Logo uploaded",
          description: "Your company logo has been added to the pitch deck",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportPNG = async () => {
    if (viewMode !== "preview") {
      toast({
        title: "Switch to Preview mode",
        description: "Please switch to Preview mode before exporting",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    toast({
      title: "Exporting...",
      description: "Creating PNG image of your pitch deck...",
    });

    try {
      await exportPitchDeckAsPNG("mizzie-pitch-deck.png");
      toast({
        title: "✅ Export successful!",
        description: "Your pitch deck has been exported as PNG",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    if (viewMode !== "preview") {
      toast({
        title: "Switch to Preview mode",
        description: "Please switch to Preview mode before exporting",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    toast({
      title: "Exporting...",
      description: "Creating multi-page PDF (this may take a moment)...",
    });

    try {
      await exportPitchDeckAsPDF("mizzie-pitch-deck.pdf");
      toast({
        title: "✅ Export successful!",
        description: "Your pitch deck has been exported as PDF",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPPTX = async () => {
    setIsExporting(true);
    toast({
      title: "Exporting...",
      description: "Creating PowerPoint presentation...",
    });

    try {
      await exportPitchDeckAsPPTX("mizzie-pitch-deck.pptx", slides, companyLogo);
      toast({
        title: "✅ Export successful!",
        description: "Your pitch deck has been exported as PowerPoint",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <BrandHeader />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Pitch Deck</h2>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
            Create a compelling pitch deck for investors and stakeholders
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handleSave} className="flex-1 sm:flex-none">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" className="flex-1 sm:flex-none" asChild>
            <label htmlFor="logo-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Logo
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" className="flex-1 sm:flex-none" disabled={isExporting}>
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export
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
              <DropdownMenuItem onClick={handleExportPPTX} disabled={isExporting}>
                <Presentation className="h-4 w-4 mr-2" />
                Export as PowerPoint
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 border rounded-lg p-1 bg-muted/50">
          <Button
            variant={viewMode === "edit" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("edit")}
            className="flex-1 sm:flex-none"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant={viewMode === "split" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("split")}
            className="flex-1 sm:flex-none"
          >
            <Columns2 className="h-4 w-4 mr-2" />
            Split
          </Button>
          <Button
            variant={viewMode === "preview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("preview")}
            className="flex-1 sm:flex-none"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="h-9 px-2 md:px-4"
          >
            <ChevronLeft className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Previous</span>
          </Button>
          <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="h-9 px-2 md:px-4"
          >
            <span className="hidden md:inline">Next</span>
            <ChevronRight className="h-4 w-4 md:ml-2" />
          </Button>
        </div>
      </div>

      {/* Main Content Area - Changes based on view mode */}
      {viewMode === "edit" && (
        <Card className="border-2">
          <CardHeader className="pb-3">
            <Input
              value={slides[currentSlide].title}
              onChange={(e) => updateSlide(currentSlide, "title", e.target.value)}
              className="text-lg md:text-2xl font-bold border-none p-0 h-auto"
              placeholder={slidePlaceholders[currentSlide].title}
            />
            <CardDescription className="text-xs md:text-sm">Slide {currentSlide + 1}</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={slides[currentSlide].content}
              onChange={(e) => updateSlide(currentSlide, "content", e.target.value)}
              placeholder={slidePlaceholders[currentSlide].content}
              className="min-h-[300px] md:min-h-[400px] text-sm md:text-base"
            />
          </CardContent>
        </Card>
      )}

      {viewMode === "split" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Edit Panel */}
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">Edit</CardTitle>
              <CardDescription className="text-xs md:text-sm">Slide {currentSlide + 1}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={slides[currentSlide].title}
                  onChange={(e) => updateSlide(currentSlide, "title", e.target.value)}
                  placeholder={slidePlaceholders[currentSlide].title}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  value={slides[currentSlide].content}
                  onChange={(e) => updateSlide(currentSlide, "content", e.target.value)}
                  placeholder={slidePlaceholders[currentSlide].content}
                  className="min-h-[250px] md:min-h-[350px] text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground px-1">Preview</div>
            <SlidePreview
              title={slides[currentSlide].title}
              content={slides[currentSlide].content}
              slideNumber={currentSlide + 1}
              totalSlides={slides.length}
              companyLogo={companyLogo}
            />
          </div>
        </div>
      )}

      {viewMode === "preview" && (
        <div className="space-y-1 bg-muted/30 p-4 rounded-lg" data-pitch-deck-preview>
          <div className="text-center mb-6 pb-4 border-b">
            <h3 className="text-lg font-semibold text-foreground">Full Pitch Deck Preview</h3>
            <p className="text-sm text-muted-foreground">Scroll to view all {slides.length} slides • Presentation Mode</p>
          </div>
          <div className="space-y-1 max-w-5xl mx-auto">
            {slides.map((slide, index) => (
              <div key={index} data-slide-preview>
                <SlidePreview
                  title={slide.title}
                  content={slide.content}
                  slideNumber={index + 1}
                  totalSlides={slides.length}
                  companyLogo={companyLogo}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-6 pt-4 border-t text-sm text-muted-foreground">
            End of Presentation
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 md:gap-2">
        {slides.map((slide, index) => (
          <Button
            key={index}
            variant={currentSlide === index ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentSlide(index)}
            className="h-auto py-2 px-3 text-xs"
          >
            <div className="truncate w-full text-left">
              {index + 1}. {slide.title || "Untitled"}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PitchDeck;
