import { jsPDF } from "jspdf";

export const PDF_CONFIG = {
  margin: 20,
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  headerHeight: 80,
  footerHeight: 20,
  primaryColor: '#F37121', // Military orange
  textColors: {
    primary: '#000000',
    secondary: '#333333',
    tertiary: '#505050'
  },
  logos: {
    left: "/lovable-uploads/88714e6a-d6d6-462a-b4ec-d28d09aa7788.png",
    right: "/lovable-uploads/ff595323-ebe7-4764-a9d5-fc2bfd80f501.png"
  }
};

export const setupPDFDocument = () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.setDrawColor(0, 0, 0); // Black color for lines
  return pdf;
};

export const getContentWidth = () => {
  return PDF_CONFIG.pageWidth - (PDF_CONFIG.margin * 2);
};