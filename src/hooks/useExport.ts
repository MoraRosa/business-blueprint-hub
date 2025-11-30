import { useState, useCallback } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface UseExportOptions {
  /** Element ID to capture */
  elementId: string;
  /** Base filename without extension */
  filename: string;
  /** Scale factor for export quality (default: 2) */
  scale?: number;
}

interface ExportResult {
  isExporting: boolean;
  exportPNG: () => Promise<void>;
  exportPDF: () => Promise<void>;
}

/**
 * Custom hook for exporting content as PNG or PDF
 * Reduces code duplication across all tab components
 */
export function useExport({ elementId, filename, scale = 2 }: UseExportOptions): ExportResult {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const getBackgroundColor = useCallback(() => {
    return document.documentElement.classList.contains("dark") ? "#0a0a0a" : "#ffffff";
  }, []);

  const captureElement = useCallback(async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Get all textarea values BEFORE cloning (values don't transfer in clone)
    const originalTextareas = element.querySelectorAll("textarea");
    const textareaValues: string[] = [];
    const textareaPlaceholders: string[] = [];
    originalTextareas.forEach((textarea) => {
      textareaValues.push(textarea.value);
      textareaPlaceholders.push(textarea.placeholder);
    });

    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = "absolute";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.width = `${element.offsetWidth}px`;
    document.body.appendChild(clone);

    // Replace all textareas with divs that show full content
    const clonedTextareas = clone.querySelectorAll("textarea");
    clonedTextareas.forEach((textarea, index) => {
      const value = textareaValues[index] || "";
      const placeholder = textareaPlaceholders[index] || "";

      const div = document.createElement("div");
      div.className = textarea.className;
      div.style.whiteSpace = "pre-wrap";
      div.style.wordBreak = "break-word";
      div.style.minHeight = "auto";
      div.style.height = "auto";
      div.style.overflow = "visible";

      // Get styles from the original textarea (not the clone)
      const originalTextarea = originalTextareas[index];
      if (originalTextarea) {
        const styles = window.getComputedStyle(originalTextarea);
        div.style.padding = styles.padding;
        div.style.fontSize = styles.fontSize;
        div.style.lineHeight = styles.lineHeight;
        div.style.fontFamily = styles.fontFamily;
        div.style.border = styles.border;
        div.style.borderRadius = styles.borderRadius;
        div.style.backgroundColor = styles.backgroundColor;
        div.style.color = styles.color;
      }

      div.textContent = value || placeholder;
      if (!value) {
        div.style.opacity = "0.5";
      }
      textarea.parentNode?.replaceChild(div, textarea);
    });

    try {
      const canvas = await html2canvas(clone, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: getBackgroundColor(),
      });
      return canvas;
    } finally {
      // Clean up the clone
      document.body.removeChild(clone);
    }
  }, [elementId, scale, getBackgroundColor]);

  const exportPNG = useCallback(async () => {
    setIsExporting(true);
    try {
      const canvas = await captureElement();

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Export successful",
        description: `${filename} exported as PNG`,
      });
    } catch (error) {
      console.error("PNG export failed:", error);
      toast({
        title: "Export failed",
        description: "Failed to export as PNG",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [captureElement, filename, toast]);

  const exportPDF = useCallback(async () => {
    setIsExporting(true);
    try {
      const canvas = await captureElement();

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pageHeight = 297; // A4 height in mm

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");

      // Handle multi-page PDFs
      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      } else {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      }

      pdf.save(`${filename}.pdf`);

      toast({
        title: "Export successful",
        description: `${filename} exported as PDF`,
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast({
        title: "Export failed",
        description: "Failed to export as PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [captureElement, filename, toast]);

  return { isExporting, exportPNG, exportPDF };
}

export default useExport;

