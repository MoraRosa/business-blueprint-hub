

interface SlidePreviewProps {
  title: string;
  content: string;
  slideNumber: number;
  totalSlides: number;
  companyLogo?: string;
}

const SlidePreview = ({ title, content, slideNumber, totalSlides, companyLogo }: SlidePreviewProps) => {
  // Determine slide type based on title for different layouts
  const isTitleSlide = slideNumber === 1;
  const isContactSlide = title.toLowerCase().includes("contact");

  return (
    <div className="w-full aspect-[16/9] bg-gradient-to-br from-primary/5 via-background to-accent/5 border shadow-lg rounded-sm flex flex-col relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
      
      {/* Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 relative z-10">
        {isTitleSlide ? (
          // Title slide layout
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="h-16 w-16 md:h-20 md:w-20 object-contain"
                />
              ) : (
                <div className="h-16 w-16 md:h-20 md:w-20 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-muted-foreground/50">Logo</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {title || <span className="text-muted-foreground/40">Your Company Name</span>}
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              {content || <span className="text-muted-foreground/40">Your tagline here</span>}
            </p>
          </div>
        ) : isContactSlide ? (
          // Contact slide layout
          <div className="text-center space-y-6 w-full max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
              {title}
            </h2>
            <div className="text-left space-y-3 text-base md:text-lg text-muted-foreground whitespace-pre-wrap">
              {content || "Add your contact information here..."}
            </div>
          </div>
        ) : (
          // Standard content slide layout
          <div className="w-full h-full flex flex-col">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
              {title}
            </h2>
            <div className="flex-1 overflow-auto">
              <p className="text-sm md:text-lg text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {content || "Add your content here..."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer with slide number */}
      <div className="absolute bottom-4 right-6 text-xs text-muted-foreground/60">
        {slideNumber} / {totalSlides}
      </div>

      {/* Mizzie branding */}
      <div className="absolute bottom-4 left-6 flex items-center gap-2 text-xs text-muted-foreground/60">
        <img
          src="/Miss-Buzzie/images/logo.png"
          alt="Mizzie"
          className="h-4 w-4 object-contain opacity-50"
        />
        <span>Mizzie</span>
      </div>
    </div>
  );
};

export default SlidePreview;

