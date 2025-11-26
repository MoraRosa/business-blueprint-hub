import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Export Market Research report as PNG image
 */
export const exportMarketResearchAsPNG = async (elementId: string = "market-research-content") => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Market Research content not found");
  }

  // Temporarily expand all accordion items for export
  const accordionTriggers = element.querySelectorAll('[data-state="closed"]');
  const originalStates: { element: Element; state: string }[] = [];
  
  accordionTriggers.forEach((trigger) => {
    const button = trigger as HTMLElement;
    originalStates.push({ element: trigger, state: "closed" });
    button.click(); // Open the accordion
  });

  // Wait for accordions to open
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Capture the canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: document.documentElement.classList.contains("dark") ? "#0a0a0a" : "#ffffff",
  });

  // Restore original accordion states
  originalStates.forEach(({ element }) => {
    const button = element as HTMLElement;
    button.click(); // Close the accordion
  });

  // Convert to PNG and download
  const link = document.createElement("a");
  link.download = "market-research-report.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

/**
 * Export Market Research report as PDF
 */
export const exportMarketResearchAsPDF = async (elementId: string = "market-research-content") => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Market Research content not found");
  }

  // Temporarily expand all accordion items for export
  const accordionTriggers = element.querySelectorAll('[data-state="closed"]');
  const originalStates: { element: Element; state: string }[] = [];
  
  accordionTriggers.forEach((trigger) => {
    const button = trigger as HTMLElement;
    originalStates.push({ element: trigger, state: "closed" });
    button.click(); // Open the accordion
  });

  // Wait for accordions to open
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Capture the canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: document.documentElement.classList.contains("dark") ? "#0a0a0a" : "#ffffff",
  });

  // Restore original accordion states
  originalStates.forEach(({ element }) => {
    const button = element as HTMLElement;
    button.click(); // Close the accordion
  });

  // Calculate PDF dimensions
  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Create PDF
  const pdf = new jsPDF({
    orientation: imgHeight > imgWidth ? "portrait" : "landscape",
    unit: "mm",
    format: "a4",
  });

  const imgData = canvas.toDataURL("image/png");

  // If content is longer than one page, split it
  if (imgHeight > 297) {
    // A4 height
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297;

    // Add additional pages
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }
  } else {
    // Single page
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  }

  // Download PDF
  pdf.save("market-research-report.pdf");
};

/**
 * Generate filename based on market definition or company name
 */
export const generateMarketResearchFilename = (marketDefinition: string, extension: string): string => {
  if (!marketDefinition || marketDefinition.trim() === "") {
    return `market-research-report.${extension}`;
  }

  // Extract first 50 characters and sanitize
  const sanitized = marketDefinition
    .substring(0, 50)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized ? `${sanitized}-market-research.${extension}` : `market-research-report.${extension}`;
};

