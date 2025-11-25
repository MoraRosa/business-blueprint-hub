import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import pptxgen from "pptxgenjs";

/**
 * Export all pitch deck slides as a single PNG image (stacked vertically)
 */
export const exportPitchDeckAsPNG = async (filename: string) => {
  // Find the preview container with all slides
  const previewContainer = document.querySelector('[data-pitch-deck-preview]');
  
  if (!previewContainer) {
    throw new Error("Please switch to Preview mode before exporting");
  }

  try {
    const canvas = await html2canvas(previewContainer as HTMLElement, {
      scale: 2,
      useCORS: false,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
      imageTimeout: 0,
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error("PNG export error:", error);
    throw new Error("Failed to export as PNG. Please try again.");
  }
};

/**
 * Export pitch deck as multi-page PDF (one slide per page)
 */
export const exportPitchDeckAsPDF = async (filename: string) => {
  // Find all slide preview elements
  const slideElements = document.querySelectorAll('[data-slide-preview]');

  if (slideElements.length === 0) {
    throw new Error("Please switch to Preview mode before exporting");
  }

  const pdf = new jsPDF("landscape", "mm", "a4");
  const pageWidth = 297; // A4 landscape width in mm
  const pageHeight = 210; // A4 landscape height in mm
  let isFirstPage = true;

  try {
    for (let i = 0; i < slideElements.length; i++) {
      const slideElement = slideElements[i] as HTMLElement;

      const canvas = await html2canvas(slideElement, {
        scale: 2,
        useCORS: false,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        imageTimeout: 0,
      });

      if (canvas.height === 0) {
        continue;
      }

      const imgData = canvas.toDataURL("image/png");

      if (!isFirstPage) {
        pdf.addPage();
      }
      isFirstPage = false;

      // Calculate dimensions to maintain aspect ratio
      const canvasAspectRatio = canvas.width / canvas.height;
      const pageAspectRatio = pageWidth / pageHeight;

      let imgWidth = pageWidth;
      let imgHeight = pageHeight;
      let xOffset = 0;
      let yOffset = 0;

      if (canvasAspectRatio > pageAspectRatio) {
        // Canvas is wider - fit to width
        imgHeight = pageWidth / canvasAspectRatio;
        yOffset = (pageHeight - imgHeight) / 2;
      } else {
        // Canvas is taller - fit to height
        imgWidth = pageHeight * canvasAspectRatio;
        xOffset = (pageWidth - imgWidth) / 2;
      }

      // Center the slide on the page with proper aspect ratio
      pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);
    }

    pdf.save(filename);
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("Failed to export as PDF. Please try again.");
  }
};

/**
 * Export pitch deck as PowerPoint (PPTX)
 */
export const exportPitchDeckAsPPTX = async (filename: string, slides: Array<{ title: string; content: string }>, companyLogo?: string) => {
  try {
    const pptx = new pptxgen();

    // Set presentation properties
    pptx.author = "Mizzie - Business Planning Made Simple";
    pptx.company = "Mizzie";
    pptx.subject = "Pitch Deck";
    pptx.title = slides[0]?.title || "Pitch Deck";

    // Define layout (16:9 aspect ratio)
    pptx.layout = "LAYOUT_16x9";

    // Define color scheme
    const primaryColor = "FFA500"; // Orange (Mizzie brand color)
    const textColor = "1F2937"; // Dark gray
    const subtleColor = "6B7280"; // Medium gray

    for (let i = 0; i < slides.length; i++) {
      const slide = pptx.addSlide();
      const { title, content } = slides[i];
      const isTitleSlide = i === 0;
      const isContactSlide = title.toLowerCase().includes("contact");

      // Add gradient background
      slide.background = { fill: "F9FAFB" };

      if (isTitleSlide) {
        // Title slide layout
        if (companyLogo) {
          // Add company logo (centered at top, maintaining aspect ratio)
          // Using only width - height will auto-calculate to maintain aspect ratio
          slide.addImage({
            data: companyLogo,
            x: "40%",
            y: "12%",
            w: 1.5, // 1.5 inches wide
            sizing: { type: "contain", w: 1.5, h: 1.5 }
          });
        }

        // Company name (large, bold)
        slide.addText(title || "Your Company Name", {
          x: "10%",
          y: companyLogo ? "30%" : "25%",
          w: "80%",
          h: "20%",
          fontSize: 44,
          bold: true,
          color: textColor,
          align: "center",
          valign: "middle",
        });

        // Tagline (subtitle)
        if (content) {
          slide.addText(content, {
            x: "10%",
            y: companyLogo ? "52%" : "47%",
            w: "80%",
            h: "15%",
            fontSize: 24,
            color: subtleColor,
            align: "center",
            valign: "middle",
          });
        }
      } else if (isContactSlide) {
        // Contact slide layout
        slide.addText(title, {
          x: "10%",
          y: "10%",
          w: "80%",
          h: "15%",
          fontSize: 36,
          bold: true,
          color: textColor,
          align: "center",
        });

        // Split content by lines for contact info
        const lines = content.split("\n").filter(line => line.trim());
        const startY = 30;
        const lineHeight = 8;

        lines.forEach((line, index) => {
          slide.addText(line, {
            x: "20%",
            y: `${startY + (index * lineHeight)}%`,
            w: "60%",
            h: "8%",
            fontSize: 18,
            color: textColor,
            align: "center",
          });
        });
      } else {
        // Standard content slide
        slide.addText(title, {
          x: "8%",
          y: "8%",
          w: "84%",
          h: "12%",
          fontSize: 32,
          bold: true,
          color: textColor,
          align: "left",
        });

        // Content area
        if (content) {
          // Check if content has bullet points
          const lines = content.split("\n").filter(line => line.trim());
          const hasBullets = lines.some(line => line.trim().startsWith("-") || line.trim().startsWith("•"));

          if (hasBullets) {
            // Format as bullet points
            const bullets = lines.map(line => {
              const text = line.replace(/^[-•]\s*/, "").trim();
              return { text, options: { bullet: true } };
            });

            slide.addText(bullets, {
              x: "8%",
              y: "25%",
              w: "84%",
              h: "60%",
              fontSize: 18,
              color: textColor,
              bullet: { code: "2022" }, // Bullet character
            });
          } else {
            // Regular paragraph text
            slide.addText(content, {
              x: "8%",
              y: "25%",
              w: "84%",
              h: "60%",
              fontSize: 18,
              color: textColor,
              align: "left",
              valign: "top",
            });
          }
        }
      }

      // Add Mizzie branding footer (subtle)
      slide.addText("Mizzie 🐝", {
        x: "2%",
        y: "92%",
        w: "20%",
        h: "5%",
        fontSize: 10,
        color: subtleColor,
        opacity: 0.5,
      });

      // Add slide number
      slide.addText(`${i + 1}`, {
        x: "92%",
        y: "92%",
        w: "6%",
        h: "5%",
        fontSize: 10,
        color: subtleColor,
        align: "right",
      });
    }

    // Save the presentation
    await pptx.writeFile({ fileName: filename });
  } catch (error) {
    console.error("PPTX export error:", error);
    throw new Error("Failed to export as PowerPoint. Please try again.");
  }
};

